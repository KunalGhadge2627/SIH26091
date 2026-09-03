STATE_DIRECTORY = {
    "Maharashtra": {
        "code": "MH",
        "districts": ["Pune", "Nashik", "Nagpur", "Aurangabad", "Kolhapur"],
        "centers": (19.7515, 75.7139),
    },
    "Karnataka": {
        "code": "KA",
        "districts": ["Bengaluru Rural", "Mysuru", "Belagavi", "Dharwad", "Shivamogga"],
        "centers": (15.3173, 75.7139),
    },
    "Rajasthan": {
        "code": "RJ",
        "districts": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
        "centers": (27.0238, 74.2179),
    },
    "Uttar Pradesh": {
        "code": "UP",
        "districts": ["Lucknow", "Agra", "Varanasi", "Prayagraj", "Meerut"],
        "centers": (26.8467, 80.9462),
    },
    "Tamil Nadu": {
        "code": "TN",
        "districts": ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
        "centers": (11.1271, 78.6569),
    },
    "Gujarat": {
        "code": "GJ",
        "districts": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
        "centers": (22.2587, 71.1924),
    },
    "West Bengal": {
        "code": "WB",
        "districts": ["Kolkata", "Hooghly", "Nadia", "Darjeeling", "Murshidabad"],
        "centers": (22.9868, 87.8550),
    },
    "Kerala": {
        "code": "KL",
        "districts": ["Thiruvananthapuram", "Ernakulam", "Kozhikode", "Thrissur", "Kollam"],
        "centers": (10.8505, 76.2711),
    },
    "Andhra Pradesh": {
        "code": "AP",
        "districts": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool"],
        "centers": (15.9129, 79.7400),
    },
    "Madhya Pradesh": {
        "code": "MP",
        "districts": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
        "centers": (22.9734, 78.6569),
    },
}


def _village_record(state, state_info, district, district_index, block_index, village_index):
    block = "Shirur" if state == "Maharashtra" and district == "Pune" and block_index == 0 else f"{district} Block {block_index + 1}"
    village_name = f"{district} Village {village_index + 1}"
    village_id = f"VIL_{state_info['code']}_{district_index + 1:02d}{block_index + 1:02d}{village_index + 1:02d}"
    base_lat, base_lng = state_info["centers"]
    latitude = round(base_lat + (district_index * 0.32) + (block_index * 0.045) + (village_index * 0.009), 4)
    longitude = round(base_lng + (district_index * 0.28) + (block_index * 0.04) + (village_index * 0.008), 4)

    if village_id == "VIL_MH_010101":
        village_id = "VIL_270001"
        village_name = "Shikrapur"
        block = "Shirur"
        latitude, longitude = 18.6984, 74.1236

    population = 8500 + (district_index * 700) + (block_index * 250) + (village_index * 100)
    households = round(population / 4.7)
    total_workers = round(population * 0.46)
    return {
        "village_id": village_id,
        "lgd_code": village_id.replace("VIL_", "LGD_")[-8:],
        "census_code": village_id.replace("VIL_", "CEN_")[-8:],
        "name": village_name,
        "gram_panchayat": f"{village_name} GP",
        "block": block,
        "district": district,
        "state": state,
        "latitude": latitude,
        "longitude": longitude,
        "population": population,
        "households": households,
        "workers": {
            "total": total_workers,
            "main": round(total_workers * 0.84),
            "marginal": round(total_workers * 0.16),
            "cultivators": round(total_workers * 0.31),
            "agricultural_labourers": round(total_workers * 0.24),
        },
        "literacy_rate": round(70 + (village_index * 1.8) + (district_index * 0.7), 1),
        "amenities": {"road": True, "electricity": True, "bank": village_index == 0, "market": True},
        "data_year": 2024,
        "source": "Mock Census & LGD Directory",
    }


def build_mock_location_directory():
    villages = []
    for state, state_info in STATE_DIRECTORY.items():
        for district_index, district in enumerate(state_info["districts"]):
            for block_index in range(5):
                for village_index in range(5):
                    villages.append(_village_record(
                        state, state_info, district, district_index, block_index, village_index
                    ))
    return villages


MOCK_LOCATION_VILLAGES = build_mock_location_directory()
