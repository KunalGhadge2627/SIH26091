from typing import List, Optional

from fastapi import APIRouter, Query

from app.db import get_database
from app.models.village import VillageModel
from app.data.mock_villages import MOCK_VILLAGES
from app.data.mock_location_directory import (
    MOCK_LOCATION_VILLAGES,
    STATE_DIRECTORY,
)
from app.data.real_census_loader import (
    REAL_CENSUS_STATES,
    REAL_CENSUS_VILLAGES,
)


router = APIRouter(prefix="/locations", tags=["Locations"])


def _census_by_location():
    return {
        (v["state"], v["district"], v["block"]): v
        for v in REAL_CENSUS_VILLAGES
    }


REAL_CENSUS_BY_LOCATION = _census_by_location()


def _with_census_data(village):
    census = REAL_CENSUS_BY_LOCATION.get(
        (
            village["state"],
            village["district"],
            village["block"],
        )
    )

    if not census:
        return village

    merged = dict(village)

    for field in (
        "population",
        "households",
        "workers",
        "literacy_rate",
        "data_year",
        "source",
        "sc_population",
        "st_population",
        "literate_population",
        "match_status",
    ):
        if field in census:
            merged[field] = census[field]

    return merged


@router.get("/states", response_model=List[str])
async def get_states():
    """
    Return available states from real census data
    and the fallback state directory.
    """
    return list(
        dict.fromkeys(
            REAL_CENSUS_STATES + list(STATE_DIRECTORY)
        )
    )


@router.get("/districts", response_model=List[str])
async def get_districts(
    state: Optional[str] = Query(None),
):
    """
    Return districts filtered by state.
    Uses real census data first and the
    state directory as a fallback.
    """
    real_districts = [
        v["district"]
        for v in REAL_CENSUS_VILLAGES
        if not state or v["state"] == state
    ]

    fallback_districts = STATE_DIRECTORY.get(
        state, {}
    ).get("districts", [])

    return list(
        dict.fromkeys(
            real_districts + fallback_districts
        )
    )


@router.get("/blocks", response_model=List[str])
async def get_blocks(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
):
    """
    Return blocks filtered by state and district.

    Priority:
    1. MongoDB villages collection
    2. Real census data
    3. Mock location data
    4. Legacy mock village data
    """

    # --------------------------------------------------
    # 1. Try MongoDB first
    # --------------------------------------------------
    db = get_database()
    blocks = []

    try:
        if db is not None:
            query = {}

            if state:
                query["state"] = state

            if district:
                query["district"] = district

            blocks = await db["villages"].distinct(
                "block",
                query,
            )

    except Exception:
        # Database failure should not break the API.
        blocks = []

    # --------------------------------------------------
    # 2. If MongoDB has no data, use real census data
    # --------------------------------------------------
    if not blocks:
        census_source = REAL_CENSUS_VILLAGES

        filtered = [
            v
            for v in census_source
            if (not state or v["state"] == state)
            and (
                not district
                or v["district"] == district
            )
        ]

        blocks = list(
            dict.fromkeys(
                v["block"]
                for v in filtered
                if v.get("block")
            )
        )

    # --------------------------------------------------
    # 3. If real census has no data, use mock location data
    # --------------------------------------------------
    if not blocks:
        filtered = MOCK_LOCATION_VILLAGES

        if state:
            filtered = [
                v
                for v in filtered
                if v["state"] == state
            ]

        if district:
            filtered = [
                v
                for v in filtered
                if v["district"] == district
            ]

        blocks = list(
            dict.fromkeys(
                v["block"]
                for v in filtered
                if v.get("block")
            )
        )

    # --------------------------------------------------
    # 4. Legacy mock data fallback
    # --------------------------------------------------
    if not blocks:
        filtered = MOCK_VILLAGES

        if state:
            filtered = [
                v
                for v in filtered
                if v["state"] == state
            ]

        if district:
            filtered = [
                v
                for v in filtered
                if v["district"] == district
            ]

        blocks = list(
            dict.fromkeys(
                v["block"]
                for v in filtered
                if v.get("block")
            )
        )

    # --------------------------------------------------
    # 5. Final fallback
    # --------------------------------------------------
    if not blocks:
        blocks = [
            "Shirur",
            "Block Center",
        ]

    return blocks


@router.get(
    "/villages",
    response_model=List[VillageModel],
)
async def get_villages(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    block: Optional[str] = Query(None),
):
    """
    Return villages filtered by state,
    district, and block.

    Mock location data is preferred and
    real census data is used as fallback.
    """

    mock_villages = MOCK_LOCATION_VILLAGES
    real_villages = REAL_CENSUS_VILLAGES

    villages = mock_villages

    if state:
        villages = [
            v
            for v in villages
            if v["state"] == state
        ]

    if district:
        villages = [
            v
            for v in villages
            if v["district"] == district
        ]

    if block:
        villages = [
            v
            for v in villages
            if v["block"] == block
        ]

    # --------------------------------------------------
    # Fallback to real census villages
    # --------------------------------------------------
    if not villages:
        villages = real_villages

        if state:
            villages = [
                v
                for v in villages
                if v["state"] == state
            ]

        if district:
            villages = [
                v
                for v in villages
                if v["district"] == district
            ]

        if block:
            villages = [
                v
                for v in villages
                if v["block"] == block
            ]

    else:
        villages = [
            _with_census_data(v)
            for v in villages
        ]

    # Convert MongoDB ObjectId to string
    for village in villages:
        if "_id" in village:
            village["_id"] = str(
                village.get("_id")
            )

    return villages


@router.get(
    "/villages/{village_id}",
    response_model=VillageModel,
)
async def get_village_by_id(
    village_id: str,
):
    """
    Return a village by its village_id.

    Priority:
    1. MongoDB
    2. Real census data
    3. Mock location data
    4. Legacy mock data
    """

    db = get_database()
    village = None

    # --------------------------------------------------
    # 1. Try MongoDB
    # --------------------------------------------------
    try:
        if db is not None:
            village = await db["villages"].find_one(
                {"village_id": village_id}
            )

    except Exception:
        village = None

    # --------------------------------------------------
    # 2. Fallback to local data
    # --------------------------------------------------
    if not village:
        all_villages = (
            REAL_CENSUS_VILLAGES
            + MOCK_LOCATION_VILLAGES
            + MOCK_VILLAGES
        )

        village = next(
            (
                v
                for v in all_villages
                if v.get("village_id") == village_id
            ),
            None,
        )

    # --------------------------------------------------
    # 3. Final fallback
    # --------------------------------------------------
    if not village:
        if MOCK_LOCATION_VILLAGES:
            village = MOCK_LOCATION_VILLAGES[0]
        elif MOCK_VILLAGES:
            village = MOCK_VILLAGES[0]
        elif REAL_CENSUS_VILLAGES:
            village = REAL_CENSUS_VILLAGES[0]
        else:
            return None

    # Convert MongoDB ObjectId to string
    if "_id" in village:
        village["_id"] = str(
            village.get("_id")
        )

    return village