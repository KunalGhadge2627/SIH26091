# Udyam Gram — Backend (Phases 1 & 2)

Udyam Gram is a **hyper-local rural business feasibility and financial-literacy platform**. It acts as a pre-investment advisory tool that evaluates whether a rural business idea is viable at a specific village-level location, whether the entrepreneur is personally ready, and whether they can afford the financing — before taking on debt.

This repository contains the **Phase 1 Foundation & Phase 2 Intelligence Layer**, including data models, database seeding for 10 real Indian villages across 8 states, 50 unique market datasets, deterministic calculation engines, LLM explanations, IndicTrans2 translation, Whisper speech transcription, JWT authentication, and complete REST API surface.

---

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, Pydantic v2
- **Database**: MongoDB (Async access via `motor`)
- **Server**: Uvicorn
- **Auth**: JWT Tokens (`pyjwt`), Bcrypt password hashing (`bcrypt`)
- **AI & Intelligence Layer**:
  - **LLM Explainer**: Anthropic API (`anthropic` SDK, `claude-3-5-sonnet`) with strict system prompt constraint: *"Analyst & Explainer, not Database & Calculator"* + evidence-grounded fallback generator.
  - **Translation Engine**: IndicTrans2 translation framework supporting 8 languages (`en`, `hi`, `mr`, `ta`, `te`, `kn`, `bn`, `gu`, `pa`) with English pivot and report payload structure preservation.
  - **Speech-to-Text**: Whisper audio transcription engine stub (`POST /speech/transcribe`).
- **Testing**: Pytest & Httpx

---

## Project Structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI entrypoint with CORS & routes
│   ├── config.py                 # Settings module (Mongo, JWT, Anthropic)
│   ├── db.py                      # Motor MongoDB async client & index manager
│   ├── auth/
│   │   └── security.py            # Bcrypt password hashing & JWT auth dependencies
│   ├── models/
│   │   ├── user.py                # User signup, login & token schemas
│   │   ├── village.py             # Village dataset & derived metrics models
│   │   ├── business.py            # Competitor point schemas
│   │   ├── business_model.py      # Category configuration models
│   │   ├── village_business_stats.py # 50 unique market dataset schemas
│   │   ├── scheme.py              # Micro Finance & Term Loan scheme schemas
│   │   ├── assessment.py          # Assessment input, computed scores, LLM explanations & report models
│   │   ├── legal_office.py        # Legal office & document checklist models
│   │   └── speech.py              # Audio transcription request/response models
│   ├── services/
│   │   ├── geo.py                 # Pure Haversine formula, radius filtering, catchment stats
│   │   ├── finance.py             # Government scheme selector & reducing-balance EMI formula
│   │   ├── scoring.py             # Market (45%), Readiness (30%), Financial (25%) & Alternatives
│   │   ├── llm_explainer.py      # Narrative, grounded SWOT, action phrasing, financial notes, 90-day plan
│   │   ├── translation.py        # IndicTrans2 translator with caching and English pivot
│   │   └── speech.py             # Whisper audio transcription engine
│   ├── data/
│   │   ├── mock_villages.py       # 10 real villages (incl. Shikrapur, MS)
│   │   ├── mock_business_models.py# Config for 5 categories
│   │   ├── mock_business_stats.py # 50 unique market datasets
│   │   ├── mock_legal_offices.py  # 11 realistic legal offices
│   │   ├── mock_schemes.py        # 2 government loan scheme specs
│   │   ├── document_checklists.py # 5 category document & regulatory checklists
│   │   └── seed.py                # Seeder script (python -m app.data.seed)
│   └── routers/
│       ├── auth.py                # Signup, Login, Me endpoints
│       ├── locations.py           # State, District, Block, Village hierarchy
│       ├── business_models.py     # 5 category configurations
│       ├── assessments.py         # Drafts, runner, report, map, alternatives, plans, ?lang= translation
│       ├── legal_offices.py       # Legal offices directory & document checklists
│       └── speech.py              # POST /speech/transcribe audio endpoint
│   ├── tests/
│   │   ├── test_geo.py            # Haversine & catchment aggregation unit tests
│   │   ├── test_finance.py        # Scheme & EMI reducing balance unit tests
│   │   ├── test_scoring.py        # Scoring weights & education exclusion unit tests
│   │   ├── test_api.py            # Auth & FastAPI integration tests
│   │   ├── test_llm_explainer.py  # LLM narrative, SWOT, and point value lookup tests
│   │   ├── test_translation.py    # IndicTrans2 8-lang translation & payload walking tests
│   │   └── test_speech.py         # Speech transcription endpoint tests
├── requirements.txt
├── .env.example
├── .env
└── README.md
```

---

## Quick Start Guide

### 1. Prerequisites
- Python 3.11 or higher
- MongoDB instance running locally on `mongodb://localhost:27017` (or remote Mongo URI)

