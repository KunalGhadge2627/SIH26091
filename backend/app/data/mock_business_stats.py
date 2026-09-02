"""
Generates and exports 50 unique village_business_stats records (10 villages x 5 categories).
Each combination has unique market numbers, competitor counts, named competitors,
infrastructure signals, category-specific demand proxies, and evidence scores.
"""

VILLAGE_IDS = [
    "VIL_270001", "VIL_090002", "VIL_030003", "VIL_330004", "VIL_290005",
    "VIL_080006", "VIL_190007", "VIL_100008", "VIL_240009", "VIL_210010"
]

CATEGORIES = ["Dairy", "Poultry", "Tailoring", "Flour Mill", "Two-Wheeler Repair"]

# Custom seed parameters per (village_index, category_index) to guarantee 50 unique records
def generate_50_business_stats():
    stats_list = []
    
    competitor_prefixes = {
        "Dairy": ["Shree Dairy", "Kisan Milk Center", "Jay Hanuman Dairy", "Gokul Milk", "Mother Dairy Point"],
        "Poultry": ["Standard Poultry", "Royal Broilers", "Kisan Hatcheries", "Fresh Farm Chicks", "Green Farm Poultry"],
        "Tailoring": ["New Look Tailors", "Fashion Stitches", "Perfect Fit Shop", "Master Tailors", "Quality Garments"],
        "Flour Mill": ["Laxmi Chakki", "Bhavani Flour Mill", "Kisan Grinding Center", "Annapurna Mill", "Sri Ram Chakki"],
        "Two-Wheeler Repair": ["Om Auto Works", "New Star Garage", "Speedy Bike Care", "Kisan Auto Repair", "Mahadev Spares"]
    }

    for v_idx, v_id in enumerate(VILLAGE_IDS):
        for c_idx, cat in enumerate(CATEGORIES):
            # Seed unique variation numbers
            var_seed = (v_idx * 7 + c_idx * 13) % 100
            
            # Competitor breakdowns
            c_0_2 = (v_idx + c_idx) % 3
            c_2_5 = (v_idx * 2 + c_idx) % 4
            c_5_10 = (v_idx + c_idx * 3) % 5
            total_comp = c_0_2 + c_2_5 + c_5_10
            
            prefixes = competitor_prefixes[cat]
            named_comps = [
                {
                    "name": f"{prefixes[0]} — {v_id}",
                    "distance_km": round(1.2 + (var_seed % 5) * 0.3, 1),
                    "subcategory": f"Local {cat} Unit"
                },
                {
                    "name": f"{prefixes[1]} — {v_id}",
                    "distance_km": round(3.1 + (var_seed % 4) * 0.4, 1),
                    "subcategory": f"Established {cat} Shop"
                },
                {
                    "name": f"{prefixes[2]} — {v_id}",
                    "distance_km": round(6.2 + (var_seed % 3) * 0.8, 1),
                    "subcategory": f"Regional {cat} Hub"
                }
            ]
            
            # Demand & Supply gap levels
            demand_levels = ["High", "Moderate", "High", "Moderate", "High"]
            supply_gap_levels = ["High", "Moderate", "High", "High", "Moderate"]
            repeat_levels = ["High", "High", "Medium", "High", "Medium"]
            
            demand_lvl = demand_levels[(v_idx + c_idx) % 5]
            supply_lvl = supply_gap_levels[(v_idx * 3 + c_idx) % 5]
            repeat_lvl = repeat_levels[(v_idx + c_idx * 2) % 3]
            
            # Category-specific demand proxy
            if cat == "Dairy":
                demand_proxy = {"cattle_headcount": 350 + var_seed * 8, "daily_milk_surplus_liters": 800 + var_seed * 15}
                infra_sig = {"road": "Good", "power": "18h/day", "cold_chain": "Available" if var_seed % 2 == 0 else "Missing"}
            elif cat == "Poultry":
                demand_proxy = {"weekly_meat_consumption_kg": 450 + var_seed * 10, "local_eateries_count": 12 + (var_seed % 6)}
                infra_sig = {"road": "Fair", "power": "16h/day", "veterinary_support": "Within 5km"}
            elif cat == "Tailoring":
                demand_proxy = {"school_going_children": 1200 + var_seed * 20, "annual_festival_orders": 850 + var_seed * 12}
                infra_sig = {"road": "Good", "power": "20h/day", "cloth_market_distance_km": 8.5}
            elif cat == "Flour Mill":
                demand_proxy = {"annual_wheat_production_tons": 2500 + var_seed * 50, "daily_household_grinding_kg": 1500 + var_seed * 30}
                infra_sig = {"road": "Good", "power": "22h/day 3-Phase", "grinding_space": "Available"}
            else:  # Two-Wheeler Repair
                demand_proxy = {"registered_two_wheelers": 1800 + var_seed * 35, "daily_commuter_traffic": 3200 + var_seed * 40}
                infra_sig = {"road": "Highway Touch", "power": "18h/day", "spare_distributor": "Within 10km"}

            confidence = 80 + ((v_idx * 5 + c_idx * 3) % 16)  # Range 80-95
            
            sources_options = [
                ["Census", "LGD", "Economic Census"],
                ["Census", "Livestock Census", "Mapped Business Data"],
                ["LGD", "Economic Census", "Mapped Business Data"],
                ["Census", "Economic Census", "District Industries Survey"]
            ]
            selected_sources = sources_options[(v_idx + c_idx) % 4]

            doc = {
                "village_id": v_id,
                "category": cat,
                "relevant_population": 8000 + v_idx * 500 + c_idx * 300,
                "target_households": 1600 + v_idx * 100 + c_idx * 50,
                "relevant_workers": 3200 + v_idx * 200 + c_idx * 80,
                "competitor_breakdown": {
                    "band_0_2km": c_0_2,
                    "band_2_5km": c_2_5,
                    "band_5_10km": c_5_10,
                    "total_competitors": total_comp
                },
                "named_competitors": named_comps,
                "infrastructure_signals": infra_sig,
                "category_demand_proxy": demand_proxy,
                "demand_level": demand_lvl,
                "supply_gap_level": supply_lvl,
                "repeat_purchase_likelihood": repeat_lvl,
                "evidence_confidence": confidence,
                "sources": selected_sources
            }
            stats_list.append(doc)
            
    return stats_list

MOCK_VILLAGE_BUSINESS_STATS = generate_50_business_stats()
