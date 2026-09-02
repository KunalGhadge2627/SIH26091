import socket
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

def is_mongo_reachable(host: str = "localhost", port: int = 27017, timeout: float = 0.1) -> bool:
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        s.settimeout(timeout)
        s.connect((host, port))
        s.close()
        return True
    except Exception:
        return False

async def connect_to_mongo():
    # Fast 100ms socket probe to prevent 30-second PyMongo connection blocking
    if is_mongo_reachable():
        try:
            db_instance.client = AsyncIOMotorClient(
                settings.MONGODB_URL, 
                serverSelectionTimeoutMS=500,
                connectTimeoutMS=500
            )
            db_instance.db = db_instance.client[settings.DATABASE_NAME]
            print(f"Connected to MongoDB at {settings.MONGODB_URL}, Database: {settings.DATABASE_NAME}")
            
            # Create indexes
            await db_instance.db["users"].create_index("email", unique=True)
            await db_instance.db["villages"].create_index("village_id", unique=True)
            await db_instance.db["businesses"].create_index("business_id", unique=True)
            await db_instance.db["business_models"].create_index("category", unique=True)
            await db_instance.db["village_business_stats"].create_index([("village_id", 1), ("category", 1)], unique=True)
            await db_instance.db["legal_offices"].create_index("office_id", unique=True)
            await db_instance.db["schemes"].create_index("scheme_id", unique=True)
        except Exception as e:
            print(f"Notice: MongoDB index creation skipped/deferred ({e})")
    else:
        db_instance.db = None
        print("Notice: MongoDB not detected locally on port 27017. Fast In-Memory Mode ACTIVE (0ms latency).")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("Closed MongoDB connection")

def get_database():
    return db_instance.db
