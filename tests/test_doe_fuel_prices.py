"""Parser regressions: dates, brands, missing adjustments and invalid values."""
import unittest
from scripts.update_doe_fuel_prices import links_from_html, price_change, summary_for, table_companies, week_dates


class DoeFuelReaderTests(unittest.TestCase):
    def test_week_dates(self):
        self.assertEqual(week_dates("For the week October 20-26, 2026"), ("2026-10-20", "2026-10-26"))
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
