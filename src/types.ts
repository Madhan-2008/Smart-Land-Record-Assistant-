export type IndianState =
  | "Maharashtra"
  | "Uttar Pradesh"
  | "Karnataka"
  | "Tamil Nadu"
  | "Telangana"
  | "Gujarat"
  | "Punjab"
  | "West Bengal"
  | "Rajasthan";

export type LandClassification =
  | "Agricultural (Wet / Bagayat)"
  | "Agricultural (Dry / Jirayat)"
  | "Residential / Abadi / Gaothan"
  | "Commercial / Industrial"
  | "Government / Poramboke"
  | "Forest / Protected Buffer"
  | "Water Body / Kuttai / Nala";

export interface LandOwner {
  id: string;
  name: string;
  relation: string; // e.g. S/o, W/o, D/o
  sharePercentage: number;
  khataNumber: string;
  aadhaarLinked: boolean;
  contactMasked?: string;
  isMinor?: boolean;
  guardianName?: string;
}

export interface EncumbranceEntry {
  id: string;
  institutionName: string;
  amount: string;
  loanType: string;
  registeredDate: string;
  status: "ACTIVE_LIEN" | "CLEARED" | "DISPUTED";
  referenceDeedNo: string;
}

export interface MutationHistoryEntry {
  id: string;
  ferfarNumber: string;
  type: "Sale" | "Inheritance (Virasat)" | "Partition (Batwara)" | "Gift" | "Bank Charge" | "Court Decree";
  date: string;
  fromParties: string[];
  toParties: string[];
  status: "CERTIFIED" | "PENDING_OBJECTION" | "REJECTED";
  remarks: string;
  officerDesignation: string;
}

export interface CadastralParcel {
  surveyNumber: string;
  hissaNumber?: string;
  polygonPoints: [number, number][]; // SVG relative coordinates
  centerPoint: [number, number];
  areaSqMeters: number;
  areaAcresGuntas: string;
  classification: LandClassification;
  landUseColor: string;
  currentOwnerNames: string[];
  guidelineRatePerSqFt: number;
  hasActiveDispute: boolean;
  hasWaterAccess: boolean;
  roadAccessWidthFeet: number;
}

export interface LandRecord {
  id: string;
  ulpin: string; // 14-digit Unique Land Parcel Identification Number (Bhu-Aadhaar)
  state: IndianState;
  district: string;
  talukTehsil: string;
  villageHobli: string;
  surveyKhasraNumber: string;
  subdivisionHissaNumber: string;
  recordFormatName: string; // e.g. "7/12 Extract (MahaBhumi)", "RTC / Pahani (Bhoomi)", "Khasra-Khatauni (Bhulekh)", "Patta Chitta"
  totalExtent: string; // e.g. "2 Acres 14 Guntas" or "1.45 Hectare"
  assessmentTaxAnnual: string;
  soilType: string;
  sourceOfIrrigation: string;
  currentSeasonCrop: string;
  guidelineMarketValue: string;
  readyReckonerRatePerAcre: string;
  landClassification: LandClassification;
  owners: LandOwner[];
  encumbrances: EncumbranceEntry[];
  mutationHistory: MutationHistoryEntry[];
  boundaries: {
    north: string;
    south: string;
    east: string;
    west: string;
  };
  cadastralParcel: CadastralParcel;
  lastUpdatedDate: string;
  digitalSignatureHash: string;
  isDisputed: boolean;
  disputeNotes?: string;
}

export interface ExtractedMissingField {
  fieldName: string;
  severity: "CRITICAL" | "WARNING" | "INFO";
  reason: string;
  recommendation: string;
}

export interface OcrExtractionResult {
  documentType: string;
  extractedFields: {
    documentNumber?: string;
    registrationDate?: string;
    subRegistrarOffice?: string;
    state?: string;
    district?: string;
    taluk?: string;
    village?: string;
    surveyNumber?: string;
    extentArea?: string;
    landClassification?: string;
    considerationAmount?: string;
    stampDutyPaid?: string;
    registrationFee?: string;
    transferorSeller?: string;
    transfereeBuyer?: string;
    boundaries?: {
      north?: string;
      south?: string;
      east?: string;
      west?: string;
    };
  };
  missingFields: ExtractedMissingField[];
  confidenceScore: number;
  summary: string;
  actionableNextSteps: string[];
}

export interface LegalTerm {
  id: string;
  term: string;
  nativeScript?: string;
  category: "Ownership & Title" | "Measurement & Cadastral" | "Revenue & Tax" | "Transaction & Transfer" | "Dispute & Restraint";
  primaryState: string;
  shortDefinition: string;
  simpleExplanation: string;
  analogy: string;
  stateEquivalents: Record<string, string>;
  commonPitfalls: string[];
  audioPronunciationText?: string;
}

export type MutationStage =
  | "APPLICATION_SUBMITTED"
  | "DOCUMENT_VERIFIED"
  | "PUBLIC_NOTICE_ISSUED"
  | "FIELD_INSPECTION"
  | "HEARING_DISPUTE_CHECK"
  | "FINAL_ORDER_PASSED"
  | "ROR_UPDATED";

export interface MutationApplication {
  id: string;
  applicationNumber: string;
  applicantName: string;
  applicantPhone: string;
  mutationType: "Sale Deed Transfer" | "Virasat (Inheritance)" | "Batwara (Partition)" | "Gift Deed" | "Will Probate" | "Bank Charge Clearance";
  state: IndianState;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  appliedDate: string;
  expectedCompletionDate: string;
  currentStage: MutationStage;
  stageProgressPercent: number;
  daysRemainingInPublicNotice: number;
  assignedOfficer: {
    name: string;
    designation: string;
    office: string;
    contactNumber: string;
  };
  stagesTimeline: {
    stage: MutationStage;
    title: string;
    completed: boolean;
    date?: string;
    notes: string;
  }[];
  objectionsReceived: {
    id: string;
    objectorName: string;
    filingDate: string;
    groundOfObjection: string;
    status: "DISMISSED" | "UNDER_HEARING" | "RESOLVED";
    resolutionNotes?: string;
  }[];
  paymentReceiptNumber: string;
  feesPaidAmount: string;
}

export interface DocumentChecklistItem {
  id: string;
  name: string;
  description: string;
  isMandatory: boolean;
  issuingAuthority: string;
  validityPeriod?: string;
  sampleFormatDescription?: string;
  checked?: boolean;
}

export interface TransactionScenario {
  id: string;
  title: string;
  tagline: string;
  iconName: string;
  estimatedTimeline: string;
  averageStampDutyPercent: string;
  statutoryFee: string;
  keyActs: string[];
  items: DocumentChecklistItem[];
  precautions: string[];
}

export interface LandNotification {
  id: string;
  title: string;
  message: string;
  type: "MUTATION_UPDATE" | "SURVEY_ALERT" | "OBJECTION_NOTICE" | "TAX_REMINDER" | "LEGAL_ADVISORY";
  date: string;
  read: boolean;
  surveyNumber?: string;
  applicationId?: string;
  actionUrlTab?: string;
}
