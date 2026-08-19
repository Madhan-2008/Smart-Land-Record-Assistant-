import React, { useState, useMemo } from "react";
import {
  Search,
  MapPin,
  FileText,
  User,
  ShieldCheck,
  AlertTriangle,
  Download,
  Share2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building,
  Calendar,
  Layers,
  HelpCircle,
  Clock,
  ArrowRight,
  FileCheck,
} from "lucide-react";
import { LandRecord, IndianState } from "../types";
import { SAMPLE_LAND_RECORDS } from "../data/landRecords";

interface SearchLandRecordProps {
  selectedStateFilter: IndianState | "All";
  onSelectParcelForMap: (parcel: LandRecord) => void;
  onAuditDocForRecord: (record: LandRecord) => void;
  onTrackMutationForRecord: (surveyNo: string) => void;
}

export const SearchLandRecord: React.FC<SearchLandRecordProps> = ({
  selectedStateFilter,
  onSelectParcelForMap,
  onAuditDocForRecord,
  onTrackMutationForRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"quick" | "hierarchy">("quick");

  // Hierarchy filters
  const [filterState, setFilterState] = useState<string>(
    selectedStateFilter === "All" ? "Maharashtra" : selectedStateFilter
  );
  const [filterDistrict, setFilterDistrict] = useState<string>("Pune");
  const [filterTaluk, setFilterTaluk] = useState<string>("Haveli");
  const [filterVillage, setFilterVillage] = useState<string>("Wagholi");
  const [filterSurvey, setFilterSurvey] = useState<string>("");

  const [selectedRecordId, setSelectedRecordId] = useState<string>("REC-MH-PUN-01");
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Available unique options for dropdowns based on sample data
  const availableStates = Array.from(new Set(SAMPLE_LAND_RECORDS.map((r) => r.state)));
  const availableDistricts = Array.from(
    new Set(
      SAMPLE_LAND_RECORDS.filter((r) => r.state === filterState).map((r) => r.district)
    )
  );
  const availableTaluks = Array.from(
    new Set(
      SAMPLE_LAND_RECORDS.filter(
        (r) => r.state === filterState && (filterDistrict ? r.district === filterDistrict : true)
      ).map((r) => r.talukTehsil)
    )
  );
  const availableVillages = Array.from(
    new Set(
      SAMPLE_LAND_RECORDS.filter(
        (r) =>
          r.state === filterState &&
          (filterDistrict ? r.district === filterDistrict : true) &&
          (filterTaluk ? r.talukTehsil === filterTaluk : true)
      ).map((r) => r.villageHobli)
    )
  );

  // Filtered records list
  const filteredRecords = useMemo(() => {
    return SAMPLE_LAND_RECORDS.filter((record) => {
      if (selectedStateFilter !== "All" && record.state !== selectedStateFilter) {
        return false;
      }

      if (searchMode === "quick") {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        const matchesSurvey =
          record.surveyKhasraNumber.toLowerCase().includes(q) ||
          `${record.surveyKhasraNumber}/${record.subdivisionHissaNumber}`.toLowerCase().includes(q);
        const matchesUlpin = record.ulpin.toLowerCase().includes(q);
        const matchesVillage = record.villageHobli.toLowerCase().includes(q);
        const matchesDistrict = record.district.toLowerCase().includes(q);
        const matchesOwner = record.owners.some((o) => o.name.toLowerCase().includes(q));
        const matchesKhata = record.owners.some((o) => o.khataNumber.toLowerCase().includes(q));
        return matchesSurvey || matchesUlpin || matchesVillage || matchesDistrict || matchesOwner || matchesKhata;
      } else {
        if (filterState && record.state !== filterState) return false;
        if (filterDistrict && record.district !== filterDistrict) return false;
        if (filterTaluk && record.talukTehsil !== filterTaluk) return false;
        if (filterVillage && record.villageHobli !== filterVillage) return false;
        if (filterSurvey && !record.surveyKhasraNumber.includes(filterSurvey)) return false;
        return true;
      }
    });
  }, [searchQuery, searchMode, filterState, filterDistrict, filterTaluk, filterVillage, filterSurvey, selectedStateFilter]);

  const activeRecord = useMemo(() => {
    return (
      SAMPLE_LAND_RECORDS.find((r) => r.id === selectedRecordId) ||
      filteredRecords[0] ||
      SAMPLE_LAND_RECORDS[0]
    );
  }, [selectedRecordId, filteredRecords]);

  return (
    <div className="space-y-6">
      {/* Top Geometric Search Header Panel */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
              Land Record Search & Verification
            </h2>
            <h3 className="text-xl font-bold text-slate-900 tracking-tight">
              Search Land Records & View Certified RoR
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Access digitized 7/12, Khasra-Khatauni, RTC, and Patta Chitta with ownership shares and ULPIN.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded border border-slate-200 text-xs">
            <button
              onClick={() => setSearchMode("quick")}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                searchMode === "quick"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Quick Search
            </button>
            <button
              onClick={() => setSearchMode("hierarchy")}
              className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                searchMode === "hierarchy"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Hierarchy Drilldown
            </button>
          </div>
        </div>

        {/* Search Inputs Container */}
        <div className="mt-4">
          {searchMode === "quick" ? (
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  id="land-quick-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Khasra / Survey Number (e.g. 142/2A), ULPIN, or Owner Name..."
                  className="w-full pl-10 pr-16 py-3 bg-slate-50 border border-slate-200 rounded text-sm text-slate-800 focus:outline-none focus:border-indigo-500 font-sans"
                />
                <div className="absolute left-3.5 top-3.5 text-slate-400">
                  <Search className="w-4 h-4 text-indigo-600" />
                </div>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[11px] text-slate-400 hover:text-slate-700 bg-slate-200 rounded font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
              <button
                onClick={() => {}}
                className="bg-indigo-600 text-white px-6 py-3 rounded font-semibold text-xs uppercase tracking-wider hover:bg-indigo-700 shrink-0 transition-colors shadow-xs"
              >
                Fetch Record
              </button>
            </div>
          ) : (
            /* Hierarchy Form */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">State</label>
                <select
                  value={filterState}
                  onChange={(e) => {
                    setFilterState(e.target.value);
                    setFilterDistrict("");
                    setFilterTaluk("");
                    setFilterVillage("");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800 focus:border-indigo-500 font-medium"
                >
                  {availableStates.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">District</label>
                <select
                  value={filterDistrict}
                  onChange={(e) => {
                    setFilterDistrict(e.target.value);
                    setFilterTaluk("");
                    setFilterVillage("");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800 focus:border-indigo-500 font-medium"
                >
                  <option value="">All Districts</option>
                  {availableDistricts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Taluk / Tehsil</label>
                <select
                  value={filterTaluk}
                  onChange={(e) => {
                    setFilterTaluk(e.target.value);
                    setFilterVillage("");
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800 focus:border-indigo-500 font-medium"
                >
                  <option value="">All Taluks</option>
                  {availableTaluks.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Village / Hobli</label>
                <select
                  value={filterVillage}
                  onChange={(e) => setFilterVillage(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800 focus:border-indigo-500 font-medium"
                >
                  <option value="">All Villages</option>
                  {availableVillages.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-bold uppercase tracking-wider text-[10px] mb-1">Survey / Khasra</label>
                <input
                  type="text"
                  placeholder="e.g. 142 or 389"
                  value={filterSurvey}
                  onChange={(e) => setFilterSurvey(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded p-2.5 text-slate-800 placeholder-slate-400 focus:border-indigo-500 font-medium"
                />
              </div>
            </div>
          )}

          {/* Quick preset chips */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 overflow-x-auto no-scrollbar pt-1">
            <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 whitespace-nowrap">Quick Samples:</span>
            <button
              onClick={() => {
                setSearchMode("quick");
                setSearchQuery("142");
                setSelectedRecordId("REC-MH-PUN-01");
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 rounded border border-slate-200 whitespace-nowrap text-xs font-medium transition-colors"
            >
              Gat 142/2A Pune (7/12)
            </button>
            <button
              onClick={() => {
                setSearchMode("quick");
                setSearchQuery("389");
                setSelectedRecordId("REC-UP-LKO-02");
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 rounded border border-slate-200 whitespace-nowrap text-xs font-medium transition-colors"
            >
              Khasra 389 Lucknow (Khatauni)
            </button>
            <button
              onClick={() => {
                setSearchMode("quick");
                setSearchQuery("214");
                setSelectedRecordId("REC-TN-CBE-04");
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 rounded border border-slate-200 whitespace-nowrap text-xs font-medium transition-colors"
            >
              Survey 214/1B Coimbatore (Patta)
            </button>
            <button
              onClick={() => {
                setSearchMode("quick");
                setSearchQuery("88");
                setSelectedRecordId("REC-KA-BLR-03");
              }}
              className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 rounded border border-slate-200 whitespace-nowrap text-xs font-medium transition-colors"
            >
              Survey 88/3 Devanahalli (RTC)
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Matching Parcels List + Right active record viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Matching Parcels List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
              <span>Matching Land Parcels</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-indigo-100 text-indigo-700 font-bold">
                {filteredRecords.length} found
              </span>
            </h2>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredRecords.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 shadow-sm">
                <Search className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">No matching parcels found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Try searching by survey number, district, or owner name.
                </p>
              </div>
            ) : (
              filteredRecords.map((record) => {
                const isSelected = activeRecord?.id === record.id;
                return (
                  <div
                    key={record.id}
                    id={`record-card-${record.id}`}
                    onClick={() => setSelectedRecordId(record.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer text-left select-none relative ${
                      isSelected
                        ? "bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-sm text-slate-900">
                            Survey #{record.surveyKhasraNumber}
                            {record.subdivisionHissaNumber ? `/${record.subdivisionHissaNumber}` : ""}
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                            {record.state}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {record.villageHobli}, {record.talukTehsil}, {record.district}
                        </p>
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                          record.isDisputed
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {record.isDisputed ? "Disputed" : "Clean Title"}
                      </span>
                    </div>

                    {/* Owner summary */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-1 truncate max-w-[190px]">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">
                          {record.owners.map((o) => o.name).join(", ")}
                        </span>
                      </div>
                      <span className="font-bold text-slate-800 shrink-0">
                        {record.totalExtent}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono text-[10px] text-slate-500 truncate">
                        ULPIN: {record.ulpin}
                      </span>
                      <ChevronRight
                        className={`w-4 h-4 transition-transform ${
                          isSelected ? "text-indigo-600 translate-x-1" : "text-slate-300"
                        }`}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Full Record of Rights (RoR) Detailed Viewer */}
        <div className="lg:col-span-8">
          {activeRecord ? (
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              {/* Geometric Header */}
              <div className="bg-white border-b border-slate-200 p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                      {activeRecord.recordFormatName}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Govt of {activeRecord.state}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1.5 tracking-tight">
                    Survey / Khasra #{activeRecord.surveyKhasraNumber}
                    {activeRecord.subdivisionHissaNumber ? `/${activeRecord.subdivisionHissaNumber}` : ""}
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>
                      Village {activeRecord.villageHobli}, Taluka {activeRecord.talukTehsil}, District {activeRecord.district}
                    </span>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    id="view-cadastral-map-btn"
                    onClick={() => onSelectParcelForMap(activeRecord)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>View Map</span>
                  </button>

                  <button
                    id="audit-doc-ocr-btn"
                    onClick={() => onAuditDocForRecord(activeRecord)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold uppercase tracking-wider transition-all border border-slate-200"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Audit Deed</span>
                  </button>

                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded border border-slate-200"
                    title="Print Certified RoR Extract"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ULPIN & Security Banner */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-slate-500">14-Digit Bhu-Aadhaar (ULPIN):</span>
                  <span className="font-mono bg-white px-2.5 py-0.5 rounded border border-slate-200 text-slate-900 font-bold text-xs tracking-wider">
                    {activeRecord.ulpin}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-[11px] font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Digitally Certified: {activeRecord.lastUpdatedDate}</span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-5 sm:p-6 space-y-6">
                {/* 1. Ownership Details (Khatedar) */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Landholder & Ownership Rights (Khatedar Details)</span>
                    </h3>
                    <span className="text-xs text-slate-500">
                      Total Extent: <strong className="text-slate-900 font-bold">{activeRecord.totalExtent}</strong>
                    </span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3">Khatedar Name</th>
                          <th className="p-3">Relationship</th>
                          <th className="p-3">Khata No.</th>
                          <th className="p-3">Share (%)</th>
                          <th className="p-3 text-right">Aadhaar Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {activeRecord.owners.map((owner) => (
                          <tr key={owner.id} className="hover:bg-slate-50/80">
                            <td className="p-3 font-semibold text-slate-900">{owner.name}</td>
                            <td className="p-3 text-slate-500">{owner.relation}</td>
                            <td className="p-3 font-mono text-slate-600">{owner.khataNumber}</td>
                            <td className="p-3 font-bold text-indigo-700">{owner.sharePercentage}%</td>
                            <td className="p-3 text-right">
                              {owner.aadhaarLinked ? (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200 uppercase">
                                  <ShieldCheck className="w-3 h-3" />
                                  Linked
                                </span>
                              ) : (
                                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase border border-amber-200">
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Land Attributes & Classifications */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Land Classification</span>
                    <p className="text-xs font-bold text-slate-900 mt-1">
                      {activeRecord.landClassification}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Soil & Crop Details</span>
                    <p className="text-xs font-bold text-slate-900 mt-1 truncate" title={activeRecord.currentSeasonCrop}>
                      {activeRecord.currentSeasonCrop}
                    </p>
                    <span className="text-[10px] text-slate-500">{activeRecord.soilType}</span>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Irrigation Source</span>
                    <p className="text-xs font-bold text-slate-900 mt-1 truncate">
                      {activeRecord.sourceOfIrrigation}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Govt Guideline Rate</span>
                    <p className="text-xs font-bold text-indigo-700 mt-1">
                      {activeRecord.guidelineMarketValue}
                    </p>
                    <span className="text-[10px] text-slate-500">{activeRecord.readyReckonerRatePerAcre}</span>
                  </div>
                </div>

                {/* 3. Encumbrance & Bank Charges */}
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Encumbrance & Bank Charges (Other Rights / इतर हक्क)</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {activeRecord.encumbrances.length === 0
                        ? "Nil Encumbrance (Clean)"
                        : `${activeRecord.encumbrances.length} Active Charge`}
                    </span>
                  </div>

                  {activeRecord.encumbrances.length === 0 ? (
                    <div className="p-3 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        No registered bank liens, court attachments, or mortgage hypothecations recorded.
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeRecord.encumbrances.map((enc) => (
                        <div
                          key={enc.id}
                          className="p-3 bg-amber-50 rounded border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs"
                        >
                          <div>
                            <span className="font-bold text-amber-950">{enc.institutionName}</span>
                            <p className="text-slate-600 text-[11px] mt-0.5">
                              {enc.loanType} • Ref: {enc.referenceDeedNo} (Registered: {enc.registeredDate})
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-amber-900 text-sm">{enc.amount}</span>
                            <span className="block text-[9px] uppercase font-bold text-amber-700 tracking-wider">
                              Active Bank Lien
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 4. Mutation Ledger & Historical Ferfar Records */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-600" />
                      <span>Certified Mutation Ledger (Ferfar History)</span>
                    </h3>
                    <button
                      onClick={() => onTrackMutationForRecord(activeRecord.surveyKhasraNumber)}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold uppercase tracking-wider flex items-center gap-1"
                    >
                      <span>Track Active Mutation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {activeRecord.mutationHistory.map((mut) => (
                      <div
                        key={mut.id}
                        className="p-3 rounded border border-slate-200 bg-slate-50 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{mut.ferfarNumber}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-indigo-100 text-indigo-800 font-bold uppercase">
                              {mut.type}
                            </span>
                            <span className="text-slate-400 text-[11px]">• {mut.date}</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">{mut.remarks}</p>
                          <p className="text-[10px] text-slate-400">Sanctioned by: {mut.officerDesignation}</p>
                        </div>

                        <span className="self-start sm:self-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {mut.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 5. Boundaries (Four Sides) */}
                <div className="bg-slate-50 p-4 rounded border border-slate-200 text-xs">
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Registered Boundary Demarcations:</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                    <div>
                      <strong className="text-slate-900">North:</strong> {activeRecord.boundaries.north}
                    </div>
                    <div>
                      <strong className="text-slate-900">South:</strong> {activeRecord.boundaries.south}
                    </div>
                    <div>
                      <strong className="text-slate-900">East:</strong> {activeRecord.boundaries.east}
                    </div>
                    <div>
                      <strong className="text-slate-900">West:</strong> {activeRecord.boundaries.west}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Geometric Certificate Modal */}
      {showCertificateModal && activeRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-indigo-600 rounded-sm flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">
                    Digitally Signed Record of Rights Extract
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    Department of Land Resources (DILRMP) Certified Copy
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs space-y-3 font-mono">
              <div className="text-center pb-2 border-b border-slate-200">
                <p className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Government of {activeRecord.state} • Revenue Department
                </p>
                <p className="text-[11px] text-slate-600">{activeRecord.recordFormatName}</p>
                <p className="text-[10px] text-slate-400">ULPIN: {activeRecord.ulpin}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-500">Village:</span> {activeRecord.villageHobli}
                </div>
                <div>
                  <span className="text-slate-500">Taluk:</span> {activeRecord.talukTehsil}
                </div>
                <div>
                  <span className="text-slate-500">District:</span> {activeRecord.district}
                </div>
                <div>
                  <span className="text-slate-500">Survey/Hissa:</span> {activeRecord.surveyKhasraNumber}/{activeRecord.subdivisionHissaNumber}
                </div>
                <div>
                  <span className="text-slate-500">Total Area:</span> {activeRecord.totalExtent}
                </div>
                <div>
                  <span className="text-slate-500">Assessment:</span> {activeRecord.assessmentTaxAnnual}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 font-bold block mb-1">Primary Khatedar(s):</span>
                {activeRecord.owners.map((o) => (
                  <p key={o.id} className="text-slate-800">
                    • {o.name} ({o.relation}) — Share: {o.sharePercentage}% [Khata: {o.khataNumber}]
                  </p>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Security Hash: {activeRecord.digitalSignatureHash}</span>
                <span>Certified: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded uppercase tracking-wider"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded uppercase tracking-wider shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Extract</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
