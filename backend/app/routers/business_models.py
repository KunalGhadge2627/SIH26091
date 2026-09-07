from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.db import get_database
from app.auth.security import get_current_user
from app.models.business_model import CategoryResponse
from app.data.mock_business_models import MOCK_BUSINESS_MODELS

router = APIRouter(prefix="/business-models", tags=["Business Models"])

@router.get("", response_model=List[CategoryResponse])
async def get_all_business_models(current_user: dict = Depends(get_current_user)):
    db = get_database()
    models = []
    try:
        if db is not None:
            cursor = db["business_models"].find({})
            models = await cursor.to_list(length=20)
    except Exception:
        models = []
    if not models:
        models = MOCK_BUSINESS_MODELS
    for m in models:
        m["_id"] = str(m.get("_id"))
    return models

@router.get("/{category}", response_model=CategoryResponse)
async def get_business_model_by_category(category: str, current_user: dict = Depends(get_current_user)):
    db = get_database()
    model = await db["business_models"].find_one({"category": category})
    if not model:
        raise HTTPException(status_code=404, detail=f"Business category '{category}' not found")
    model["_id"] = str(model.get("_id"))
    return model
