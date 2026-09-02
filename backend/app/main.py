from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.db import connect_to_mongo, close_mongo_connection
from app.routers import auth, locations, business_models, assessments, legal_offices, speech


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()
    yield
    await close_mongo_connection()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Hyper-local rural business feasibility and financial-literacy platform (Phase 1 Backend API)",
    lifespan=lifespan
)

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(locations.router)
app.include_router(business_models.router)
app.include_router(assessments.router)
app.include_router(legal_offices.router)
app.include_router(speech.router)


@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "app_name": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "message": "Udyam Gram Phase 1 Backend Running Successfully"
    }
