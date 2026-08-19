import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { SearchLandRecord } from "./components/SearchLandRecord";
import { CadastralMapViewer } from "./components/CadastralMapViewer";
import { AiDocumentOcr } from "./components/AiDocumentOcr";
import { LegalGlossary } from "./components/LegalGlossary";
import { MutationTracker } from "./components/MutationTracker";
import { DocumentChecklist } from "./components/DocumentChecklist";
import { NotificationsHub } from "./components/NotificationsHub";
import { LandRecord, IndianState, LandNotification } from "./types";
import { SAMPLE_LAND_RECORDS } from "./data/landRecords";
import { INITIAL_NOTIFICATIONS } from "./data/documentChecklists";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("search");
  const [selectedState, setSelectedState] = useState<IndianState | "All">("All");

  // Cross-component state bridges
  const [selectedParcelForMap, setSelectedParcelForMap] = useState<LandRecord | null>(
    SAMPLE_LAND_RECORDS[0]
  );
  const [preselectedRecordForOcr, setPreselectedRecordForOcr] = useState<LandRecord | null>(
    SAMPLE_LAND_RECORDS[0]
  );
  const [mutationSearchSurvey, setMutationSearchSurvey] = useState<string>("");

  // Notification management
  const [notifications, setNotifications] = useState<LandNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleAddNotification = (newNotif: LandNotification) => {
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Navigations from Search
  const handleSelectParcelForMap = (parcel: LandRecord) => {
    setSelectedParcelForMap(parcel);
    setActiveTab("map");
  };

  const handleAuditDocForRecord = (record: LandRecord) => {
    setPreselectedRecordForOcr(record);
    setActiveTab("ocr");
  };

  const handleTrackMutationForRecord = (surveyNo: string) => {
    setMutationSearchSurvey(surveyNo);
    setActiveTab("mutation");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      {/* Top Geometric Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedState={selectedState}
        setSelectedState={setSelectedState}
        unreadNotificationsCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {activeTab === "search" && (
          <SearchLandRecord
            selectedStateFilter={selectedState}
            onSelectParcelForMap={handleSelectParcelForMap}
            onAuditDocForRecord={handleAuditDocForRecord}
            onTrackMutationForRecord={handleTrackMutationForRecord}
          />
        )}

        {activeTab === "map" && (
          <CadastralMapViewer
            selectedParcelRecord={selectedParcelForMap}
            onSelectRecordFromMap={(record) => {
              setSelectedParcelForMap(record);
              setActiveTab("search");
            }}
            onAuditDocForMap={handleAuditDocForRecord}
          />
        )}

        {activeTab === "ocr" && (
          <AiDocumentOcr
            onTransferToSearch={(survey) => {
              setActiveTab("search");
            }}
            onTransferToMutation={(extracted) => {
              if (extracted.surveyNumber) {
                setMutationSearchSurvey(extracted.surveyNumber);
              }
              setActiveTab("mutation");
            }}
            preselectedRecord={preselectedRecordForOcr}
          />
        )}

        {activeTab === "glossary" && <LegalGlossary />}

        {activeTab === "mutation" && (
          <MutationTracker initialSearchSurvey={mutationSearchSurvey} />
        )}

        {activeTab === "checklist" && <DocumentChecklist />}

        {activeTab === "notifications" && (
          <NotificationsHub
            notifications={notifications}
            onMarkAsRead={handleMarkAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onAddNotification={handleAddNotification}
          />
        )}
      </main>

      {/* Geometric Balance Clean Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 bg-indigo-600 rounded-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 border border-white rotate-45"></div>
            </div>
            <span className="font-bold text-slate-800 tracking-tight">
              BHOOMI<span className="text-indigo-600 underline decoration-2 underline-offset-4">ASSIST</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500">Digital India Land Records Modernization Programme (DILRMP)</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>14-Digit ULPIN Standard</span>
            <span className="text-slate-300">•</span>
            <span>NIC Revenue Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
