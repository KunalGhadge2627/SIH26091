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

# Named directory entries keep the demo usable without exposing generated
# labels such as "Nashik Block 1" or "Nashik Village 1".
REAL_BLOCKS = {
    "Pune": ["Shirur", "Junnar", "Khed", "Maval", "Daund"],
    "Nashik": ["Nashik", "Dindori", "Igatpuri", "Sinnar", "Yeola"],
    "Nagpur": ["Nagpur Rural", "Hingna", "Kamptee", "Katol", "Umred"],
    "Aurangabad": ["Aurangabad", "Paithan", "Gangapur", "Kannad", "Sillod"],
    "Kolhapur": ["Karvir", "Panhala", "Hatkanangale", "Shirol", "Kagal"],
    "Bengaluru Rural": ["Devanahalli", "Doddaballapura", "Hosakote", "Nelamangala", "Anekal"],
    "Mysuru": ["Mysuru", "Hunsur", "Nanjangud", "Periyapatna", "T. Narasipura"],
    "Belagavi": ["Belagavi", "Athani", "Bailhongal", "Chikodi", "Gokak"],
    "Dharwad": ["Dharwad", "Hubballi", "Kalghatgi", "Kundgol", "Navalgund"],
    "Shivamogga": ["Shivamogga", "Bhadravati", "Sagar", "Shikaripura", "Thirthahalli"],
    "Jaipur": ["Amber", "Bassi", "Chaksu", "Jamwa Ramgarh", "Sanganer"],
    "Jodhpur": ["Balesar", "Bhopalgarh", "Luni", "Osian", "Shergarh"],
    "Udaipur": ["Girwa", "Gogunda", "Jhadol", "Kherwara", "Salumbar"],
    "Kota": ["Ladpura", "Digod", "Itawa", "Pipalda", "Sangod"],
    "Ajmer": ["Ajmer", "Beawar", "Bhinay", "Kekri", "Masuda"],
    "Lucknow": ["Bakshi Ka Talab", "Chinhat", "Gosainganj", "Malihabad", "Mohan"],
    "Agra": ["Achhnera", "Bichpuri", "Etmadpur", "Fatehabad", "Kheragarh"],
    "Varanasi": ["Arajiline", "Chiraigaon", "Harhua", "Kashi Vidyapeeth", "Pindra"],
    "Prayagraj": ["Bahria", "Chaka", "Jasra", "Koraon", "Meja"],
    "Meerut": ["Daurala", "Hastinapur", "Jani Khurd", "Kharkhoda", "Mawana"],
    "Chennai": ["Ambattur", "Alandur", "Madhurantakam", "Poonamallee", "Tiruvallur"],
    "Coimbatore": ["Annur", "Karamadai", "Madukkarai", "Pollachi", "Sulur"],
    "Madurai": ["Kalligudi", "Melur", "Perungudi", "Tirumangalam", "Usilampatti"],
    "Salem": ["Attur", "Edappadi", "Mettur", "Omalur", "Sankari"],
    "Tiruchirappalli": ["Lalgudi", "Manachanallur", "Manapparai", "Musiri", "Thuraiyur"],
    "Ahmedabad": ["Bavla", "Daskroi", "Dholka", "Detroj-Rampura", "Sanand"],
    "Surat": ["Bardoli", "Choryasi", "Kamrej", "Mandvi", "Olpad"],
    "Vadodara": ["Dabhoi", "Desar", "Karjan", "Padra", "Savli"],
    "Rajkot": ["Dhoraji", "Gondal", "Jasdan", "Jetpur", "Paddhari"],
    "Bhavnagar": ["Bhavnagar", "Gariadhar", "Ghogha", "Mahuva", "Palitana"],
    "Kolkata": ["Behala", "Bhangar", "Bishnupur", "Sonarpur", "Thakurpukur"],
    "Hooghly": ["Chanditala", "Dhanyakhali", "Singur", "Tarakeswar", "Polba-Dadpur"],
    "Nadia": ["Chakdaha", "Haringhata", "Kaliganj", "Krishnagar-I", "Ranaghat-I"],
    "Darjeeling": ["Darjeeling-Pulbazar", "Jorethang", "Kurseong", "Mirik", "Rangli Rangliot"],
    "Murshidabad": ["Berhampore", "Domkal", "Jalangi", "Kandi", "Lalgola"],
    "Thiruvananthapuram": ["Nedumangad", "Neyyattinkara", "Parassala", "Perumkadavila", "Varkala"],
    "Ernakulam": ["Alangad", "Angamaly", "Kothamangalam", "Kunnathunad", "Paravur"],
    "Kozhikode": ["Balussery", "Koduvally", "Koyilandy", "Thamarassery", "Vadakara"],
    "Thrissur": ["Chavakkad", "Chowannur", "Irinjalakuda", "Kodungallur", "Mukundapuram"],
    "Kollam": ["Karunagappally", "Kottarakkara", "Kunnathur", "Pathanapuram", "Punalur"],
    "Visakhapatnam": ["Anakapalle", "Bheemunipatnam", "Gajuwaka", "Padmanabham", "Pendurthi"],
    "Vijayawada": ["Gannavaram", "Ibrahimpatnam", "Kankipadu", "Mylavaram", "Nandigama"],
    "Guntur": ["Amaravathi", "Duggirala", "Mangalagiri", "Narasaraopet", "Tadikonda"],
    "Tirupati": ["Chandragiri", "Kota", "Renigunta", "Srikalahasti", "Tirupati Rural"],
    "Kurnool": ["Adoni", "Alur", "Dhone", "Nandikotkur", "Pattikonda"],
    "Bhopal": ["Berasia", "Phanda", "Huzur", "Kolar", "Sehore Rural"],
    "Indore": ["Depalpur", "Dr. Ambedkar Nagar", "Indore", "Sanwer", "Sawer"],
    "Jabalpur": ["Jabalpur", "Kundam", "Majholi", "Panagar", "Shahpura"],
    "Gwalior": ["Bhitarwar", "Dabra", "Ghatigaon", "Morar", "Pichhore"],
    "Ujjain": ["Badnagar", "Ghatiya", "Khachrod", "Mahidpur", "Ujjain"],
}

