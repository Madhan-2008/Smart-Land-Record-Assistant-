export interface SampleDoc {
  id: string;
  title: string;
  category: string;
  state: string;
  documentType: string;
  fileSize: string;
  description: string;
  badge: string;
  simulatedText: string;
  defaultMissingCount: number;
}

export const SAMPLE_DOCUMENTS: SampleDoc[] = [
  {
    id: "sample-sale-deed-pune",
    title: "Sale Deed (Vikray Patra) - Gat No. 142/2A Wagholi",
    category: "Deed of Conveyance",
    state: "Maharashtra",
    documentType: "Sale Deed (Registered under Registration Act 1908)",
    fileSize: "1.8 MB Scan",
    description: "Registered Agricultural conveyance deed with missing co-parcener legal heir NOC and unverified southern boundary width.",
    badge: "Missing Heir NOC Flagged",
    simulatedText: `GOVERNMENT OF MAHARASHTRA
DEPARTMENT OF REGISTRATION AND STAMPS
SUB-REGISTRAR HAVELI-04, DISTRICT PUNE

DEED OF SALE (VIKRAY PATRA)
Document Number: REG/2024/7821/BK1
Date of Execution: 18th April 2024

TRANSFEROR (SELLER):
Ramesh Narayan Patil, Age 52, Residing at House No. 45, Gaothan Wagholi, Taluka Haveli, Dist Pune. (PAN: ABCPP1290K)

TRANSFEREE (BUYER):
Suresh Baburao Deshmukh, Age 44, Residing at Flat 302, Green Meadows, Viman Nagar, Pune. (PAN: BXXPD4412L)

SCHEDULE OF PROPERTY CONVEYED:
All that piece and parcel of Agricultural Land situated at Village Wagholi, Taluka Haveli, District Pune:
Gat Number: 142/2A
Area / Extent: 0.45 Hectare (equivalent to 1.11 Acres / 45 Ares)
Assessment: ₹ 18.50 per annum
Consideration Amount: ₹ 42,50,000/- (Rupees Forty-Two Lakhs Fifty Thousand Only)
Stamp Duty Paid: ₹ 2,97,500/- via e-Challan GRN #MH009281729
Registration Fee: ₹ 30,000/-

BOUNDARIES:
North: Gat No. 142/1 of Anil Kulkarni
South: Village Approach Cart Road
East: Canal Distributary Channel #3
West: Gat No. 143 of Shantaram Shinde

NOTE: Property is acquired through ancestral inheritance (Ferfar No. 1289). Seller declares full right to transfer.

WITNESSES:
1. Mahendra Joshi, Wagholi (Aadhaar: **** **** 8812)
2. Dilip More, Pune (ID: Voter Card #XYZ10293)`,
    defaultMissingCount: 3,
  },
  {
    id: "sample-712-extract",
    title: "MahaBhumi 7/12 Extract - Pending Ferfar Mutation Note",
    category: "Record of Rights (RoR)",
    state: "Maharashtra",
    documentType: "Village Form 7 & 12 (Saat-Baara)",
    fileSize: "950 KB PDF",
    description: "Official 7/12 computerized extract with active pending mutation caveat (Ferfar 1402) and bank hypothecation lien.",
    badge: "Pending Mutation & Bank Lien",
    simulatedText: `MAHARASHTRA LAND REVENUE RECORD (MAHABHUMI)
VILLAGE FORM VII (हक्क नोंदणी) & FORM XII (पीक पाहणी)

State: Maharashtra | District: Pune | Taluka: Haveli | Village: Wagholi
Gat Number: 142 / 2A | Total Area: 0.45.00 Hectare | Pot-Kharab: 0.00.00

OCCUPANTS / KHATEDAR (भोगवटादार वर्ग - १):
1. Ramesh Narayan Patil (Share: 60%) - Khata #4081
2. Sunita Ramesh Patil (Share: 40%) - Khata #4081

OTHER RIGHTS & LIABILITIES (इतर हक्क):
- Mutation Entry (Ferfar No. 1289): Succession from Late Narayan Patil.
- Mutation Entry (Ferfar No. 1402): PENDING / Under Objection. Bank charge in favor of Pune District Central Co-op Bank for ₹ 3,50,000 KCC loan.
- Civil Suit Notice: Caveat No. 89/2024 pending before Civil Court Junior Division, Pune.

FORM XII CROP DETAILS (वर्ष २०२४-२५):
Kharif Season: Sugarcane (0.35 Ha), Irrigated by Borewell
Rabi Season: Onion (0.10 Ha)
Cultivator: Self (Ramesh Patil)

Digitally Signed by: Talathi Wagholi, Saza Wagholi | Timestamp: 14-Jan-2025`,
    defaultMissingCount: 2,
  },
  {
    id: "sample-up-virasat",
    title: "Virasat (Inheritance) Application - Lucknow Tehsil",
    category: "Mutation Application (Form-VI)",
    state: "Uttar Pradesh",
    documentType: "Succession / Virasat Intiqal Application",
    fileSize: "1.2 MB Scan",
    description: "Virasat inheritance application under UP Revenue Code 2006 with missing female legal heir consent and unattached family pedigree.",
    badge: "Missing Female Heir Consent",
    simulatedText: `BEFORE THE TEHSILDAR / REVENUE COURT, SAROJINI NAGAR, LUCKNOW
APPLICATION FOR SUCCESSION MUTATION (VIRASAT) UNDER SEC 33 OF UP REVENUE CODE 2006

Village: Banthra | Tehsil: Sarojini Nagar | District: Lucknow
Khasra Number: 389 (Area: 0.82 Hectare) | Khatauni Khata Number: 00214

DECEASED KHATEDAR:
Late Mahendra Pratap Singh, S/o Late Ram Swaroop Singh (Died on: 12-Dec-2023)

APPLICANTS (CLAIMED HEIRS):
1. Awadhesh Pratap Singh (Son, Age 32)
2. Brijesh Pratap Singh (Son, Age 28)

GROUND OF APPLICATION:
The deceased passed away leaving behind the aforementioned two sons who are in actual cultivatory possession of Khasra No. 389. Applicants pray for deletion of deceased name and recording of their names in equal shares.

DOCUMENTS ATTACHED:
1. Death Certificate issued by Registrar of Births & Deaths, Lucknow
2. Copy of current Khatauni (Fasli Year 1428-1433)
3. Self-affidavit of Applicants

OMITTED FROM RECORD:
- Surviving Daughter / Sister details not listed in Schedule of Heirs (Hindu Succession Act Sec 6 compliance omitted)
- Uncertified Family Pedigree (Shajra-e-Nasab) without Gram Pradhan endorsement.`,
    defaultMissingCount: 2,
  },
  {
    id: "sample-tn-patta",
    title: "Tamil Nadu Patta Chitta & FMB Sketch - Sulur Taluk",
    category: "Patta & Cadastral FMB",
    state: "Tamil Nadu",
    documentType: "e-Patta Chitta & Field Measurement Book (FMB)",
    fileSize: "1.4 MB PDF",
    description: "Authentic Patta Chitta with Field Measurement Book survey sub-division coordinates and road setback markings.",
    badge: "Verified Clean Title",
    simulatedText: `GOVERNMENT OF TAMIL NADU - REVENUE DEPARTMENT
E-SERVICES FOR LAND RECORDS (ANYWHERE ANYTIME)

District: Coimbatore | Taluk: Sulur | Village: Irugur
Patta Number: 1402

PATTA OWNERS:
1. Palanisamy Muthusamy Gounder, S/o Muthusamy Gounder
2. Selvi Palanisamy, W/o Palanisamy Muthusamy

LAND DETAILS:
Survey Number: 214
Sub-Division Number: 1B
Old Survey No: 214/1-Part
Wet / Nanjai Land Extent: 0.85.00 Hectare (2.10 Acres)
Annual Teervai (Tax): ₹ 24.50

FMB SURVEY BOUNDARIES & CO-ORDINATES:
- Northern Boundary: Survey 214/1A (Retained land of K. Natarajan) - Line length 84.2 meters
- Southern Boundary: PWD Odai Canal Buffer (15m setback required)
- Eastern Boundary: Survey 215 - Line length 98.4 meters
- Western Boundary: Panchayat Tar Road - Road Width 30 feet

REMARKS:
Sub-division sanctioned vide Order #ROC/2022/Sulur/811.
No government stay or temple land (Inam / Devaswom) restrictions recorded.`,
    defaultMissingCount: 1,
  },
];
