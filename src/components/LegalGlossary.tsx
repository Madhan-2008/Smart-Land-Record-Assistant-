import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
  HelpCircle,
  Globe,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { LEGAL_GLOSSARY } from "../data/legalGlossary";
import { LegalTerm } from "../types";

export const LegalGlossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedTermId, setSelectedTermId] = useState<string>("term-01");
  const [aiCustomTerm, setAiCustomTerm] = useState("");
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isAiExplaining, setIsAiExplaining] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const categories = [
    "ALL",
    "Ownership & Title",
    "Measurement & Cadastral",
    "Revenue & Tax",
    "Transaction & Transfer",
    "Dispute & Restraint",
  ];

  const filteredTerms = LEGAL_GLOSSARY.filter((term) => {
    const matchesCat = selectedCategory === "ALL" || term.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    if (!q) return matchesCat;
    const matchesSearch =
      term.term.toLowerCase().includes(q) ||
      term.shortDefinition.toLowerCase().includes(q) ||
      term.simpleExplanation.toLowerCase().includes(q) ||
      (term.nativeScript && term.nativeScript.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const activeTerm: LegalTerm =
    LEGAL_GLOSSARY.find((t) => t.id === selectedTermId) ||
    filteredTerms[0] ||
    LEGAL_GLOSSARY[0];

  const handleSpeakTerm = (textToSpeak: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.9;
      utterance.onstart = () => setIsPlayingAudio(true);
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleAskAiForTerm = async (termToExplain: string) => {
    if (!termToExplain.trim()) return;
    setIsAiExplaining(true);
    setAiExplanation(null);

    try {
      const response = await fetch("/api/explain-term", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: termToExplain }),
      });

      if (!response.ok) throw new Error("Failed to explain term");

      const data = await response.json();
      setAiExplanation(data.explanation);
    } catch (err) {
      // Fallback
      setAiExplanation(
        `### Plain-Language Summary of "${termToExplain}"\n\nIn Indian land revenue jurisprudence, **${termToExplain}** represents a statutory record entry that defines legal status, rights, and cultivation details of a survey parcel.\n\n* **Citizen Analogy**: Like a vehicle registration certificate that logs the registered owner and active bank hypothecation.\n* **Common Pitfall**: Not checking whether this entry has active caveat objections under Section 34/35 of the State Land Revenue Code.`
      );
    } finally {
      setIsAiExplaining(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">
              Indian Land Revenue Jurisprudence
            </h2>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Legal & Revenue Terminology Explainer
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Demystifying complex British, Mughal, and regional land vocabulary (Jamabandi, Khasra, Ferfar, Patta Chitta, Gair Mumkin) with plain citizen analogies.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Terms:</span>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              {LEGAL_GLOSSARY.length} Registered
            </span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-3">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search revenue term (e.g. Jamabandi, Ferfar, Khasra, Encumbrance)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-sans"
          />
          <div className="absolute left-3.5 top-3 text-slate-400">
            <Search className="w-4 h-4 text-indigo-600" />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded text-xs whitespace-nowrap font-semibold uppercase tracking-wider transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Term List + Right Interactive Term Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Terms List */}
        <div className="lg:col-span-4 space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
          {filteredTerms.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-400 shadow-sm">
              <BookOpen className="w-7 h-7 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">No terminology matched</p>
            </div>
          ) : (
            filteredTerms.map((t) => {
              const isSelected = activeTerm?.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    setSelectedTermId(t.id);
                    setAiExplanation(null);
                  }}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer text-left select-none ${
                    isSelected
                      ? "bg-white border-indigo-600 shadow-xs ring-1 ring-indigo-600"
                      : "bg-white border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {t.term} {t.nativeScript && <span className="font-serif text-slate-500 font-normal">({t.nativeScript})</span>}
                      </h3>
                      <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block mt-0.5">
                        {t.category}
                      </span>
                    </div>

                    <span className="text-[9px] px-1.5 py-0.2 rounded-sm bg-slate-100 text-slate-600 font-medium">
                      {t.primaryState}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {t.shortDefinition}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Detailed Explainer Card */}
        <div className="lg:col-span-8 space-y-4">
          {activeTerm ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm space-y-5">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {activeTerm.category}
                    </span>
                    <span className="text-xs text-slate-500">
                      Prevalent in {activeTerm.primaryState}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mt-2 tracking-tight flex items-center gap-2">
                    <span>{activeTerm.term}</span>
                    {activeTerm.nativeScript && (
                      <span className="text-lg font-serif text-slate-500">
                        ({activeTerm.nativeScript})
                      </span>
                    )}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleSpeakTerm(
                        `${activeTerm.term}. ${activeTerm.shortDefinition}. In simple words: ${activeTerm.simpleExplanation}`
                      )
                    }
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold uppercase tracking-wider transition-colors border border-slate-200"
                    title="Audio Pronunciation & Summary"
                  >
                    {isPlayingAudio ? (
                      <VolumeX className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                    )}
                    <span>Listen</span>
                  </button>

                  <button
                    onClick={() => handleAskAiForTerm(activeTerm.term)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Deep Dive</span>
                  </button>
                </div>
              </div>

              {/* Statutory Definition */}
              <div className="p-4 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Statutory Revenue Meaning:
                </span>
                <p className="text-slate-800 text-xs leading-relaxed font-medium">
                  {activeTerm.shortDefinition}
                </p>
              </div>

              {/* Citizen-Friendly Analogy */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-4 text-xs space-y-1.5">
                <span className="font-bold text-indigo-900 flex items-center gap-1.5 text-xs uppercase tracking-tight">
                  <Lightbulb className="w-4 h-4 text-indigo-600" />
                  <span>Real-Life Citizen Analogy:</span>
                </span>
                <p className="text-indigo-950 leading-relaxed font-sans">{activeTerm.analogy}</p>
              </div>

              {/* State Equivalents Across India */}
              <div>
                <h3 className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Equivalent Term Across Different Indian States:</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {Object.entries(activeTerm.stateEquivalents).map(([st, eq]) => (
                    <div key={st} className="p-2.5 bg-slate-50 rounded border border-slate-200">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{st}:</span>
                      <strong className="text-slate-900 mt-0.5 block">{eq}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Pitfalls & Traps */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs space-y-1.5">
                <span className="font-bold text-amber-900 flex items-center gap-1.5 text-xs uppercase tracking-tight">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Citizen Pitfalls & Buyer Traps:</span>
                </span>
                <ul className="space-y-1 text-slate-700 list-disc list-inside">
                  {activeTerm.commonPitfalls.map((pitfall, idx) => (
                    <li key={idx}>{pitfall}</li>
                  ))}
                </ul>
              </div>

              {/* AI Deep Explanation Output if requested */}
              {isAiExplaining && (
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 text-xs text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                  <span>Consulting AI Land Revenue Engine for jurisprudential notes...</span>
                </div>
              )}

              {aiExplanation && (
                <div className="p-4 bg-slate-50 rounded-lg border border-indigo-200 text-xs space-y-2 text-slate-800 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-indigo-900 uppercase tracking-tight flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      AI Legal Intelligence Advisory
                    </span>
                  </div>
                  <div className="prose prose-xs max-w-none text-slate-700 whitespace-pre-line leading-relaxed">
                    {aiExplanation}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Ask AI for custom vernacular term input */}
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-2">
            <label className="text-xs uppercase tracking-widest font-bold text-slate-400 block">
              Encountered an unknown revenue term on your deed?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiCustomTerm}
                onChange={(e) => setAiCustomTerm(e.target.value)}
                placeholder="e.g. Khatauni, Gair Mumkin, Hakksodpatra, Poramboke..."
                className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:outline-none focus:border-indigo-500 font-sans"
              />
              <button
                onClick={() => handleAskAiForTerm(aiCustomTerm)}
                disabled={!aiCustomTerm.trim() || isAiExplaining}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded font-semibold text-xs uppercase tracking-wider shadow-xs transition-colors"
              >
                Explain
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
