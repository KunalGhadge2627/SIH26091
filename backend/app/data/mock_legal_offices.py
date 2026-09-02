MOCK_LEGAL_OFFICES = [
    {
        "office_id": "LEG_2701",
        "name": "District Legal Services Authority, Pune",
        "address": "District Court Compound, Shivajinagar, Pune, Maharashtra 411005",
        "phone": "+91 20 2553 4210",
        "district": "Pune",
        "state": "Maharashtra",
        "latitude": 18.5308,
        "longitude": 73.8474,
        "services_offered": ["report_review", "msme_registration", "general_legal_aid", "micro_finance_counseling"],
        "office_type": "District Legal Services Authority"
    },
    {
        "office_id": "LEG_2702",
        "name": "District Industries Centre (DIC), Pune",
        "address": "Agricultural College Campus, Shivajinagar, Pune, Maharashtra 411005",
        "phone": "+91 20 2553 7891",
        "district": "Pune",
        "state": "Maharashtra",
        "latitude": 18.5362,
        "longitude": 73.8489,
        "services_offered": ["msme_registration", "subsidies_guidance", "scheme_verification"],
        "office_type": "District Industries Centre"
    },
    {
        "office_id": "LEG_0901",
        "name": "District Legal Services Authority, Baghpat",
        "address": "District Court Complex, Main Highway, Baghpat, Uttar Pradesh 250609",
        "phone": "+91 121 222 0451",
        "district": "Baghpat",
        "state": "Uttar Pradesh",
        "latitude": 28.9458,
        "longitude": 77.2214,
        "services_offered": ["report_review", "general_legal_aid", "msme_registration"],
        "office_type": "District Legal Services Authority"
    },
    {
        "office_id": "LEG_0301",
        "name": "District Legal Services Authority, Moga",
        "address": "Judicial Court Complex, GT Road, Moga, Punjab 142001",
        "phone": "+91 1636 235 120",
        "district": "Moga",
        "state": "Punjab",
        "latitude": 30.8124,
        "longitude": 75.1742,
        "services_offered": ["report_review", "general_legal_aid", "agri_business_legal"],
        "office_type": "District Legal Services Authority"
    },
    {
        "office_id": "LEG_3301",
        "name": "District Legal Services Authority, Erode",
        "address": "Combined Court Building, Sampath Nagar, Erode, Tamil Nadu 638011",
        "phone": "+91 424 226 2341",
        "district": "Erode",
        "state": "Tamil Nadu",
        "latitude": 11.3410,
        "longitude": 77.7172,
        "services_offered": ["report_review", "msme_registration", "general_legal_aid"],
        "office_type": "District Legal Services Authority"
    },
    {
        "office_id": "LEG_2901",
        "name": "District Legal Services Authority, Bengaluru Rural",
        "address": "District Court Complex, Devanahalli, Bengaluru Rural, Karnataka 562110",
        "phone": "+91 80 2768 2140",
        "district": "Bengaluru Rural",
        "state": "Karnataka",
        "latitude": 13.2450,
        "longitude": 77.7100,
        "services_offered": ["report_review", "msme_registration", "general_legal_aid", "land_document_check"],
        "office_type": "District Legal Services Authority"
    },
    {
        "office_id": "LEG_0801",
        "name": "District Legal Services Authority, Hanumangarh",
        "address": "Court Premises, Hanumangarh Junction, Rajasthan 335512",
        "phone": "+91 1552 260 182",
        "district": "Hanumangarh",
        "state": "Rajasthan",
        "latitude": 29.5810,
        "longitude": 74.3210,
        "services_offered": ["report_review", "general_legal_aid", "scheme_verification"],
        "office_type": "District Legal Services Authority"
    },
    {
        "office_id": "LEG_1901",
        "name": "District Legal Services Authority, Hooghly",
        "address": "District Court Campus, Chinsurah, Hooghly, West Bengal 712101",
        "phone": "+91 33 2680 4120",
        "district": "Hooghly",
        "state": "West Bengal",
        "latitude": 22.9012,
        "longitude": 88.3912,
        "services_offered": ["report_review", "msme_registration", "general_legal_aid"],
        "office_type": "District Legal Services Authority"
    },
    {
        "office_id": "LEG_1001",
        "name": "District Legal Services Authority, Nalanda",
        "address": "Civil Court Premises, Bihar Sharif, Nalanda, Bihar 803101",
        "phone": "+91 6112 234 510",
        "district": "Nalanda",
        "state": "Bihar",
        "latitude": 25.1980,
        "longitude": 85.5140,
        "services_offered": ["report_review", "general_legal_aid", "micro_finance_counseling"],
        "office_type": "District Legal Services Authority"
    },
    {
        "office_id": "LEG_2401",
        "name": "District Legal Services Authority, Ahmedabad Rural",
        "address": "Mirzapur Court Complex, Ahmedabad, Gujarat 380001",
        "phone": "+91 79 2562 1040",
        "district": "Ahmedabad",
        "state": "Gujarat",
        "latitude": 23.0310,
        "longitude": 72.5810,
        "services_offered": ["report_review", "msme_registration", "general_legal_aid"],
        "office_type": "District Legal Services Authority"
    },
    {
        "office_id": "LEG_2101",
        "name": "District Legal Services Authority, Jajpur",
        "address": "District Judge Court, Jajpur Town, Odisha 755001",
        "phone": "+91 6728 222 140",
        "district": "Jajpur",
        "state": "Odisha",
        "latitude": 20.8500,
        "longitude": 86.3300,
        "services_offered": ["report_review", "general_legal_aid", "msme_registration"],
        "office_type": "District Legal Services Authority"
    }
]

