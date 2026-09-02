from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from app.db import get_database
from app.auth.security import get_current_user
from app.models.legal_office import LegalOfficeResponse, DocumentChecklistResponse
from app.data.mock_legal_offices import DOCUMENT_CHECKLISTS

router = APIRouter(prefix="/legal-offices", tags=["Legal Offices"])

@router.get("", response_model=List[LegalOfficeResponse])
async def get_legal_offices(district: Optional[str] = Query(None), current_user: dict = Depends(get_current_user)):
    db = get_database()
    query = {"district": district} if district else {}
    cursor = db["legal_offices"].find(query)
    offices = await cursor.to_list(length=50)
    for o in offices:
        o["_id"] = str(o.get("_id"))
    return offices

@router.get("/document-checklist", response_model=DocumentChecklistResponse)
async def get_document_checklist(category: str = Query(..., description="Business Category: Dairy, Poultry, Tailoring, Flour Mill, Two-Wheeler Repair"), current_user: dict = Depends(get_current_user)):
    if category not in DOCUMENT_CHECKLISTS:
        raise HTTPException(status_code=404, detail=f"Checklist for business category '{category}' not found")
    return DOCUMENT_CHECKLISTS[category]
