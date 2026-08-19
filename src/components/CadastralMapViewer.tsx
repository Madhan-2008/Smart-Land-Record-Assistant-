import React, { useState } from "react";
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Ruler,
  Info,
  ShieldCheck,
  Building,
  Compass,
  Download,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { LandRecord } from "../types";
import { SAMPLE_LAND_RECORDS } from "../data/landRecords";

interface CadastralMapViewerProps {
  selectedParcelRecord?: LandRecord | null;
  onSelectRecordFromMap: (record: LandRecord) => void;
  onAuditDocForMap: (record: LandRecord) => void;
}

export const CadastralMapViewer: React.FC<CadastralMapViewerProps> = ({
  selectedParcelRecord,
  onSelectRecordFromMap,
  onAuditDocForMap,
}) => {
  const [activeLayer, setActiveLayer] = useState<"classification" | "valuation" | "boundary">("classification");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    selectedParcelRecord?.id || "REC-MH-PUN-01"
  );
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<[number, number][]>([]);
  const [hoveredParcel, setHoveredParcel] = useState<LandRecord | null>(null);

  const activeRecord =
    SAMPLE_LAND_RECORDS.find((r) => r.id === selectedParcelId) ||
    selectedParcelRecord ||
    SAMPLE_LAND_RECORDS[0];

  const getPointsString = (points: [number, number][]) => {
    return points.map(([x, y]) => `${x},${y}`).join(" ");
  };

  const handleSvgClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!measureMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    if (measurePoints.length >= 4) {
      setMeasurePoints([[x, y]]);
    } else {
      setMeasurePoints([...measurePoints, [x, y]]);
    }
  };

  const measuredDistanceMeters = React.useMemo(() => {
    if (measurePoints.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < measurePoints.length - 1; i++) {
      const [x1, y1] = measurePoints[i];
      const [x2, y2] = measurePoints[i + 1];
      const dist = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2) * 0.8;
      total += dist;
    }
    return Math.round(total);
  }, [measurePoints]);

  return (
    <div className="space-y-6">
      {/* Top Geometric Controls Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
              Bhu-Naksha Cadastral GIS Engine
            </h2>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Cadastral Map & Parcel Boundary Explorer
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Digitized village survey grid with high-precision polygonal plot boundaries and guideline valuation layers.
            </p>
          </div>

          {/* Layer and Tool Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center bg-slate-100 p-1 rounded border border-slate-200 text-xs">
              <button
                onClick={() => setActiveLayer("classification")}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeLayer === "classification"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Land Use
              </button>
              <button
                onClick={() => setActiveLayer("valuation")}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeLayer === "valuation"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Valuation Heatmap
              </button>
              <button
                onClick={() => setActiveLayer("boundary")}
                className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeLayer === "boundary"
                    ? "bg-white text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Survey Lines
              </button>
            </div>

            <button
              onClick={() => {
                setMeasureMode(!measureMode);
                setMeasurePoints([]);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all border ${
                measureMode
                  ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-xs"
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{measureMode ? "Ruler Active" : "Measure"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Layout: Left Canvas + Right Property Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Canvas Container */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col relative min-h-[460px] shadow-sm">
            {/* Top-left Zoom Buttons matching design theme */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.2))}
                className="bg-white/90 backdrop-blur p-2 shadow-xs rounded border border-slate-200 text-slate-700 hover:text-indigo-600 transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                className="bg-white/90 backdrop-blur p-2 shadow-xs rounded border border-slate-200 text-slate-700 hover:text-indigo-600 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setMeasurePoints([]);
                }}
                className="bg-white/90 backdrop-blur p-2 shadow-xs rounded border border-slate-200 text-slate-700 hover:text-indigo-600 transition-colors"
                title="Reset View"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Top status indicator */}
            <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded shadow-xs border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500">Bhu-Naksha Grid</span>
            </div>

            {/* Interactive SVG Cadastral Canvas */}
            <div className="flex-1 bg-slate-100 flex items-center justify-center p-4 relative overflow-hidden select-none">
              <svg
                viewBox="0 0 680 460"
                className="w-full h-auto max-h-[440px] transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
                onClick={handleSvgClick}
              >
                {/* Background Roads & Waterways */}
                <path
                  d="M 300 0 Q 315 200 440 460"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="6"
                  strokeOpacity="0.4"
                  strokeDasharray="4 4"
                />
                <text x="350" y="440" fill="#4F46E5" fontSize="10" fontWeight="bold">
                  Canal Channel #3
                </text>

                {/* Village Road */}
                <path
                  d="M 0 255 L 680 265"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="14"
                  strokeOpacity="0.4"
                />
                <path
                  d="M 0 255 L 680 265"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  strokeOpacity="0.8"
                />
                <text x="40" y="252" fill="#475569" fontSize="10" fontWeight="bold">
                  Village Main Approach Road (12m width)
                </text>

                {/* Render Survey Parcels */}
                {SAMPLE_LAND_RECORDS.map((record) => {
                  const parcel = record.cadastralParcel;
                  const isSelected = activeRecord?.id === record.id;
                  const isHovered = hoveredParcel?.id === record.id;

                  let strokeColor = isSelected ? "#4F46E5" : "#4F46E5";
                  let fillColor = isSelected
                    ? "rgba(79, 70, 229, 0.15)"
                    : isHovered
                    ? "rgba(79, 70, 229, 0.08)"
                    : "rgba(255, 255, 255, 0.6)";

                  if (activeLayer === "valuation") {
                    if (parcel.guidelineRatePerSqFt > 300) fillColor = "rgba(239, 68, 68, 0.2)";
                    else if (parcel.guidelineRatePerSqFt > 150) fillColor = "rgba(245, 158, 11, 0.2)";
                    else fillColor = "rgba(16, 185, 129, 0.2)";
                  }

                  return (
                    <g
                      key={record.id}
                      id={`cadastral-parcel-${record.id}`}
                      className="cursor-pointer transition-all"
                      onClick={(e) => {
                        if (!measureMode) {
                          e.stopPropagation();
                          setSelectedParcelId(record.id);
                          onSelectRecordFromMap(record);
                        }
                      }}
                      onMouseEnter={() => setHoveredParcel(record)}
                      onMouseLeave={() => setHoveredParcel(null)}
                    >
                      <polygon
                        points={getPointsString(parcel.polygonPoints)}
                        fill={fillColor}
                        stroke={strokeColor}
                        strokeWidth={isSelected ? 3 : 1.5}
                        strokeDasharray={isSelected ? undefined : "4 4"}
                      />

                      {/* Survey Number Label */}
                      <text
                        x={parcel.centerPoint[0]}
                        y={parcel.centerPoint[1] - 4}
                        fill="#4F46E5"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none font-sans"
                      >
                        Plot {parcel.surveyNumber}
                      </text>

                      {/* Area Label */}
                      <text
                        x={parcel.centerPoint[0]}
                        y={parcel.centerPoint[1] + 11}
                        fill="#64748B"
                        fontSize="9.5"
                        fontWeight="600"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {parcel.areaAcresGuntas}
                      </text>
                    </g>
                  );
                })}

                {/* Measurement ruler points */}
                {measurePoints.map((pt, idx) => (
                  <circle key={idx} cx={pt[0]} cy={pt[1]} r="4" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />
                ))}
                {measurePoints.length >= 2 && (
                  <polyline
                    points={getPointsString(measurePoints)}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                )}
              </svg>

              {/* Bottom Right Floating Geometric Spec Pill */}
              <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg border border-slate-200 flex items-center gap-3">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-tighter">
                  Area: {activeRecord.totalExtent}
                </span>
                <div className="h-4 w-[1px] bg-slate-200"></div>
                <span className="text-xs font-bold uppercase text-indigo-600 tracking-tighter">
                  Village: {activeRecord.villageHobli}
                </span>
              </div>
            </div>
          </div>

          {/* Deep Indigo Legal Dictionary Banner matching Geometric Balance design */}
          <div className="bg-indigo-900 text-white rounded-lg p-5 flex items-center gap-6 shrink-0 shadow-sm">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-indigo-300 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                Cadastral GIS: <span className="text-indigo-300 italic font-serif">Bhu-Naksha / FMB</span>
              </h3>
              <p className="text-xs text-indigo-100/80 leading-relaxed mt-1">
                A digitally geo-referenced spatial parcel map showing exact boundary coordinates (traverse stations) and adjacent village sub-divisions.
              </p>
            </div>
            <button
              onClick={() => onSelectRecordFromMap(activeRecord)}
              className="ml-auto bg-white/20 px-4 py-2 rounded text-xs font-bold uppercase tracking-widest hover:bg-white/30 shrink-0 transition-colors"
            >
              View RoR
            </button>
          </div>
        </div>

        {/* Right Property & Parcel Inspector Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 pb-3">
              <div>
                <h2 className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                  Parcel Specifications
                </h2>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Plot #{activeRecord.cadastralParcel.surveyNumber}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeRecord.villageHobli}, {activeRecord.district}
                </p>
              </div>

              <div className="text-right">
                <span className="text-sm font-bold text-indigo-700 block">
                  {activeRecord.cadastralParcel.areaAcresGuntas}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {activeRecord.cadastralParcel.areaSqMeters.toLocaleString()} sq.m
                </span>
              </div>
            </div>

            {/* Key Field Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Land Classification:</span>
                <strong className="text-slate-900 text-right">
                  {activeRecord.cadastralParcel.classification}
                </strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Recorded Khatedar:</span>
                <span className="font-semibold text-slate-900 text-right">
                  {activeRecord.cadastralParcel.currentOwnerNames.join(", ")}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Guideline Rate:</span>
                <strong className="text-indigo-700">
                  ₹ {activeRecord.cadastralParcel.guidelineRatePerSqFt} / sq.ft
                </strong>
              </div>

              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Road Connectivity:</span>
                <span className="font-medium text-slate-800">
                  {activeRecord.cadastralParcel.roadAccessWidthFeet} Feet Width Road
                </span>
              </div>

              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Dispute & Caveat:</span>
                <span
                  className={`font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm text-[10px] ${
                    activeRecord.cadastralParcel.hasActiveDispute
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  }`}
                >
                  {activeRecord.cadastralParcel.hasActiveDispute ? "Disputed" : "Clean Title"}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => onSelectRecordFromMap(activeRecord)}
                className="w-full py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <span>View Full RoR (7/12 Extract)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onAuditDocForMap(activeRecord)}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-slate-200"
              >
                <span>Audit Property Deed (AI OCR)</span>
              </button>
            </div>
          </div>

          {/* Boundaries card */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 text-xs space-y-2 shadow-sm">
            <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Neighboring Survey Boundaries
            </h4>
            <p className="text-[11px] text-slate-600">
              North: <strong className="text-slate-800">{activeRecord.boundaries.north}</strong>
            </p>
            <p className="text-[11px] text-slate-600">
              South: <strong className="text-slate-800">{activeRecord.boundaries.south}</strong>
            </p>
            <p className="text-[11px] text-slate-600">
              East: <strong className="text-slate-800">{activeRecord.boundaries.east}</strong>
            </p>
            <p className="text-[11px] text-slate-600">
              West: <strong className="text-slate-800">{activeRecord.boundaries.west}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
