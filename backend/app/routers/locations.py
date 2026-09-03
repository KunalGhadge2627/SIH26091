from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from app.db import get_database
from app.models.village import VillageModel
from app.data.mock_villages import MOCK_VILLAGES
from app.data.mock_location_directory import MOCK_LOCATION_VILLAGES, STATE_DIRECTORY

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("/states", response_model=List[str])
async def get_states():
    return list(STATE_DIRECTORY)

@router.get("/districts", response_model=List[str])
async def get_districts(state: Optional[str] = Query(None)):
    if state in STATE_DIRECTORY:
        return STATE_DIRECTORY[state]["districts"]
    return []

@router.get("/blocks", response_model=List[str])
async def get_blocks(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
):
    filtered = [v for v in MOCK_LOCATION_VILLAGES
                if (not state or v["state"] == state)
                and (not district or v["district"] == district)]
    return list(dict.fromkeys([v["block"] for v in filtered]))

@router.get("/villages", response_model=List[VillageModel])
async def get_villages(
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    block: Optional[str] = Query(None)
):
    villages = MOCK_LOCATION_VILLAGES
    if state: villages = [v for v in villages if v["state"] == state]
    if district: villages = [v for v in villages if v["district"] == district]
    if block: villages = [v for v in villages if v["block"] == block]
        
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
        village = next((v for v in MOCK_LOCATION_VILLAGES + MOCK_VILLAGES
                        if v["village_id"] == village_id), MOCK_LOCATION_VILLAGES[0])
        
    if "_id" in village: village["_id"] = str(village.get("_id"))
    return village
