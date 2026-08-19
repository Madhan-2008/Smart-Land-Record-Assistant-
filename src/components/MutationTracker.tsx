import React, { useState } from "react";
import {
  GitBranch,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  FileText,
  User,
  Phone,
  Building,
  Calendar,
  ChevronRight,
  ShieldAlert,
  Send,
  PlusCircle,
  Search,
  Check,
} from "lucide-react";
import { SAMPLE_MUTATION_APPLICATIONS } from "../data/mutationTemplates";
import { MutationApplication, MutationStage } from "../types";

interface MutationTrackerProps {
  initialSearchSurvey?: string;
}

export const MutationTracker: React.FC<MutationTrackerProps> = ({
  initialSearchSurvey = "",
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>("MUT-APP-2025-0811");
  const [searchFilter, setSearchFilter] = useState<string>(initialSearchSurvey);
  const [showObjectionModal, setShowObjectionModal] = useState(false);
  const [objectorName, setObjectorName] = useState("");
  const [objectionGround, setObjectionGround] = useState("");
  const [objectionSubmitted, setObjectionSubmitted] = useState(false);

  const filteredApps = SAMPLE_MUTATION_APPLICATIONS.filter((app) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase().trim();
    return (
      app.applicationNumber.toLowerCase().includes(q) ||
      app.surveyNumber.toLowerCase().includes(q) ||
      app.applicantName.toLowerCase().includes(q) ||
      app.village.toLowerCase().includes(q)
    );
  });

  const activeApp: MutationApplication =
    SAMPLE_MUTATION_APPLICATIONS.find((a) => a.id === selectedAppId) ||
    filteredApps[0] ||
    SAMPLE_MUTATION_APPLICATIONS[0];

  const handleFileObjection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objectorName || !objectionGround) return;
    setObjectionSubmitted(true);
    setTimeout(() => {
      setShowObjectionModal(false);
      setObjectionSubmitted(false);
      setObjectorName("");
      setObjectionGround("");
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
              Revenue Court Workflow Engine
            </h2>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Mutation Status Tracker (Dakhil Kharij / Ferfar / Namantaran)
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Live tracking from Talathi/Patwari field inspection to Circle Officer certification and 30-day public objection notices.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search Case # or Survey (e.g. 142/2A)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-sans"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Application List on Left + Timeline Progress on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Applications List */}
        <div className="lg:col-span-4 space-y-3">
          <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 px-1">
            Active Mutation Cases ({filteredApps.length})
          </h2>

          <div className="space-y-2.5 max-h-[660px] overflow-y-auto pr-1">
            {filteredApps.map((app) => {
              const isSelected = activeApp.id === app.id;
              return (
                <div
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`p-4 rounded-lg border transition-all cursor-pointer text-left select-none ${
                    isSelected
                      ? "bg-white border-indigo-600 shadow-sm ring-1 ring-indigo-600"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <span className="font-bold text-sm text-slate-900 block font-mono">
                        {app.applicationNumber}
                      </span>
                      <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block mt-0.5">
                        {app.mutationType}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-slate-100 text-slate-700 border border-slate-200">
                      {app.stageProgressPercent}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2">
                    Survey #{app.surveyNumber} • {app.village}, {app.district}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Applicant: <strong className="text-slate-700">{app.applicantName}</strong></span>
                    <span className="text-slate-400">{app.appliedDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Timeline Progress */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm space-y-6">
            {/* Header with Case Info */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                  {activeApp.applicationNumber}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-1.5 tracking-tight">
                  {activeApp.mutationType} — Survey #{activeApp.surveyNumber}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Village {activeApp.village}, Taluka {activeApp.taluk}, {activeApp.district} ({activeApp.state})
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">Estimated Completion:</span>
                <strong className="text-sm text-slate-900 font-bold">{activeApp.expectedCompletionDate}</strong>
              </div>
            </div>

            {/* Geometric Progress Bar matching design theme */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                  Current Status: {activeApp.currentStage.replace(/_/g, " ")}
                </span>
                <span className="font-bold text-indigo-700">{activeApp.stageProgressPercent}% Complete</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-500 rounded-full"
                  style={{ width: `${activeApp.stageProgressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* 30-Day Mandatory Objection Notice Countdown Box */}
            {activeApp.daysRemainingInPublicNotice > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-900 uppercase tracking-tight block">
                      30-Day Public Notice & Objection Window Active
                    </span>
                    <p className="text-amber-800 text-[11px] mt-0.5">
                      Statutory Form-IX proclamation displayed at Gram Panchayat. Any caveat dispute must be filed before window expires.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <div className="text-center bg-white px-3 py-1.5 rounded border border-amber-200">
                    <span className="text-base font-bold text-amber-900 block leading-tight">
                      {activeApp.daysRemainingInPublicNotice}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Days Left</span>
                  </div>

                  <button
                    onClick={() => setShowObjectionModal(true)}
                    className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    File Caveat / Objection
                  </button>
                </div>
              </div>
            )}

            {/* Timeline Milestones matching Geometric Balance design snippet */}
            <div>
              <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-4">
                Statutory Revenue Milestones
              </h3>

              <div className="space-y-0">
                {activeApp.stagesTimeline.map((milestone, idx) => {
                  return (
                    <div
                      key={idx}
                      className="relative pl-8 pb-5 border-l border-indigo-200 last:border-0 last:pb-0 text-xs"
                    >
                      {/* Geometric Node Circle */}
                      <div
                        className={`absolute -left-2 top-0 w-4 h-4 rounded-full border-4 border-white shadow-xs ${
                          milestone.completed ? "bg-indigo-600" : "bg-slate-300"
                        }`}
                      ></div>

                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <h4
                          className={`text-xs font-bold ${
                            milestone.completed ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {milestone.title}
                        </h4>
                        {milestone.date && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {milestone.date}
                          </span>
                        )}
                      </div>

                      <p className="text-slate-600 text-xs mt-1 leading-relaxed">{milestone.notes}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Officer Contact & Fees Summary Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Assigned Revenue Officer:
                </span>
                <strong className="text-slate-900 block">{activeApp.assignedOfficer.name}</strong>
                <p className="text-[11px] text-slate-600">
                  {activeApp.assignedOfficer.designation} • {activeApp.assignedOfficer.office}
                </p>
                <div className="flex items-center gap-1 text-[11px] text-indigo-700 font-mono pt-1">
                  <Phone className="w-3 h-3" />
                  <span>{activeApp.assignedOfficer.contactNumber}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Statutory Revenue Fees:
                </span>
                <strong className="text-emerald-800 text-sm block">{activeApp.feesPaidAmount} Paid</strong>
                <p className="text-[11px] text-slate-600 font-mono">
                  Receipt: {activeApp.paymentReceiptNumber}
                </p>
                <p className="text-[10px] text-slate-400">Paid via MahaBhumi GRAS Portal</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* File Objection Modal */}
      {showObjectionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 space-y-4 shadow-xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2 text-rose-700">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight">
                  File Form-VIII Mutation Objection / Caveat
                </h3>
              </div>
              <button
                onClick={() => setShowObjectionModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {objectionSubmitted ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 rounded border border-emerald-200">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-950">
                  Caveat Objection Form Lodged
                </h4>
                <p className="text-xs text-emerald-800">
                  Case Ref: CAV-{Date.now().toString().slice(-6)}. Hearing notice will be dispatched to both parties within 7 working days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFileObjection} className="space-y-3">
                <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Against Case:</span>
                  <span className="font-mono text-slate-900 font-bold">{activeApp.applicationNumber}</span>
                  <p className="text-[11px] text-slate-600">Survey #{activeApp.surveyNumber} • {activeApp.village}</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Objector / Claimant Full Name:</label>
                  <input
                    type="text"
                    required
                    value={objectorName}
                    onChange={(e) => setObjectorName(e.target.value)}
                    placeholder="e.g. Smt. Sunita Dnyaneshwar Shinde"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Grounds of Legal Objection:</label>
                  <textarea
                    required
                    rows={3}
                    value={objectionGround}
                    onChange={(e) => setObjectionGround(e.target.value)}
                    placeholder="State reason (e.g. Unpartitioned ancestral co-parcenary share, pending civil suit O.S. 142/2024, forged signature)..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded text-slate-800 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowObjectionModal(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded font-semibold text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold text-xs uppercase tracking-wider shadow-xs"
                  >
                    Submit Objection
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
