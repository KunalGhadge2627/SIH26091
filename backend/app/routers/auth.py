import uuid
import json
from pathlib import Path
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from app.db import get_database
from app.auth.security import get_password_hash, verify_password, create_access_token, get_current_user
from app.models.user import UserSignup, UserLogin, UserResponse, TokenResponse

router = APIRouter(prefix="/auth", tags=["Auth"])

# Persistent local fallback store when MongoDB is offline.
USERS_FILE = Path(__file__).resolve().parents[2] / ".users.json"

def _load_local_users():
    try:
        if USERS_FILE.exists():
            return json.loads(USERS_FILE.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        pass
    return {}

def _save_local_users():
    try:
        USERS_FILE.write_text(json.dumps(IN_MEMORY_USERS, indent=2), encoding="utf-8")
    except OSError as exc:
        print(f"Notice: Could not persist local users ({exc})")

IN_MEMORY_USERS = _load_local_users()

@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserSignup):
    db = get_database()
    hashed_pwd = get_password_hash(user_in.password)
    user_id = f"USR_{uuid.uuid4().hex[:8].upper()}"
    now_iso = datetime.now(timezone.utc).isoformat()
    
    user_doc = {
        "id": user_id,
        "full_name": user_in.full_name,
        "mobile": user_in.mobile,
        "email": user_in.email,
        "hashed_password": hashed_pwd,
        "preferred_language": user_in.preferred_language,
        "state": user_in.state,
        "district": user_in.district,
        "age_group": user_in.age_group,
        "education": user_in.education,
        "occupation": user_in.occupation,
        "business_experience": user_in.business_experience,
        "created_at": now_iso
    }
    
    mongo_success = False
    try:
        if db is not None:
            existing = await db["users"].find_one({"email": user_in.email})
            if existing:
                raise HTTPException(status_code=400, detail="User with this email already exists")
            await db["users"].insert_one(user_doc)
            mongo_success = True
    except HTTPException:
        raise
    except Exception as e:
        print(f"Notice: MongoDB offline/unreachable, saving to memory fallback ({e})")
        
    if not mongo_success:
        if user_in.email in IN_MEMORY_USERS:
            raise HTTPException(status_code=400, detail="User with this email already exists")
        IN_MEMORY_USERS[user_in.email] = user_doc
        _save_local_users()

    return UserResponse(
        id=user_id,
        full_name=user_in.full_name,
        mobile=user_in.mobile,
        email=user_in.email,
        preferred_language=user_in.preferred_language,
        state=user_in.state,
        district=user_in.district,
        age_group=user_in.age_group,
        education=user_in.education,
        occupation=user_in.occupation,
        business_experience=user_in.business_experience,
        created_at=now_iso
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = get_database()
    user = None
    
    try:
        if db is not None:
            user = await db["users"].find_one({"email": credentials.email})
    except Exception as e:
        print(f"Notice: MongoDB offline/unreachable during login ({e})")
        
    if user is None and credentials.email in IN_MEMORY_USERS:
        user = IN_MEMORY_USERS[credentials.email]
        
    if not user or not verify_password(credentials.password, user["hashed_password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
    access_token = create_access_token(data={"sub": user["email"]})
    
    user_resp = UserResponse(
        id=str(user["id"]),
        full_name=user["full_name"],
        mobile=user["mobile"],
        email=user["email"],
        preferred_language=user.get("preferred_language", "en"),
        state=user.get("state", ""),
        district=user.get("district", ""),
        age_group=user.get("age_group"),
        education=user.get("education"),
        occupation=user.get("occupation"),
        business_experience=user.get("business_experience"),
        created_at=user["created_at"]
    )
    
    return TokenResponse(access_token=access_token, token_type="bearer", user=user_resp)

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        full_name=current_user["full_name"],
        mobile=current_user["mobile"],
        email=current_user["email"],
        preferred_language=current_user.get("preferred_language", "en"),
        state=current_user.get("state", ""),
        district=current_user.get("district", ""),
        age_group=current_user.get("age_group"),
        education=current_user.get("education"),
        occupation=current_user.get("occupation"),
        business_experience=current_user.get("business_experience"),
        created_at=current_user["created_at"]
    )

@router.put("/me", response_model=UserResponse)
async def update_me(user_update: dict, current_user: dict = Depends(get_current_user)):
    db = get_database()
    update_data = {}
    allowed_fields = ["full_name", "mobile", "preferred_language", "state", "district", "age_group", "education", "occupation", "business_experience"]
    for f in allowed_fields:
        if f in user_update:
            update_data[f] = user_update[f]
            
    try:
        if db is not None:
            await db["users"].update_one({"id": current_user["id"]}, {"$set": update_data})
    except Exception as e:
        print(f"Notice: MongoDB offline/unreachable during profile update ({e})")
        
    email = current_user["email"]
    if email in IN_MEMORY_USERS:
        IN_MEMORY_USERS[email].update(update_data)
        updated_user = IN_MEMORY_USERS[email]
    else:
        updated_user = {**current_user, **update_data}
        
    return UserResponse(
        id=updated_user["id"],
        full_name=updated_user["full_name"],
        mobile=updated_user["mobile"],
        email=updated_user["email"],
        preferred_language=updated_user.get("preferred_language", "en"),
        state=updated_user.get("state", ""),
        district=updated_user.get("district", ""),
        age_group=updated_user.get("age_group"),
        education=updated_user.get("education"),
        occupation=updated_user.get("occupation"),
        business_experience=updated_user.get("business_experience"),
        created_at=updated_user["created_at"]
    )
