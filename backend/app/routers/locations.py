from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from app.db import get_database
from app.models.village import VillageModel
from app.data.mock_villages import MOCK_VILLAGES
from app.data.mock_location_directory import MOCK_LOCATION_VILLAGES, STATE_DIRECTORY
from app.data.real_census_loader import REAL_CENSUS_STATES, REAL_CENSUS_VILLAGES

router = APIRouter(prefix="/locations", tags=["Locations"])


def _census_by_location():
    return {(v["state"], v["district"], v["block"]): v for v in REAL_CENSUS_VILLAGES}


REAL_CENSUS_BY_LOCATION = _census_by_location()


def _with_census_data(village):
    census = REAL_CENSUS_BY_LOCATION.get((village["state"], village["district"], village["block"]))
    if not census:
        return village
    merged = dict(village)
    for field in ("population", "households", "workers", "literacy_rate", "data_year", "source",
                  "sc_population", "st_population", "literate_population", "match_status"):
        if field in census:
            merged[field] = census[field]
    return merged

@router.get("/states", response_model=List[str])
async def get_states():
    return list(dict.fromkeys(REAL_CENSUS_STATES + list(STATE_DIRECTORY)))

@router.get("/districts", response_model=List[str])
async def get_districts(state: Optional[str] = Query(None)):
    real_districts = [v["district"] for v in REAL_CENSUS_VILLAGES if not state or v["state"] == state]
    fallback_districts = STATE_DIRECTORY.get(state, {}).get("districts", [])
    return list(dict.fromkeys(real_districts + fallback_districts))

@router.get("/blocks", response_model=List[str])
async def get_blocks(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
):
    source = REAL_CENSUS_VILLAGES or MOCK_LOCATION_VILLAGES
    filtered = [v for v in source
                if (not state or v["state"] == state)
                and (not district or v["district"] == district)]
    return list(dict.fromkeys([v["block"] for v in filtered]))

@router.get("/villages", response_model=List[VillageModel])
async def get_villages(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    block: Optional[str] = Query(None)
):
    mock_villages = MOCK_LOCATION_VILLAGES
    real_villages = REAL_CENSUS_VILLAGES
    villages = mock_villages
    if state: villages = [v for v in villages if v["state"] == state]
    if district: villages = [v for v in villages if v["district"] == district]
    if block: villages = [v for v in villages if v["block"] == block]
    if not villages:
        villages = real_villages
        if state: villages = [v for v in villages if v["state"] == state]
        if district: villages = [v for v in villages if v["district"] == district]
        if block: villages = [v for v in villages if v["block"] == block]
    else:
        villages = [_with_census_data(v) for v in villages]
        
    for v in villages:
        if "_id" in v: v["_id"] = str(v.get("_id"))
    return villages

@router.get("/villages/{village_id}", response_model=VillageModel)
async def get_village_by_id(village_id: str):
    db = get_database()
    village = None
    try:
        if db is not None:
            village = await db["villages"].find_one({"village_id": village_id})
    except Exception:
        pass
        
    if not village:
        village = next((v for v in REAL_CENSUS_VILLAGES + MOCK_LOCATION_VILLAGES + MOCK_VILLAGES
                        if v["village_id"] == village_id), MOCK_LOCATION_VILLAGES[0])
        
    if "_id" in village: village["_id"] = str(village.get("_id"))
    return village
