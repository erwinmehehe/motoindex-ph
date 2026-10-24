#!/usr/bin/env python3
"""Sync official DOE weekly fuel price *changes*, not retail pump prices."""
from __future__ import annotations

import argparse
from datetime import date, datetime, timezone
from io import BytesIO
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urljoin, urlparse

from bs4 import BeautifulSoup
import pdfplumber
import requests

DOE_PAGE = "https://doe.gov.ph/data-and-prices/liquid-fuels/retail-pump-prices/price-adjustments"
ALLOWED_PDF_HOSTS = {"d24qbtp4vooyzi.cloudfront.net", "doe.gov.ph", "www.doe.gov.ph"}
USER_AGENT = "MotoIndexPH-DOE-Fuel-Notice-Reader/1.0 (public DOE price adjustments)"
AMOUNT_PATTERN = re.compile(r"^[+\-\u2212]?\d{1,3}(?:\.\d{1,2})?$")
WEEK_PATTERN = re.compile(
    r"for\s+the\s+week\s+(?P<from_month>[A-Za-z]+)\s+(?P<from_day>\d{1,2})\s*"
    r"[-\u2013\u2014]\s*(?:(?P<to_month>[A-Za-z]+)\s+)?(?P<to_day>\d{1,2})\s*,?\s*"
    r"(?P<year>20\d{2})", re.IGNORECASE
)
TABLE_SETTINGS = {"vertical_strategy": "lines", "horizontal_strategy": "lines", "snap_tolerance": 4,
                  "join_tolerance": 4, "intersection_tolerance": 5, "text_tolerance": 3}
PRODUCTS = ("gasoline", "diesel", "kerosene")
MAX_PDFS_TO_TRY = 11
MAX_WEEKS = 8


def normalize(value: object) -> str:
    return re.sub(r"\s+", " ", str(value or "").replace("\u2212", "-")).strip()


def month_number(name: str) -> int:
    return datetime.strptime(name[:3].title(), "%b").month


def week_dates(text: str) -> tuple[str, str]:
    match = WEEK_PATTERN.search(normalize(text))
    if not match:
        raise ValueError("Missing recognizable 'For the week' date range in DOE PDF")
    parts = match.groupdict()
    start_month = month_number(parts["from_month"])
    end_month = month_number(parts["to_month"] or parts["from_month"])
    end_year = int(parts["year"])
    start_year = end_year - 1 if start_month == 12 and end_month == 1 else end_year
    start = date(start_year, start_month, int(parts["from_day"]))
    end = date(end_year, end_month, int(parts["to_day"]))
    if not 0 <= (end - start).days <= 10:
        raise ValueError(f"Unexpected DOE notice period: {start} to {end}")
    return start.isoformat(), end.isoformat()


def price_change(cell: object) -> float | None:
    value = normalize(cell).replace(" ", "")
    if not value or value in {"-", "--", "N/A", "n/a"}:
        return None  # Blank means unreported, not a zero change.
    if not AMOUNT_PATTERN.fullmatch(value):
        raise ValueError(f"Unrecognized price adjustment cell: {value!r}")
    amount = round(float(value), 2)
    if abs(amount) > 50:
        raise ValueError(f"Implausible price adjustment per liter: {amount}")
    return amount


def table_companies(rows: list[list[object]]) -> list[dict[str, object]]:
    companies: list[dict[str, object]] = []
    seen: set[str] = set()
    for row in rows:
        if len(row) < 6:
            continue
        company = normalize(row[0])
        if not company or company.casefold() in {"oil company", "products"}:
            continue
        if any(word in company.casefold() for word in ("summary of prior", "for the week")):
            continue
        values = row[-3:]
        try:
            changes = [price_change(cell) for cell in values]
        except ValueError:
            if not any(re.fullmatch(r"[+\-\u2212]?\d+(?:\.\d+)?", normalize(c)) for c in values):
                continue  # Table heading or footer.
            raise
        if all(change is None for change in changes):
            continue
        if len(company) > 80 or any(char.isdigit() for char in company):
            raise ValueError(f"Unrecognized oil-company label: {company!r}")
        identity = company.casefold()
        if identity in seen:
            raise ValueError(f"Duplicate oil company in one notice: {company}")
        seen.add(identity)
        companies.append({"company": company, **dict(zip(PRODUCTS, changes))})
    return companies


