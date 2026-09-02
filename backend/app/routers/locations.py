from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException
from app.db import get_database
from app.models.village import VillageModel
from app.data.mock_villages import MOCK_VILLAGES

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("/states", response_model=List[str])
async def get_states():
    db = get_database()
    states = []
    try:
        if db is not None:
            states = await db["villages"].distinct("state")
    except Exception:
        pass
        
    if not states:
        states = list(dict.fromkeys([v["state"] for v in MOCK_VILLAGES]))
    return states

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
        
    if not districts:
        filtered = [v for v in MOCK_VILLAGES if not state or v["state"] == state]
        districts = list(dict.fromkeys([v["district"] for v in filtered]))
        if not districts:
            districts = ["Pune", "District Center"]
    return districts

@router.get("/blocks", response_model=List[str])
async def get_blocks(district: Optional[str] = Query(None)):
    db = get_database()
    blocks = []
    try:
        if db is not None:
            query = {"district": district} if district else {}
            blocks = await db["villages"].distinct("block", query)
    except Exception:
        pass
        
    if not blocks:
        filtered = [v for v in MOCK_VILLAGES if not district or v["district"] == district]
        blocks = list(dict.fromkeys([v["block"] for v in filtered]))
        if not blocks:
            blocks = ["Shirur", "Block Center"]
    return blocks

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
        
    if not villages:
        filtered = MOCK_VILLAGES
        if state: filtered = [v for v in filtered if v["state"] == state]
        if district: filtered = [v for v in filtered if v["district"] == district]
        if block: filtered = [v for v in filtered if v["block"] == block]
        villages = filtered if filtered else MOCK_VILLAGES[:3]
        
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
        village = next((v for v in MOCK_VILLAGES if v["village_id"] == village_id), MOCK_VILLAGES[0])
        
    if "_id" in village: village["_id"] = str(village.get("_id"))
    return village