REAL_VILLAGES = {
    "Nashik": ["Gangapur", "Makhmalabad", "Adgaon", "Pathardi", "Deolali"],
    "Pune": ["Shikrapur", "Ranjangaon", "Karegaon", "Sanaswadi", "Wadebolhai"],
    "Nagpur": ["Koradi", "Wadi", "Besa", "Pipla", "Khapri"],
    "Aurangabad": ["Waluj", "Chitegaon", "Karmad", "Shendra", "Bidkin"],
    "Kolhapur": ["Gargoti", "Kuditre", "Rukadi", "Balinga", "Kagalwadi"],
    "Bengaluru Rural": ["Vijayapura", "Hesaraghatta", "Budigere", "Sondekoppa", "Sulibele"],
    "Mysuru": ["Kadakola", "Suttur", "Hampapura", "Hunsur-Kote", "Ilavala Hobli"],
    "Belagavi": ["Kakati", "Nesargi", "Sambra", "Yaragatti", "Kittur"],
    "Dharwad": ["Mummigatti", "Garag", "Hebballi", "Sattur", "Amminabhavi"],
    "Shivamogga": ["Ayanur", "Holehonnur", "Kumsi", "Ripponpet", "Anavatti"],
    "Jaipur": ["Vatika", "Kukas", "Bagru", "Sambhar", "Dudu"],
    "Jodhpur": ["Mandore", "Mathania", "Tiwari", "Tinwari", "Dangiyawas"],
    "Udaipur": ["Badi", "Bambora", "Debari", "Gogunda Town", "Rishabhdeo"],
    "Kota": ["Borkheda", "Keshoraipatan", "Sultanpur", "Khatoli", "Dara"],
    "Ajmer": ["Pushkar", "Nasirabad", "Sarwar", "Kishangarh", "Vijainagar"],
    "Lucknow": ["Itaunja", "Kakori", "Nagram", "Satrikh", "Mohan Road"],
    "Agra": ["Fatehpur Sikri", "Kiraoli", "Jagner", "Dayalbagh", "Runkata"],
    "Varanasi": ["Sewapuri", "Sindhora", "Babatpur", "Lohata", "Ramnagar"],
    "Prayagraj": ["Phulpur", "Handia", "Shankargarh", "Soraon", "Naini"],
    "Meerut": ["Parikshitgarh", "Sardhana", "Lawar", "Kithore", "Pawli Khas"],
    "Chennai": ["Puzhal", "Manali", "Kundrathur", "Perumbakkam", "Madhavaram"],
    "Coimbatore": ["Vellamadai", "Kinathukadavu", "Sulur Village", "Thudiyalur", "Periyanaickenpalayam"],
    "Madurai": ["Arittapatti", "Alanganallur", "Avaniyapuram", "Othakadai", "Vadipatti"],
    "Salem": ["Mallasamudram", "Veerapandi", "Tharamangalam", "Kondalampatti", "Ayothiapattinam"],
    "Tiruchirappalli": ["Samayapuram", "Srirangam", "Thuvakudi", "Kumbakudi", "Puthanatham"],
    "Ahmedabad": ["Changodar", "Kudasan", "Bopal", "Ghuma", "Sarkhej"],
    "Surat": ["Utran", "Vesu", "Palsana", "Sachin", "Kosamba"],
    "Vadodara": ["Waghodia", "Manjusar", "Sama", "Makarpura", "Harni"],
    "Rajkot": ["Mota Mava", "Kothariya", "Vavdi", "Gondal Road", "Shapar"],
    "Bhavnagar": ["Sihor", "Talaja", "Vartej", "Sidsar", "Barton Park"],
    "Kolkata": ["Joka", "Garia", "New Town", "Tollygunge", "Kasba"],
    "Hooghly": ["Bandel", "Chinsurah", "Serampore", "Uttarpara", "Arambagh"],
    "Nadia": ["Nabadwip", "Santipur", "Tehatta", "Bethuadahari", "Madanpur"],
    "Darjeeling": ["Sukhiapokhri", "Sonada", "Kurseong Town", "Ghoom", "Tukvar"],
    "Murshidabad": ["Jiaganj", "Khargram", "Raghunathganj", "Suti", "Beldanga"],
    "Thiruvananthapuram": ["Attingal", "Kovalam", "Kazhakoottam", "Vellanad", "Kattakada"],
    "Ernakulam": ["Kakkanad", "Tripunithura", "Aluva", "Perumbavoor", "Muvattupuzha"],
    "Kozhikode": ["Feroke", "Ramanattukara", "Kadalundi", "Nadapuram", "Payyoli"],
    "Thrissur": ["Guruvayur", "Wadakkanchery", "Koratty", "Mala", "Puthukkad"],
    "Kollam": ["Chathannoor", "Kundara", "Oachira", "Sasthamkotta", "Chadayamangalam"],
    "Visakhapatnam": ["Duvvada", "Sabbavaram", "Parawada", "Bheemunipatnam Rural", "Nathavaram"],
    "Vijayawada": ["Penamaluru", "Vuyyuru", "Kondapalli", "Jaggayyapeta", "Kanchikacherla"],
    "Guntur": ["Tenali", "Ponnur", "Bapatla", "Piduguralla", "Sattenapalle"],
    "Tirupati": ["Puttur", "Nagari", "Pakala", "Yerpedu", "Buchinaidu Kandriga"],
    "Kurnool": ["Yemmiganur", "Banaganapalle", "Nandyal", "Kodumur", "Orvakal"],
    "Bhopal": ["Khejra", "Ratibad", "Bairagarh", "Bilkisganj", "Mandideep"],
    "Indore": ["Rau", "Mhowgaon", "Gautampura", "Hatod", "Kanadia"],
    "Jabalpur": ["Gwarighat", "Barela", "Patan", "Sihora", "Tilwara"],
    "Gwalior": ["Mohana", "Dabra Road", "Tekanpur", "Bilaua", "Morar Cantt"],
    "Ujjain": ["Tarana", "Makdon", "Unhel", "Nagda", "Panwasa"],
}


def _village_record(state, state_info, district, district_index, block_index, village_index):
    blocks = REAL_BLOCKS.get(district, [district] * 5)
    block = blocks[block_index]
    villages = REAL_VILLAGES[district]
    village_name = villages[village_index]
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
