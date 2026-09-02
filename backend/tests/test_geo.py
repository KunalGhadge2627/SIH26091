import pytest
from app.services.geo import haversine_distance, aggregate_catchment_stats

def test_haversine_distance_known_points():
    # Distance between Pune and Mumbai is ~120-150 km
    pune_lat, pune_lon = 18.5204, 73.8567
    mumbai_lat, mumbai_lon = 19.0760, 72.8777
    dist = haversine_distance(pune_lat, pune_lon, mumbai_lat, mumbai_lon)
    assert 110.0 <= dist <= 160.0

def test_haversine_same_point():
    lat, lon = 18.6984, 74.1236
    assert haversine_distance(lat, lon, lat, lon) == 0.0

def test_aggregate_catchment_stats():
    villages = [
        {
            "population": 1000,
            "households": 200,
            "workers": {"total": 400, "main": 300, "marginal": 100, "cultivators": 150, "agricultural_labourers": 100}
        },
        {
            "population": 2000,
            "households": 400,
            "workers": {"total": 800, "main": 600, "marginal": 200, "cultivators": 300, "agricultural_labourers": 200}
        }
    ]
    stats = aggregate_catchment_stats(villages)
    assert stats["total_population"] == 3000
    assert stats["total_households"] == 600
    assert stats["total_workers"] == 1200
    assert stats["cultivators"] == 450
    assert stats["agricultural_labourers"] == 300
    assert stats["avg_household_size"] == 5.0
    assert stats["worker_ratio"] == 0.40
    assert stats["agri_share"] == 0.62
