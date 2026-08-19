import React, { useState } from "react";
import {
  CheckSquare,
  FileText,
  AlertTriangle,
  Download,
  CheckCircle2,
  ShieldCheck,
  Building,
  Info,
  DollarSign,
  Printer,
  Clock,
  BookOpen,
  Check,
} from "lucide-react";
import { TRANSACTION_SCENARIOS } from "../data/documentChecklists";
import { TransactionScenario } from "../types";

export const DocumentChecklist: React.FC = () => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>("scen-sale-agri");
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const activeScenario: TransactionScenario =
    TRANSACTION_SCENARIOS.find((s) => s.id === selectedScenarioId) ||
    TRANSACTION_SCENARIOS[0];

  const toggleItem = (itemId: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const totalRequired = activeScenario.items.filter((i) => i.isMandatory).length;
  const completedRequired = activeScenario.items.filter(
    (i) => i.isMandatory && checkedItems[i.id]
  ).length;
  const progressPercent = Math.round((completedRequired / (totalRequired || 1)) * 100);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
              Sub-Registrar & Revenue Compliance
            </h2>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Land Document Checklist & Registration Verification
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Ensure you never face rejection at the Sub-Registrar Office (SRO) or Tehsildar Court. Customized checklists with required affidavits, Stamp Duty rules, and citizen precautions.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-xs font-semibold uppercase tracking-wider border border-slate-200 transition-all self-start md:self-auto shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-indigo-600" />
            <span>Print Checklist</span>
          </button>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TRANSACTION_SCENARIOS.map((scen) => {
          const isSelected = activeScenario.id === scen.id;
          return (
            <div
              key={scen.id}
              onClick={() => {
                setSelectedScenarioId(scen.id);
                setCheckedItems({});
              }}
              className={`p-4 rounded-lg border transition-all cursor-pointer select-none text-left ${
                isSelected
                  ? "bg-white border-indigo-600 shadow-xs ring-1 ring-indigo-600"
                  : "bg-white border-slate-200 hover:bg-slate-50"
              }`}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-sm border border-indigo-200">
                {scen.estimatedTimeline}
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-2">{scen.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{scen.tagline}</p>
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>{scen.items.length} Documents</span>
                <span className="font-semibold text-slate-900">
                  {scen.statutoryFee}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Checklist Card */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm space-y-6">
        {/* Progress header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{activeScenario.title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{activeScenario.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Mandatory Ready:</span>
              <strong className="text-sm text-indigo-700 font-bold">
                {completedRequired} of {totalRequired} documents
              </strong>
            </div>
            <div className="w-10 h-10 rounded-full border-2 border-indigo-600 flex items-center justify-center font-bold text-xs text-indigo-700">
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>

        {/* Stamp Duty & Statutory Rules Summary Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Stamp Duty & Reg. Fee</span>
            <p className="font-bold text-slate-900 text-xs mt-1">
              {activeScenario.averageStampDutyPercent}
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Statutory Revenue Fees</span>
            <p className="font-bold text-slate-900 text-xs mt-1">
              {activeScenario.statutoryFee}
            </p>
          </div>
          <div className="bg-slate-50 p-3.5 rounded border border-slate-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Governing Statutory Acts</span>
            <p className="font-bold text-indigo-700 text-xs mt-1 truncate" title={activeScenario.keyActs.join(", ")}>
              {activeScenario.keyActs.join(" • ")}
            </p>
          </div>
        </div>

        {/* Interactive Checkbox Items with Geometric Box Styling */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>Essential Documents Checklist</span>
          </h3>

          <div className="space-y-2">
            {activeScenario.items.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked
                      ? "bg-slate-50 border-indigo-300"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {/* Geometric Checkbox from Design HTML */}
                  <div
                    className={`w-4 h-4 mt-0.5 shrink-0 rounded-sm flex items-center justify-center transition-colors ${
                      isChecked
                        ? "border border-emerald-500 bg-emerald-50 text-emerald-600"
                        : "border border-slate-300 bg-white"
                    }`}
                  >
                    {isChecked && <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />}
                  </div>

                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className={`font-bold text-xs ${isChecked ? "text-slate-900 line-through text-slate-400" : "text-slate-900"}`}>
                        {item.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {item.validityPeriod && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-600 font-semibold font-mono">
                            {item.validityPeriod}
                          </span>
                        )}
                        {item.isMandatory ? (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-red-50 text-red-700 font-bold uppercase border border-red-200">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-600 font-medium border border-slate-200">
                            Optional / NOC
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs">{item.description}</p>
                    <p className="text-[11px] text-slate-400">
                      <strong>Issuing Authority:</strong> {item.issuingAuthority}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Citizen Precautions Notice Card */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs space-y-1.5 text-amber-950">
          <span className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-tight">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Essential Citizen Precautions & Safety Tips:</span>
          </span>
          <ul className="space-y-1 text-slate-700 list-disc list-inside">
            {activeScenario.precautions.map((precaution, idx) => (
              <li key={idx}>{precaution}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
