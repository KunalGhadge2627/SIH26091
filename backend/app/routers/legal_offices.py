from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from app.db import get_database
from app.models.legal_office import LegalOfficeResponse, DocumentChecklistResponse
from app.data.mock_legal_offices import MOCK_LEGAL_OFFICES, DOCUMENT_CHECKLISTS

router = APIRouter(prefix="/legal-offices", tags=["Legal Offices"])

@router.get("", response_model=List[LegalOfficeResponse])
async def get_legal_offices(district: Optional[str] = Query(None)):
    db = get_database()
    offices = []
    try:
        if db is not None:
            query = {"district": district} if district else {}
            cursor = db["legal_offices"].find(query)
            offices = await cursor.to_list(length=50)
            for o in offices:
                o["_id"] = str(o.get("_id"))
    except Exception:
        pass

    if not offices:
        filtered = [o for o in MOCK_LEGAL_OFFICES if not district or o["district"].lower() == district.lower()]
        offices = filtered if filtered else MOCK_LEGAL_OFFICES[:3]

    return offices

@router.get("/document-checklist", response_model=DocumentChecklistResponse)
async def get_document_checklist(category: str = Query(..., description="Business Category: Dairy, Poultry, Tailoring, Flour Mill, Two-Wheeler Repair")):
    key = category
    if key not in DOCUMENT_CHECKLISTS:
        found_key = next((k for k in DOCUMENT_CHECKLISTS if k.lower() == category.lower()), None)
        if found_key:
            key = found_key

    if key not in DOCUMENT_CHECKLISTS:
        key = "Dairy"

    return DOCUMENT_CHECKLISTS[key]
