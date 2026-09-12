from typing import List
from fastapi import APIRouter, HTTPException
from app.db import get_database
from app.models.business_model import CategoryResponse
from app.data.mock_business_models import MOCK_BUSINESS_MODELS

router = APIRouter(prefix="/business-models", tags=["Business Models"])

@router.get("", response_model=List[CategoryResponse])
async def get_all_business_models():
    db = get_database()
    models = []
    try:
        if db is not None:
            cursor = db["business_models"].find({})
            models = await cursor.to_list(length=20)
            for m in models:
                m["_id"] = str(m.get("_id"))
    except Exception:
        pass

    if not models:
        models = MOCK_BUSINESS_MODELS

    return models

@router.get("/{category}", response_model=CategoryResponse)
async def get_business_model_by_category(category: str):
    db = get_database()
    model = None
    try:
        if db is not None:
            model = await db["business_models"].find_one({"category": category})
    except Exception:
        pass

    if not model:
        model = next((m for m in MOCK_BUSINESS_MODELS if m["category"].lower() == category.lower()), None)

    if not model:
        raise HTTPException(status_code=404, detail=f"Business category '{category}' not found")

    if "_id" in model:
        model["_id"] = str(model.get("_id"))

    return model
