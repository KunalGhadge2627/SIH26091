import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "Udyam Gram" in data["app_name"]

def test_auth_signup_login_flow():
    test_email = "testuser_phase1@example.com"
    test_password = "password123"
    
    mock_db = MagicMock()
    # Mock users collection behavior
    users_store = {}
    
    async def mock_find_one(query):
        email = query.get("email")
        return users_store.get(email)
        
    async def mock_insert_one(doc):
        users_store[doc["email"]] = doc
        return MagicMock(inserted_id="123")
        
    mock_db["users"].find_one = AsyncMock(side_effect=mock_find_one)
    mock_db["users"].insert_one = AsyncMock(side_effect=mock_insert_one)

    with patch("app.routers.auth.get_database", return_value=mock_db), \
         patch("app.auth.security.get_database", return_value=mock_db):
        
        # 1. Signup
        signup_payload = {
            "full_name": "Test Rural Entrepreneur",
            "mobile": "9876543210",
            "email": test_email,
            "password": test_password,
            "preferred_language": "en",
            "state": "Maharashtra",
            "district": "Pune"
        }
        resp_signup = client.post("/auth/signup", json=signup_payload)
        assert resp_signup.status_code == 201
        assert resp_signup.json()["email"] == test_email
            
        # 2. Login
        login_payload = {
            "email": test_email,
            "password": test_password
        }
        resp_login = client.post("/auth/login", json=login_payload)
        assert resp_login.status_code == 200
        token_data = resp_login.json()
        assert "access_token" in token_data
        token = token_data["access_token"]
        
        # 3. Get /auth/me
        headers = {"Authorization": f"Bearer {token}"}
        resp_me = client.get("/auth/me", headers=headers)
        assert resp_me.status_code == 200
        assert resp_me.json()["email"] == test_email
