MOCK_BUSINESS_MODELS = [
    {
        "category": "Dairy",
        "display_name": "Dairy Farming & Milk Collection",
        "icon_key": "dairy_cow",
        "description": "Establishment of small-scale dairy unit (2-5 milch cattle) with milk chilling/chilling center supply chain connection.",
        "capital_min": 300000,
        "capital_max": 700000,
        "demand_drivers": ["Daily household milk consumption", "Sweet shops & tea stalls demand", "Cooperative procurement price"],
        "supply_signals": ["Local fodder availability", "Veterinary service access", "Cold-chain collection route"],
        "infrastructure_requirements": ["Cattle shed workspace", "Continuous water supply", "Power backup for chilling"],
        "risk_factors": ["Cattle disease outbreak", "Fluctuations in fodder prices", "Perishable milk spoilage"],
        "scoring_weights": {"demand": 0.30, "supply_gap": 0.20, "purchasing_power": 0.15, "accessibility": 0.15, "infrastructure": 0.10, "financial_fit": 0.10}
    },
    {
        "category": "Poultry",
        "display_name": "Small-scale Poultry Unit",
        "icon_key": "poultry_hen",
        "description": "Broiler or layer poultry farm setup supplying local meat shops, weekly haats, and roadside dhabas.",
        "capital_min": 150000,
        "capital_max": 400000,
        "demand_drivers": ["High protein dietary demand", "Weekly rural market (haat) sales", "Local eatery consumption"],
        "supply_signals": ["Commercial feed availability", "Hatchery day-old chick supply", "Vaccination support"],
        "infrastructure_requirements": ["Ventilated poultry shed", "Biosecurity fencing", "Clean drinking water"],
        "risk_factors": ["Bird flu outbreaks", "Feed cost spikes", "Heat stress mortality"],
        "scoring_weights": {"demand": 0.30, "supply_gap": 0.20, "purchasing_power": 0.15, "accessibility": 0.15, "infrastructure": 0.10, "financial_fit": 0.10}
    },
    {
        "category": "Tailoring",
        "display_name": "Tailoring & Garment Shop",
        "icon_key": "tailor_needle",
        "description": "Custom tailoring, stitching, alteration, and ready-made garment sales center for rural households.",
        "capital_min": 50000,
        "capital_max": 200000,
        "demand_drivers": ["School uniform stitching seasons", "Festival & wedding apparel demand", "Routine daily alterations"],
        "supply_signals": ["Cloth fabric wholesale access", "Thread & accessories availability", "Sewing machine servicing"],
        "infrastructure_requirements": ["Roadside shop workspace", "Motorized sewing machines", "Electricity fitting"],
        "risk_factors": ["Seasonal demand swings", "Ready-made garment competition", "Power outages"],
        "scoring_weights": {"demand": 0.30, "supply_gap": 0.20, "purchasing_power": 0.15, "accessibility": 0.15, "infrastructure": 0.10, "financial_fit": 0.10}
    },
    {
        "category": "Flour Mill",
        "display_name": "Flour Mill (Atta Chakki)",
        "icon_key": "flour_mill",
        "description": "Commercial grain grinding mill for wheat, maize, pulses, and spices serving village households.",
        "capital_min": 200000,
        "capital_max": 600000,
        "demand_drivers": ["Daily fresh flour preference in households", "Harvest season grain processing", "Spice grinding demand"],
        "supply_signals": ["Local grain production volume", "High-power motor equipment supply", "Diesel generator backup"],
        "infrastructure_requirements": ["Commercial power line (3-phase)", "Dust-controlled grinding room", "Grain storage space"],
        "risk_factors": ["High electricity tariffs", "Machine breakdown during peak harvest", "Competition from packaged flour"],
        "scoring_weights": {"demand": 0.30, "supply_gap": 0.20, "purchasing_power": 0.15, "accessibility": 0.15, "infrastructure": 0.10, "financial_fit": 0.10}
    },
    {
        "category": "Two-Wheeler Repair",
        "display_name": "Two-Wheeler Workshop & Spare Parts",
        "icon_key": "wrench_repair",
        "description": "Servicing, repair, tire vulcanizing, and spare parts retail for motorcycles and scooters.",
        "capital_min": 100000,
        "capital_max": 300000,
        "demand_drivers": ["High rural motorcycle ownership", "Commuter daily wear-and-tear", "Seasonal agricultural transport use"],
        "supply_signals": ["Genuine spare parts distribution", "Lubricant oil supplier linkages", "Pneumatic tool access"],
        "infrastructure_requirements": ["Main road frontage garage", "Air compressor & washing pit", "Tool storage racks"],
        "risk_factors": ["Counterfeit spare parts", "Skilled mechanic retention", "Environmental waste compliance"],
        "scoring_weights": {"demand": 0.30, "supply_gap": 0.20, "purchasing_power": 0.15, "accessibility": 0.15, "infrastructure": 0.10, "financial_fit": 0.10}
    }
]
