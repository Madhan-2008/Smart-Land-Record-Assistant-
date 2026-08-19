import React, { useState } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Smartphone,
  Mail,
  MessageSquare,
  Plus,
  Trash2,
  Sparkles,
  Search,
  Check,
} from "lucide-react";
import { LandNotification } from "../types";

interface NotificationsHubProps {
  notifications: LandNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onAddNotification: (notification: LandNotification) => void;
}

export const NotificationsHub: React.FC<NotificationsHubProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onAddNotification,
}) => {
  const [filterType, setFilterType] = useState<string>("ALL");
  const [watchSurvey, setWatchSurvey] = useState("");
  const [watchList, setWatchList] = useState<string[]>([
    "Survey #142/2A Wagholi (Pune)",
    "Khasra #389 Banthra (Lucknow)",
  ]);
  const [watchAdded, setWatchAdded] = useState(false);

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "ALL") return true;
    if (filterType === "UNREAD") return !n.read;
    return n.type === filterType;
  });

  const handleAddWatchParcel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!watchSurvey.trim()) return;

    setWatchList([...watchList, watchSurvey.trim()]);
    setWatchSurvey("");
    setWatchAdded(true);
    setTimeout(() => setWatchAdded(false), 2000);
  };

  const handleSimulateAlert = (type: "SANCTION" | "OBJECTION") => {
    if (type === "SANCTION") {
      const newNotif: LandNotification = {
        id: `notif-${Date.now()}`,
        type: "MUTATION_UPDATE",
        title: "Ferfar Sanctioned & Digitally Signed",
        message: "Tehsildar Haveli has sanctioned Mutation 4519. RoR (7/12) is now updated with your name.",
        date: "Just now",
        read: false,
        actionUrlTab: "search",
        surveyNumber: "142/2A",
        applicationId: "MUT-APP-2025-0811",
      };
      onAddNotification(newNotif);
    } else {
      const newNotif: LandNotification = {
        id: `notif-${Date.now()}`,
        type: "OBJECTION_NOTICE",
        title: "SURVEY WATCHDOG: Caveat Registered on Plot",
        message: "Notice: An objection claim was registered against Survey #142/2A Wagholi. Review hearing notice.",
        date: "Just now",
        read: false,
        actionUrlTab: "mutation",
        surveyNumber: "142/2A",
        applicationId: "MUT-APP-2025-0811",
      };
      onAddNotification(newNotif);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
              Multi-Channel Alert & Fraud Prevention
            </h2>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Application Status Notifications & Survey Watchdog
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Receive automatic multi-channel updates on your land mutation milestones and protect your family parcels against unauthorized tampering.
            </p>
          </div>

          <button
            onClick={onMarkAllAsRead}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold uppercase tracking-wider border border-slate-200 transition-colors self-start md:self-auto"
          >
            Mark All as Read
          </button>
        </div>
      </div>

      {/* Grid: Left Survey Watchdog Shield + Right Notification Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Citizen Survey Watchdog */}
        <div className="lg:col-span-5 space-y-4">
          {/* Survey Watchdog Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Land Survey Watchdog Protection
                </h3>
                <p className="text-[11px] text-slate-500">
                  Instant alerts if any mutation or caveat is filed on your survey
                </p>
              </div>
            </div>

            <form onSubmit={handleAddWatchParcel} className="space-y-2 text-xs">
              <label className="block font-bold text-slate-700">Add Parcel to Watchdog:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={watchSurvey}
                  onChange={(e) => setWatchSurvey(e.target.value)}
                  placeholder="e.g. Survey 88/3 Devanahalli"
                  className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded focus:border-indigo-500 text-xs focus:outline-none text-slate-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs uppercase tracking-wider flex items-center gap-1 shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Protect</span>
                </button>
              </div>
            </form>

            {watchAdded && (
              <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Survey added to 24/7 Watchdog alert monitor!</span>
              </p>
            )}

            {/* Currently Protected Parcels */}
            <div className="space-y-1.5 pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Monitored Parcels ({watchList.length}):
              </span>
              <div className="space-y-1.5">
                {watchList.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800">{item}</span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-sm border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Alert Simulator */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs space-y-3">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Simulate Citizen Notifications</span>
            </span>
            <p className="text-slate-500 text-[11px]">
              Trigger instant simulated alerts across SMS, WhatsApp, and RoR feeds.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSimulateAlert("SANCTION")}
                className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold text-xs uppercase tracking-wider shadow-xs transition-colors text-center"
              >
                + Sanction Alert
              </button>
              <button
                onClick={() => handleSimulateAlert("OBJECTION")}
                className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold text-xs uppercase tracking-wider shadow-xs transition-colors text-center"
              >
                + Caveat Alert
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Notification Stream */}
        <div className="lg:col-span-7 space-y-3">
          {/* Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded font-semibold uppercase tracking-wider transition-all ${
                filterType === "ALL"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              All Alerts
            </button>
            <button
              onClick={() => setFilterType("UNREAD")}
              className={`px-3 py-1.5 rounded font-semibold uppercase tracking-wider transition-all ${
                filterType === "UNREAD"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilterType("MUTATION_UPDATE")}
              className={`px-3 py-1.5 rounded font-semibold uppercase tracking-wider transition-all ${
                filterType === "MUTATION_UPDATE"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Mutation Updates
            </button>
            <button
              onClick={() => setFilterType("OBJECTION_NOTICE")}
              className={`px-3 py-1.5 rounded font-semibold uppercase tracking-wider transition-all ${
                filterType === "OBJECTION_NOTICE"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Objection Notices
            </button>
            <button
              onClick={() => setFilterType("SURVEY_ALERT")}
              className={`px-3 py-1.5 rounded font-semibold uppercase tracking-wider transition-all ${
                filterType === "SURVEY_ALERT"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              Watchdog Alerts
            </button>
          </div>

          {/* List matching Geometric Balance Notice Card pattern */}
          <div className="space-y-2.5">
            {filteredNotifications.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-500 shadow-sm">
                <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-bold text-slate-700 text-xs uppercase tracking-wider">No notifications in this view</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => onMarkAsRead(notif.id)}
                  className={`bg-white border border-slate-200 rounded-lg p-4 flex items-center justify-between transition-all cursor-pointer shadow-sm text-xs ${
                    !notif.read ? "border-indigo-500 ring-1 ring-indigo-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded shrink-0 flex items-center justify-center ${
                        notif.type === "MUTATION_UPDATE"
                          ? "bg-emerald-100 text-emerald-700"
                          : notif.type === "OBJECTION_NOTICE"
                          ? "bg-red-100 text-red-600"
                          : notif.type === "SURVEY_ALERT"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {notif.type === "OBJECTION_NOTICE" ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : notif.type === "MUTATION_UPDATE" ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <ShieldCheck className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-800">{notif.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{notif.message}</p>
                      {notif.applicationId && (
                        <span className="text-[10px] text-indigo-600 font-mono block mt-0.5">
                          Ref: {notif.applicationId} • Survey #{notif.surveyNumber}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0 ml-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">
                      {notif.date}
                    </span>
                    {!notif.read && (
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-600 mt-1"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
