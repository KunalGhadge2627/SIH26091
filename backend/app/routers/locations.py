from typing import List, Optional
from fastapi import APIRouter, Query
from app.db import get_database
from app.models.village import VillageModel
from app.data.mock_villages import MOCK_VILLAGES
from app.data.mock_location_directory import MOCK_LOCATION_VILLAGES, STATE_DIRECTORY

router = APIRouter(prefix="/locations", tags=["Locations"])


def _unique(values):
    return list(dict.fromkeys(values))


@router.get("/states", response_model=List[str])
async def get_states():
    db = get_database()
    states = []
    try:
        if db is not None:
            states = await db["villages"].distinct("state")
    except Exception:
        pass
        
    return _unique(states + list(STATE_DIRECTORY) + [v["state"] for v in MOCK_VILLAGES])

@router.get("/districts", response_model=List[str])
async def get_districts(state: Optional[str] = Query(None)):
    db = get_database()
    districts = []
    try:
        if db is not None:
            query = {"state": state} if state else {}
            districts = await db["villages"].distinct("district", query)
    except Exception:
        pass
        
    directory_districts = STATE_DIRECTORY.get(state, {}).get("districts", []) if state else [
        district
        for state_info in STATE_DIRECTORY.values()
        for district in state_info["districts"]
    ]
    mock_districts = [
        v["district"] for v in MOCK_VILLAGES
        if not state or v["state"] == state
    ]
    return _unique(districts + directory_districts + mock_districts)

@router.get("/blocks", response_model=List[str])
async def get_blocks(state: Optional[str] = Query(None), district: Optional[str] = Query(None)):
    db = get_database()
    blocks = []
    try:
        if db is not None:
            query = {}
            if state: query["state"] = state
            if district: query["district"] = district
            blocks = await db["villages"].distinct("block", query)
    except Exception:
        pass
        
    directory_matches = [
        v for v in MOCK_LOCATION_VILLAGES
        if (not state or v["state"] == state)
        and (not district or v["district"] == district)
    ]
    mock_matches = [
        v for v in MOCK_VILLAGES
        if (not state or v["state"] == state)
        and (not district or v["district"] == district)
    ]
    return _unique(blocks + [v["block"] for v in directory_matches + mock_matches])

@router.get("/villages", response_model=List[VillageModel])
async def get_villages(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    block: Optional[str] = Query(None)
):
    db = get_database()
    villages = []
    try:
        if db is not None:
            query = {}
            if state: query["state"] = state
            if district: query["district"] = district
            if block: query["block"] = block
            
            cursor = db["villages"].find(query)
            villages = await cursor.to_list(length=100)
    except Exception:
        pass
        
    fallback_villages = [
        v for v in MOCK_LOCATION_VILLAGES + MOCK_VILLAGES
        if (not state or v["state"] == state)
        and (not district or v["district"] == district)
        and (not block or v["block"] == block)
    ]
    villages_by_id = {v["village_id"]: v for v in fallback_villages}
    villages_by_id.update({v["village_id"]: v for v in villages})
    villages = list(villages_by_id.values())
        
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
        village = next(
            (v for v in MOCK_LOCATION_VILLAGES + MOCK_VILLAGES if v["village_id"] == village_id),
            MOCK_VILLAGES[0]
        )
        
    if "_id" in village: village["_id"] = str(village.get("_id"))
    return village
