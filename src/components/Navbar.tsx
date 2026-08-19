import React from "react";
import {
  Search,
  MapPin,
  Sparkles,
  BookOpen,
  GitBranch,
  CheckSquare,
  Bell,
  Globe2,
  CheckCircle,
} from "lucide-react";
import { IndianState } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedState: IndianState | "All";
  setSelectedState: (state: IndianState | "All") => void;
  unreadNotificationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedState,
  setSelectedState,
  unreadNotificationsCount,
}) => {
  const tabs = [
    { id: "search", label: "Search Land Record", icon: Search, badge: "RoR" },
    { id: "map", label: "Cadastral Map", icon: MapPin, badge: "GIS" },
    { id: "ocr", label: "AI Document Scanner", icon: Sparkles, badge: "OCR" },
    { id: "glossary", label: "Legal Glossary", icon: BookOpen, badge: "Terms" },
    { id: "mutation", label: "Mutation Status", icon: GitBranch, badge: "Track" },
    { id: "checklist", label: "Document Checklist", icon: CheckSquare, badge: "Guide" },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Geometric Statistics & Server Status Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-8 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-600">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-200 text-[11px] font-medium text-slate-700 shadow-2xs">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="font-semibold text-slate-800">NIC Server:</span>
            <span>DILRMP Live (97.27% RoR Digitized)</span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>• Cadastral Maps: <strong className="text-indigo-600">97.14%</strong></span>
            <span>• Bhu-Aadhaar: <strong className="text-slate-700">14-Digit ULPIN</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[11px]">
            <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Portal:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as IndianState | "All")}
              className="bg-white border border-slate-200 text-slate-800 rounded px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="All">All States (Pan-India)</option>
              <option value="Maharashtra">Maharashtra (MahaBhumi)</option>
              <option value="Uttar Pradesh">Uttar Pradesh (Bhulekh)</option>
              <option value="Karnataka">Karnataka (Bhoomi)</option>
              <option value="Tamil Nadu">Tamil Nadu (e-Services)</option>
              <option value="Telangana">Telangana (Dharani)</option>
              <option value="Punjab">Punjab (PLRS Jamabandi)</option>
            </select>
          </div>

          <div className="w-7 h-7 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-[10px] select-none">
            IN
          </div>
        </div>
      </div>

      {/* Main App Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Geometric Branding */}
          <div
            onClick={() => setActiveTab("search")}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 bg-indigo-600 rounded-sm flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <div className="w-4 h-4 border-2 border-white rotate-45"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 leading-none">
                BHOOMI<span className="text-indigo-600 underline decoration-2 underline-offset-4">ASSIST</span>
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                Land Record & AI Verification
              </p>
            </div>
          </div>

          {/* Desktop Geometric Tab Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-sm font-bold tracking-tight ${
                        isActive
                          ? "bg-indigo-800 text-indigo-100"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Mobile Right Action Indicator */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setActiveTab("notifications")}
              className="relative p-2 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Tab Navigation */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 border-t border-slate-200 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs whitespace-nowrap font-semibold uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200"
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{tab.label}</span>
                {tab.id === "notifications" && unreadNotificationsCount > 0 && (
                  <span className="bg-indigo-200 text-indigo-900 px-1 rounded-full text-[9px] font-bold">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
