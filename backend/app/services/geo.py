import math
from typing import List, Dict, Any

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the great-circle distance between two points on the Earth
    using the Haversine formula from scratch.
    
    Latitude and Longitude are in decimal degrees.
    Returns distance in kilometers.
    """
    EARTH_RADIUS_KM = 6371.0
    
    # Convert decimal degrees to radians
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    
    # Haversine formula
    a = (math.sin(delta_phi / 2.0) ** 2 +
         math.cos(phi1) * math.cos(phi2) * (math.sin(delta_lambda / 2.0) ** 2))
    
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    
    distance = EARTH_RADIUS_KM * c
    return round(distance, 2)

async def find_villages_within_radius(db, lat: float, lon: float, radius_km: float = 10.0) -> List[Dict[str, Any]]:
    """
    Queries villages collection and returns all villages within radius_km
    with computed Haversine distance attached.
    """
    cursor = db["villages"].find({})
    villages = await cursor.to_list(length=1000)
    
    nearby_villages = []
    for v in villages:
        v["_id"] = str(v.get("_id"))
        dist = haversine_distance(lat, lon, v["latitude"], v["longitude"])
        if dist <= radius_km:
            v["distance_km"] = dist
            nearby_villages.append(v)
            
    # Sort by distance ascending
    nearby_villages.sort(key=lambda x: x["distance_km"])
    return nearby_villages

async def find_competitors_within_radius(db, lat: float, lon: float, category: str, radius_km: float = 10.0) -> Dict[str, Any]:
    """
    Queries businesses collection for competitors in category within radius_km,
    grouped into 0-2km, 2-5km, and 5-10km distance bands.
    """
    query = {}
    if category:
        query["category"] = category
        
    cursor = db["businesses"].find(query)
    businesses = await cursor.to_list(length=1000)
    
    band_0_2 = []
    band_2_5 = []
    band_5_10 = []
    all_matched = []
    
    for b in businesses:
        b["_id"] = str(b.get("_id"))
        dist = haversine_distance(lat, lon, b["latitude"], b["longitude"])
        if dist <= radius_km:
            b["distance_km"] = dist
            all_matched.append(b)
            if dist <= 2.0:
                band_0_2.append(b)
            elif dist <= 5.0:
                band_2_5.append(b)
            else:
                band_5_10.append(b)
                
    all_matched.sort(key=lambda x: x["distance_km"])
    
    return {
        "band_0_2km": band_0_2,
        "band_2_5km": band_2_5,
        "band_5_10km": band_5_10,
        "total_count": len(all_matched),
        "weighted_score": len(band_0_2) * 1.0 + len(band_2_5) * 0.7 + len(band_5_10) * 0.3,
        "all_competitors": all_matched
    }

async def find_nearest_legal_offices(db, lat: float, lon: float, limit: int = 3) -> List[Dict[str, Any]]:
    """
    Finds nearest legal offices regardless of 10km cap, with computed distance.
    """
    cursor = db["legal_offices"].find({})
    offices = await cursor.to_list(length=1000)
    
    for office in offices:
        office["_id"] = str(office.get("_id"))
        dist = haversine_distance(lat, lon, office["latitude"], office["longitude"])
        office["distance_km"] = dist
        
    offices.sort(key=lambda x: x["distance_km"])
    return offices[:limit]

def aggregate_catchment_stats(villages_in_radius: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Aggregates population, households, and worker breakdowns across all villages
    within the catchment area.
    """
    total_pop = sum(v.get("population", 0) for v in villages_in_radius)
    total_hh = sum(v.get("households", 0) for v in villages_in_radius)
    
    total_workers = 0
    main_workers = 0
    marginal_workers = 0
    cultivators = 0
    agri_labourers = 0
    
    for v in villages_in_radius:
        workers = v.get("workers", {})
        total_workers += workers.get("total", 0)
        main_workers += workers.get("main", 0)
        marginal_workers += workers.get("marginal", 0)
        cultivators += workers.get("cultivators", 0)
        agri_labourers += workers.get("agricultural_labourers", 0)
        
    return {
        "catchment_village_count": len(villages_in_radius),
        "total_population": total_pop,
        "total_households": total_hh,
        "total_workers": total_workers,
        "main_workers": main_workers,
        "marginal_workers": marginal_workers,
        "cultivators": cultivators,
        "agricultural_labourers": agri_labourers,
        "avg_household_size": round(total_pop / total_hh, 2) if total_hh > 0 else 0.0,
        "worker_ratio": round(total_workers / total_pop, 2) if total_pop > 0 else 0.0,
        "agri_share": round((cultivators + agri_labourers) / total_workers, 2) if total_workers > 0 else 0.0
    }