### 2. Environment & Dependency Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Configure environment variables in .env
# Set ANTHROPIC_API_KEY for live Claude generation (or leave blank for automatic evidence-grounded fallback)
# Set SARVAM_API_KEY in .env to enable live English-to-Indic translation.
```

### Sarvam Translation Setup

Create an account in the [Sarvam dashboard](https://dashboard.sarvam.ai), generate an API key, and copy these values from `.env.example` into `.env`:

```env
SARVAM_API_KEY="your-sarvam-api-key"
SARVAM_ENDPOINT="https://api.sarvam.ai/translate"
SARVAM_MODEL="sarvam-translate:v1"
```

The report, alternatives, and improvement-plan endpoints use Sarvam when configured. If the key is missing or the service is unavailable, the existing Bhashini, local model, and dictionary fallbacks are used.

### 3. Seed Database
Run the seeder script to populate MongoDB with villages, 50 market datasets, business models, legal offices, schemes, and document checklists:
```bash
python -m app.data.seed
```

The supplied `mock_data/files.zip` is also loaded into the dedicated `archive_*` collections (schemes, villages, business categories, competitor mapping, market pricing, and entrepreneur cases). Set `MOCK_DATA_ZIP` to use a different archive path.

### 4. Run Development Server
```bash
uvicorn app.main:app --reload
```
Open **`http://127.0.0.1:8000/docs`** to test all endpoints interactively.

---

## Running Unit Tests

Run the full Pytest suite covering scoring, finance, geo, auth, LLM explainer, translation, and speech transcription:

```bash
python -m pytest
```

---

## REST API Summary Table

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Register new user account |
| `POST` | `/auth/login` | Authenticate & return JWT access token |
| `GET` | `/auth/me` | Fetch authenticated user profile |
| `GET` | `/locations/states` | List states |
| `GET` | `/locations/districts?state=` | List districts in state |
| `GET` | `/locations/blocks?district=` | List blocks in district |
| `GET` | `/locations/villages?block=` | List villages in block |
| `GET` | `/locations/villages/{village_id}` | Fetch detailed village profile |
| `GET` | `/business-models` | List 5 business category configurations |
| `GET` | `/business-models/{category}` | Fetch category details & capital ranges |
| `POST` | `/assessments` | Create a new assessment draft |
| `PUT` | `/assessments/{id}` | Update assessment answers/inputs |
| `GET` | `/assessments/{id}` | Get single assessment draft/complete record |
| `POST` | `/assessments/{id}/run` | Execute deterministic engines + LLM explainer, mark complete |
| `GET` | `/assessments` | List user's past assessments |
| `GET` | `/assessments/{id}/report?lang=hi` | Fetch computed feasibility report (supports `lang=` translation) |
| `GET` | `/assessments/{id}/market-map` | Fetch 10km radius villages, competitors & catchment stats |
| `GET` | `/assessments/{id}/alternatives?lang=hi` | Fetch ranked business alternatives (3-part decomposition) |
| `GET` | `/assessments/{id}/improvement-plan?lang=hi` | Fetch readiness improvement action items |
| `GET` | `/assessments/{id}/financial-plan` | Fetch scheme, EMI, affordability, & 90-day plan |
| `GET` | `/assessments/{id}/legal-offices` | Fetch nearest legal offices & document checklist |
| `GET` | `/legal-offices` | List legal offices by district |
| `GET` | `/legal-offices/document-checklist` | Fetch category document & regulatory checklist |
| `POST` | `/speech/transcribe` | Upload audio file for Whisper transcription & language detection |