def summary_for(companies: list[dict[str, object]]) -> dict[str, dict[str, float | int] | None]:
    result: dict[str, dict[str, float | int] | None] = {}
    for product in PRODUCTS:
        changes = [c[product] for c in companies if isinstance(c[product], (int, float))]
        result[product] = {"min": min(changes), "max": max(changes), "reportingCompanies": len(changes)} if changes else None
    return result


def links_from_html(html: str) -> list[tuple[str, str]]:
    soup = BeautifulSoup(html, "html.parser")
    result: list[tuple[str, str]] = []
    seen: set[str] = set()
    for anchor in soup.select("a[href]"):
        url = urljoin(DOE_PAGE, anchor.get("href", ""))
        parsed = urlparse(url)
        if parsed.scheme != "https" or parsed.hostname not in ALLOWED_PDF_HOSTS:
            continue
        if not unquote(parsed.path).lower().endswith(".pdf"):
            continue
        title = normalize(anchor.get_text(" ", strip=True))
        if "adjust" not in (title + " " + unquote(parsed.path)).lower():
            continue
        if url not in seen:
            seen.add(url)
            result.append((url, title or "DOE prior notice on price adjustments"))
    return result


def fetch(session: requests.Session, url: str, *, pdf: bool = False) -> bytes:
    response = session.get(url, timeout=(10, 35), headers={"User-Agent": USER_AGENT}, allow_redirects=True)
    response.raise_for_status()
    if pdf:
        if urlparse(response.url).hostname not in ALLOWED_PDF_HOSTS:
            raise ValueError(f"Unexpected PDF redirect destination: {response.url}")
        if len(response.content) > 4_000_000 or not response.content.startswith(b"%PDF-"):
            raise ValueError(f"Invalid or too large DOE PDF at {url}")
    return response.content


def parse_pdf(pdf_bytes: bytes, *, url: str, source_title: str) -> dict[str, object]:
    with pdfplumber.open(BytesIO(pdf_bytes)) as document:
        text = "\n".join(page.extract_text() or "" for page in document.pages)
        week_start, week_end = week_dates(text)
        companies: list[dict[str, object]] = []
        for page in document.pages:
            for table in page.extract_tables(table_settings=TABLE_SETTINGS):
                found = table_companies(table)
                if len(found) > len(companies):
                    companies = found
    if len(companies) < 3 or not any(row["gasoline"] is not None for row in companies) or not any(row["diesel"] is not None for row in companies):
        raise ValueError(f"Incomplete or unrecognized DOE oil-company table: {url}")
    return {"weekStart": week_start, "weekEnd": week_end, "sourceTitle": source_title,
            "sourceUrl": url, "companies": companies, "summary": summary_for(companies)}


def update(output: Path, session: requests.Session) -> bool:
    links = links_from_html(fetch(session, DOE_PAGE).decode("utf-8", "replace"))
    if not links:
        raise ValueError("DOE page returned no adjustment PDFs; preserving prior feed")
    weeks: list[dict[str, object]] = []
    starts: set[str] = set()
    for index, (url, title) in enumerate(links[:MAX_PDFS_TO_TRY]):
        try:
            week = parse_pdf(fetch(session, url, pdf=True), url=url, source_title=title)
        except Exception as error:
            if index == 0:
                raise RuntimeError(f"Latest DOE notice could not be verified ({url}): {error}") from error
            print(f"Warning: older notice skipped ({url}): {error}", file=sys.stderr)
            continue
        if week["weekStart"] not in starts:
            starts.add(week["weekStart"])
            weeks.append(week)
    weeks.sort(key=lambda week: str(week["weekStart"]), reverse=True)
    weeks = weeks[:MAX_WEEKS]
    if not weeks:
        raise RuntimeError("No valid DOE notice parsed")
    age = (date.today() - date.fromisoformat(str(weeks[0]["weekStart"]))).days
    if age > 21:
        raise RuntimeError(f"Latest DOE report is {age} days old; inspect upstream source before publishing")
    if age < -7:
        raise RuntimeError("DOE latest report date is unexpectedly far in the future")
    previous = json.loads(output.read_text(encoding="utf-8")) if output.exists() else {}
    if previous.get("weeks") == weeks:
        print(f"No change; latest DOE notice begins {weeks[0]['weekStart']}")
        return False
    feed = {"schemaVersion": 1, "sourcePage": DOE_PAGE,
            "updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
            "weeks": weeks}
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(feed, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Updated {len(weeks)} verified DOE notices; latest begins {weeks[0]['weekStart']}")
    return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    try:
        with requests.Session() as session:
            update(args.output, session)
    except Exception as error:
        print(f"DOE fuel-price sync failed: {error}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
