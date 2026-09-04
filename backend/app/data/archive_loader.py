"""Load the supplied CSV mock-data archive without changing existing API fixtures."""

import csv
import io
import zipfile
from pathlib import Path
from typing import Any, Dict, Optional

from app.config import settings


ARCHIVE_FILES = {
    "schemes": "01_schemes.csv",
    "villages": "02_villages.csv",
    "business_categories": "03_business_categories.csv",
    "competitor_mapping": "04_competitor_mapping.csv",
    "market_pricing": "05_market_pricing.csv",
    "entrepreneur_cases": "06_sample_entrepreneur_cases.csv",
}

NUMERIC_COLUMNS = {
    "project_cost_min_inr", "project_cost_max_inr", "margin_pct", "loan_pct",
    "max_loan_amount_inr", "interest_rate_pct_pa", "tenure_years",
    "moratorium_months", "population", "households",
    "avg_monthly_household_income_inr", "distance_to_nearest_town_km",
    "market_days_per_week", "estimated_consumer_base_5km",
    "estimated_consumer_base_10km", "electrification_pct",
    "mobile_internet_penetration_pct", "existing_businesses_count",
    "avg_distance_between_competitors_km", "suggested_price_min",
    "suggested_price_max", "input_available_margin_capital_inr",
    "computed_project_cost_inr", "computed_max_loan_amount_inr",
    "estimated_quarterly_emi_inr",
}


def _coerce_row(row: Dict[str, str]) -> Dict[str, Any]:
    result: Dict[str, Any] = {}
    for key, value in row.items():
        if value == "":
            result[key] = None
        elif key in NUMERIC_COLUMNS:
            number = float(value)
            result[key] = int(number) if number.is_integer() else number
        else:
            result[key] = value
    return result


def _default_archive_path() -> Path:
    return Path(__file__).resolve().parents[3] / "mock_data" / "files.zip"


def load_mock_archive(path: Optional[str] = None) -> Dict[str, list]:
    """Return all archive tables keyed by logical table name.

    The path can be supplied through ``MOCK_DATA_ZIP`` or directly for tests.
    Missing archives return empty tables so the existing fixtures remain usable.
    """
    archive_path = Path(path or settings.MOCK_DATA_ZIP or _default_archive_path())
    data = {name: [] for name in ARCHIVE_FILES}
    if not archive_path.is_file():
        return data

    with zipfile.ZipFile(archive_path) as archive:
        for table_name, filename in ARCHIVE_FILES.items():
            with archive.open(filename) as raw_file:
                text_file = io.TextIOWrapper(raw_file, encoding="utf-8-sig", newline="")
                data[table_name] = [_coerce_row(row) for row in csv.DictReader(text_file)]
    return data