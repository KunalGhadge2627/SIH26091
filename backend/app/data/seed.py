import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from app.data.mock_villages import MOCK_VILLAGES
from app.data.mock_business_models import MOCK_BUSINESS_MODELS
from app.data.mock_business_stats import MOCK_VILLAGE_BUSINESS_STATS
from app.data.mock_legal_offices import MOCK_LEGAL_OFFICES
from app.data.mock_schemes import MOCK_SCHEMES
from app.data.document_checklists import DOCUMENT_CHECKLISTS_DATA
from app.data.archive_loader import load_mock_archive


def compute_derived_village_fields(village: dict) -> dict:
    """
    Computes derived fields according to exact formulas:
    worker_ratio = total_workers / population
    agriculture_share = (cultivators + agricultural_labourers) / total_workers
    average_household_size = population / households
    """
    pop = village.get("population", 0)
    hh = village.get("households", 0)
    w = village.get("workers", {})
    
    total_w = w.get("total", 0)
    cult = w.get("cultivators", 0)
    agri = w.get("agricultural_labourers", 0)
    
    village["worker_ratio"] = round(total_w / pop, 4) if pop > 0 else 0.0
    village["agriculture_share"] = round((cult + agri) / total_w, 4) if total_w > 0 else 0.0
    village["average_household_size"] = round(pop / hh, 2) if hh > 0 else 0.0
    return village

def build_business_competitor_records(stats_list: list, villages_map: dict) -> list:
    """
    Builds individual business competitor records for the 'businesses' collection
    from named competitors across village business stats.
    """
    businesses = []
    b_id_counter = 1
    
    for stat in stats_list:
        v_id = stat["village_id"]
        cat = stat["category"]
        v_info = villages_map.get(v_id, {})
        base_lat = v_info.get("latitude", 18.6984)
        base_lon = v_info.get("longitude", 74.1236)
        
        for comp in stat.get("named_competitors", []):
            dist = comp.get("distance_km", 2.0)
            # Offset lat/lon slightly based on distance for map representation
            offset = dist / 111.0
            
            b_doc = {
                "business_id": f"BIZ_{b_id_counter:04d}",
                "name": comp["name"],
                "category": cat,
                "subcategory": comp.get("subcategory", f"Local {cat}"),
                "latitude": round(base_lat + (offset * 0.7), 4),
                "longitude": round(base_lon + (offset * 0.7), 4),
                "village_id": v_id,
                "source": "Mapped Business Data",
                "confidence": 0.9,
                "last_updated": "2024-01-01"
            }
            businesses.append(b_doc)
            b_id_counter += 1
            
    return businesses

async def seed_database():
    from app.db import is_mongo_reachable
    if not is_mongo_reachable():
        print("Notice: MongoDB is not running locally on port 27017.")
        print("Fast In-Memory Seed Mode ACTIVE: 10 villages, 50 market datasets, 5 business models, 11 legal offices, and 2 scheme tiers loaded in memory.")
        return

    print(f"Connecting to MongoDB at {settings.MONGODB_URL} ...")
    client = AsyncIOMotorClient(settings.MONGODB_URL, serverSelectionTimeoutMS=2000)
    db = client[settings.DATABASE_NAME]

    
    print("Clearing old collections ...")
    await db["villages"].delete_many({})
    await db["business_models"].delete_many({})
    await db["village_business_stats"].delete_many({})
    await db["businesses"].delete_many({})
    await db["legal_offices"].delete_many({})
    await db["schemes"].delete_many({})
    await db["document_checklists"].delete_many({})
    archive_data = load_mock_archive()
    for collection_name in archive_data:
        await db[f"archive_{collection_name}"].delete_many({})
    
    # 1. Process and insert villages
    print("Seeding 10 real villages with derived metrics ...")
    processed_villages = [compute_derived_village_fields(v.copy()) for v in MOCK_VILLAGES]
    villages_map = {v["village_id"]: v for v in processed_villages}
    await db["villages"].insert_many(processed_villages)
    
    # 2. Insert business models (categories)
    print("Seeding 5 business model category configurations ...")
    await db["business_models"].insert_many(MOCK_BUSINESS_MODELS)
    
    # 3. Insert village business stats (50 unique combinations)
    print("Seeding 50 unique market dataset documents ...")
    await db["village_business_stats"].insert_many(MOCK_VILLAGE_BUSINESS_STATS)
    
    # 4. Insert competitor businesses
    print("Seeding competitor establishment records ...")
    competitors = build_business_competitor_records(MOCK_VILLAGE_BUSINESS_STATS, villages_map)
    await db["businesses"].insert_many(competitors)
    
    # 5. Insert legal offices
    print("Seeding 11 legal offices ...")
    await db["legal_offices"].insert_many(MOCK_LEGAL_OFFICES)
    
    # 6. Insert schemes
    print("Seeding 2 government scheme tiers ...")
    await db["schemes"].insert_many(MOCK_SCHEMES)
    
    # 7. Insert document checklists
    print("Seeding 5 category document checklists ...")
    await db["document_checklists"].insert_many(DOCUMENT_CHECKLISTS_DATA)

    # Keep the supplied CSV dataset available for analytics and future routes
    # without changing the established assessment fixture schema.
    archive_counts = {}
    for collection_name, rows in archive_data.items():
        if rows:
            await db[f"archive_{collection_name}"].insert_many(rows)
        archive_counts[collection_name] = len(rows)

    
    print("\nDatabase Seeding Completed Successfully!")
    print(f"Summary:")
    print(f" - Villages: {len(processed_villages)}")
    print(f" - Business Models: {len(MOCK_BUSINESS_MODELS)}")
    print(f" - Village Business Stats: {len(MOCK_VILLAGE_BUSINESS_STATS)}")
    print(f" - Business Establishments: {len(competitors)}")
    print(f" - Legal Offices: {len(MOCK_LEGAL_OFFICES)}")
    print(f" - Government Schemes: {len(MOCK_SCHEMES)}")
    print(f" - Supplied CSV archive: {archive_counts}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
