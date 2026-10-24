"""Parser regressions: dates, brands, missing adjustments and invalid values."""
import unittest
from scripts.update_doe_fuel_prices import links_from_html, price_change, summary_for, table_companies, week_dates, narrative_changes


class DoeFuelReaderTests(unittest.TestCase):
    def test_week_dates(self):
        self.assertEqual(week_dates("For the week October 20-26, 2026"), ("2026-10-20", "2026-10-26"))
        self.assertEqual(week_dates("Summary of Prior Notice on Price Adjustments October 20-26, 2026 For Fuels"), ("2026-10-20", "2026-10-26"))
        self.assertEqual(week_dates("Price Adjustment on Fuel 20-26 Oct 2026"), ("2026-10-20", "2026-10-26"))
        self.assertEqual(week_dates("For the week September 29-October 5, 2026"), ("2026-09-29", "2026-10-05"))
        self.assertEqual(week_dates("For the week December 30-January 5, 2027"), ("2026-12-30", "2027-01-05"))

    def test_official_links_only(self):
        good = '<a href="https://d24qbtp4vooyzi.cloudfront.net/api/media/file/Price%20Adjustment.pdf?prefix=dev%2Fmedia">Prior Notice on Price Adjustments</a>'
        evil = '<a href="https://evil.example/Price%20Adjustment.pdf">not DOE</a>'
        self.assertEqual(len(links_from_html(good + good + evil)), 1)

    def test_blank_means_unreported(self):
        rows = [
            ["Oil Company", "Date", "Effectivity", "Gasoline", "Diesel", "Kerosene"],
            ["Shell", "Oct 19", "Oct 20", "-4.30", "2.60", "-1.00"],
            ["Petro Gazz", "Oct 19", "Oct 20", "-4.30", "2.60", ""],
            ["Seaoil", "Oct 19", "Oct 20", "-4.30", "2.60", "-1.00"],
        ]
        brands = table_companies(rows)
        self.assertIsNone(brands[1]["kerosene"])
        self.assertEqual(summary_for(brands)["kerosene"], {"min": -1.0, "max": -1.0, "reportingCompanies": 2})

    def test_four_column_narrative_with_vat_notes(self):
        rows = [
            ["Oil Company", "Date & Time of SMS", "Date & Time of Effectivity", "Price Adjustments"],
            ["Shell Pilipinas Corporation", "8:03 AM October 14", "6:00 AM October 15",
             "P2.65/lit for gasoline\nP2.70/lit for diesel\nP2.60/lit for kerosene\n(VAT inclusive)"],
            ["Seaoil", "9:07 AM October 14", "6:00 AM October 15",
             "(P0.10)/lit for gasoline\nP0.75/lit for diesel"],
            ["Petro Gazz", "9:14 AM October 14", "6:00 AM October 15",
             "P2.65/lit for gasoline\nP2.70/lit for diesel"],
        ]
        companies = table_companies(rows)
        self.assertEqual(len(companies), 3)
        self.assertEqual(companies[0]["gasoline"], 2.65)
        self.assertEqual(companies[0]["diesel"], 2.70)
        self.assertEqual(companies[0]["kerosene"], 2.60)
        self.assertEqual(companies[1]["gasoline"], -0.10)
        self.assertIsNone(companies[1]["kerosene"])

    def test_product_first_reports(self):
        self.assertEqual(narrative_changes(
            "Gasoline 1.75/liter increase\nDiesel 2.60/liter increase\nKerosene 2.40/liter increase"
        ), [1.75, 2.60, 2.40])

    def test_product_first_direction_signs_are_not_lost_to_whitespace(self):
        self.assertEqual(
            narrative_changes("Gasoline P4.30 decrease\nDiesel P2.60 increase\nKerosene P1.00 rollback"),
            [-4.30, 2.60, -1.00]
        )
        with self.assertRaises(ValueError):
            narrative_changes("Gasoline -P4.30 increase")

    def test_multiple_price_changes_require_review(self):
        with self.assertRaises(ValueError):
            narrative_changes("Gasoline 1.75/liter increase\nGasoline 1.30/liter increase\nDiesel 3.00/liter increase")

    def test_brand_range(self):
        brands = [
            {"company": "Shell", "gasoline": 1.50, "diesel": -3.0, "kerosene": None},
            {"company": "Seaoil", "gasoline": 1.56, "diesel": -3.01, "kerosene": None},
        ]
        self.assertEqual(summary_for(brands)["gasoline"], {"min": 1.50, "max": 1.56, "reportingCompanies": 2})
        self.assertIsNone(summary_for(brands)["kerosene"])

    def test_invalid_cells(self):
        with self.assertRaises(ValueError):
            price_change("October 20")
        with self.assertRaises(ValueError):
            week_dates("no dates")


if __name__ == "__main__":
    unittest.main()