DOCUMENT_CHECKLISTS = {
    "Dairy": {
        "category": "Dairy",
        "document_list": [
            "Aadhaar Card & PAN Card of Applicant",
            "Proof of Land / Workspace Ownership or Lease Agreement",
            "Bank Account Passbook (last 6 months statement)",
            "Voter ID / Ration Card for Residence Proof",
            "Cattle Breed & Health Clearance Certificate from Local Veterinary Doctor",
            "Udyam MSME Registration Certificate"
        ],
        "regulatory_requirements": [
            "Local Gram Panchayat No Objection Certificate (NOC) for animal shed setup",
            "FSSAI Food Safety License (if selling processed milk or milk products directly)"
        ]
    },
    "Poultry": {
        "category": "Poultry",
        "document_list": [
            "Aadhaar Card & PAN Card of Applicant",
            "Land Lease Agreement / Possession Certificate for poultry shed",
            "Bank Account Statement (last 6 months)",
            "Water Quality Test & Source Availability Proof",
            "Udyam MSME Registration Certificate"
        ],
        "regulatory_requirements": [
            "Gram Panchayat NOC for biosecurity and odor control distance compliance",
            "Veterinary Health Clearance Certificate for Day-Old Chicks (DOC)"
        ]
    },
    "Tailoring": {
        "category": "Tailoring",
        "document_list": [
            "Aadhaar Card & PAN Card",
            "Shop Rent Agreement or Shop Ownership Proof",
            "Bank Passbook Statement",
            "Skill Training / Apprenticeship Certificate (if available)",
            "Udyam MSME Registration Certificate"
        ],
        "regulatory_requirements": [
            "Gram Panchayat Trade License / Shop & Establishment Registration"
        ]
    },
    "Flour Mill": {
        "category": "Flour Mill",
        "document_list": [
            "Aadhaar Card & PAN Card",
            "Commercial Property Land / Shop Lease Deed",
            "3-Phase Commercial Electricity Connection Sanction Letter",
            "Bank Account Passbook",
            "Udyam MSME Registration Certificate"
        ],
        "regulatory_requirements": [
            "Gram Panchayat Commercial Trade NOC",
            "FSSAI Registration / License for Grain Processing",
            "State Pollution Control Board Green Category Clearance (if high-capacity motor used)"
        ]
    },
    "Two-Wheeler Repair": {
        "category": "Two-Wheeler Repair",
        "document_list": [
            "Aadhaar Card & PAN Card",
            "Workshop Garage Rent / Ownership Document",
            "Bank Account Passbook",
            "Mechanic ITI Certificate or Skill Experience Proof",
            "Udyam MSME Registration Certificate"
        ],
        "regulatory_requirements": [
            "Gram Panchayat Workshop Trade License",
            "Used Oil & Hazardous Waste Management Undertaking Certificate"
        ]
    }
}
