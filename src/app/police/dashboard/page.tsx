"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  FileText,
  Upload,
  Search,
  Check,
  Plus,
  BookOpen,
  Volume2,
  Clock,
  ArrowRight,
  LogOut,
  AlertCircle,
  FolderLock,
  Camera,
  RefreshCw,
  Award,
  CheckCircle
} from "lucide-react";
import { apiSuggestBns } from "@/utils/api";
import AssistantSidebar from "@/components/assistant-sidebar";
import TiltCard from "@/components/tilt-card";
import RippleWrapper from "@/components/ripple-wrapper";

interface FirRecord {
  id: string;
  station: string;
  complainant: string;
  crimeType: string;
  date: string;
  description: string;
  mappedBns: string[];
  evidenceCount: number;
  status: string;
}

export default function PolicePortal() {
  const [activeTab, setActiveTab] = useState("fir-list");
  const [selectedFirId, setSelectedFirId] = useState("FIR-1021-PUN");
  const [incidentText, setIncidentText] = useState("");
  const [analyzingBns, setAnalyzingBns] = useState(false);
  const [bnsSuggestions, setBnsSuggestions] = useState<any[]>([]);
  const [selectedBnsSections, setSelectedBnsSections] = useState<string[]>([]);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [officerConfirmed, setOfficerConfirmed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  // Mock FIR records
  const mockFirs: FirRecord[] = [
    {
      id: "FIR-1021-PUN",
      station: "Kothrud Police Station, Pune",
      complainant: "Sanjay Deshmukh",
      crimeType: "House Break-in / Theft",
      date: "Jul 17, 2026",
      description:
        "The complainant reported that on the night of July 16, lock of the front door was broken. Gold ornaments weighing 50g and Rs. 20,000 cash were stolen. Found window grilles tampered.",
      mappedBns: ["Section 305 BNS (Theft in dwelling house)", "Section 331(3) BNS (House-breaking)"],
      evidenceCount: 3,
      status: "Charge Sheet Pending Officer Verification",
    },
    {
      id: "FIR-1092-PUN",
      station: "Shivajinagar Police Station, Pune",
      complainant: "Nikhil Joshi",
      crimeType: "Cyber Theft / phishing",
      date: "Jul 15, 2026",
      description:
        "Phishing scam involving credit card credential cloning. Complainant lost Rs. 1,50,000 via digital gateway transactions, following a spoofed OTP call.",
      mappedBns: ["Section 318 BNS (Cheating)", "Section 66D IT Act"],
      evidenceCount: 2,
      status: "Forwarded to Cyber Registry",
    },
  ];

  const selectedFir = mockFirs.find((f) => f.id === selectedFirId) || mockFirs[0];

  const handleBnsAnalysis = async () => {
    setAnalyzingBns(true);
    try {
      const res = await apiSuggestBns(incidentText);
      if (res.success) {
        setBnsSuggestions(res.suggestions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingBns(false);
    }
  };

  const handleToggleBns = (section: string) => {
    if (selectedBnsSections.includes(section)) {
      setSelectedBnsSections(selectedBnsSections.filter((s) => s !== section));
    } else {
      setSelectedBnsSections([...selectedBnsSections, section]);
    }
  };

  const handleUploadEvidence = () => {
    setUploadingEvidence(true);
    setTimeout(() => {
      setUploadingEvidence(false);
      setEvidenceFiles([
        "evidence_door_lock_broken.jpg",
        "fingerprint_scan_report.pdf",
        "cctv_footage_clipping_10sec.mp4",
      ]);
    }, 1800);
  };

  const handleConfirmFiling = () => {
    setActionLoading(true);
    setTimeout(() => {
      setActionLoading(false);
      setOfficerConfirmed(true);
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-805 dark:text-slate-100 text-xs sm:text-sm">
      
      {/* AI Assistant Sidebar */}
      <AssistantSidebar role="police" />

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white/40 dark:bg-slate-900/30 border-r border-black/5 dark:border-white/5 flex flex-col justify-between shrink-0 p-4 backdrop-blur-2xl">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 pb-4 border-b border-black/5 dark:border-white/5">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="w-7 h-7 rounded bg-gradient-to-tr from-yellow-600 to-emerald-600 flex items-center justify-center font-bold text-white text-xs shadow-lg"
            >
              NF
            </motion.div>
            <span className="font-bold tracking-wider text-slate-800 dark:text-slate-100">
              NYAYA<span className="text-yellow-500">FLOW</span>
            </span>
          </div>

          <div className="flex gap-3 items-center p-3 bg-white/60 dark:bg-slate-950/40 rounded-xl border border-black/5 dark:border-white/5 shadow-inner">
            <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-500">
              IO
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-700 dark:text-slate-200">{user?.full_name || "Inspector S. Kadam"}</p>
              <p className="text-[10px] text-slate-400">Investigating Officer</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: "fir-list", label: "Active FIR Listings", icon: FileText },
              { id: "new-fir", label: "Register FIR / Chargesheet", icon: Plus },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 font-semibold transition-all text-left cursor-pointer border ${
                    isActive
                      ? "bg-yellow-500 border-yellow-405 text-slate-950 shadow-lg shadow-yellow-500/10"
                      : "text-slate-500 dark:text-slate-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-808 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/5">
          <Link href="/auth">
            <motion.div
              whileHover={{ scale: 1.01, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 rounded-xl flex items-center gap-3 text-slate-400 hover:text-red-500 transition-all font-semibold cursor-pointer border border-transparent"
            >
              <LogOut className="w-4 h-4" />
              Sign Out Portal
            </motion.div>
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER CONTENT */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full space-y-6">
        
        {/* Header Title */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center pb-4 border-b border-black/5 dark:border-white/5 flex-wrap gap-4 text-left"
        >
          <div>
            <h1 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-500" />
              Police Investigation Portal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Register local crime briefs, construct digital evidence links, and verify applicable BNS sections.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-white/40 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-bold shadow-inner">
              <FolderLock className="w-3.5 h-3.5" />
              Sovereign Network Node: Active
            </span>
          </div>
        </motion.div>

        {/* WORKSPACE CONTENT SPLIT */}
        <AnimatePresence mode="wait">
          {activeTab === "fir-list" && (
            <motion.div
              key="fir-list-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              
              {/* LEFT LIST PANEL */}
              <div className="lg:col-span-4 space-y-4 text-left">
                <h3 className="text-sm font-bold text-slate-600 dark:text-slate-350 px-1">Station FIR Ledger</h3>
                <div className="space-y-3">
                  {mockFirs.map((fir) => {
                    const isSelected = selectedFirId === fir.id;
                    return (
                      <TiltCard key={fir.id}>
                        <div
                          onClick={() => setSelectedFirId(fir.id)}
                          className={`p-4 rounded-2xl border cursor-pointer text-left transition-all ${
                            isSelected
                              ? "bg-white dark:bg-slate-900/40 border-yellow-500/60 shadow-lg"
                              : "bg-white/40 dark:bg-slate-955/30 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-705 dark:text-slate-205">{fir.id}</h4>
                              <p className="text-[10px] text-slate-455 mt-0.5">{fir.crimeType}</p>
                            </div>
                            <span className="text-[9px] text-slate-500 dark:text-slate-450 font-medium">{fir.date}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate">{fir.description}</p>
                          
                          <div className="mt-3 flex justify-between items-center text-[9px] text-slate-500 dark:text-slate-400">
                            <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-slate-950 border border-black/5 dark:border-white/5 text-slate-605 dark:text-slate-300 font-bold">
                              📄 {fir.evidenceCount} Files
                            </span>
                            <span className="text-yellow-600 dark:text-yellow-500 font-bold">{fir.status}</span>
                          </div>
                        </div>
                      </TiltCard>
                    );
                  })}
                </div>
              </div>

              {/* RIGHT DETAIL WORKSPACE PANEL */}
              <div className="lg:col-span-8 space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedFirId}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 glass-panel text-left"
                  >
                    <div className="flex justify-between items-start border-b border-black/5 dark:border-white/5 pb-4 flex-wrap gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-yellow-605 dark:text-yellow-500 uppercase tracking-wide">
                          Active Case File
                        </span>
                        <h3 className="text-base font-extrabold text-slate-805 dark:text-slate-100 mt-1.5">
                          {selectedFir.id} - Complainant: {selectedFir.complainant}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedFir.station}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-455 border border-emerald-500/20 text-[10px] font-bold">
                        Case Authenticated
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Incident Narrative Record:</p>
                      <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed bg-white/60 dark:bg-slate-950/40 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                        {selectedFir.description}
                      </p>
                    </div>

                    {/* Evidence logs */}
                    <div className="space-y-3">
                      <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Digitized Evidence Logs ({selectedFir.evidenceCount}):</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <TiltCard>
                          <div className="p-3 bg-white/60 dark:bg-slate-950/20 border border-black/5 dark:border-white/5 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-600 dark:text-slate-300">broken_door_photo.jpg</p>
                              <p className="text-[9px] text-slate-550 dark:text-slate-500 mt-0.5">Image Hash: SHA256-4291</p>
                            </div>
                            <span className="text-emerald-555 font-bold">Encrypted</span>
                          </div>
                        </TiltCard>
                        <TiltCard>
                          <div className="p-3 bg-white/60 dark:bg-slate-950/20 border border-black/5 dark:border-white/5 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-600 dark:text-slate-300">witness_statement_aditya.pdf</p>
                              <p className="text-[9px] text-slate-550 dark:text-slate-500 mt-0.5">Signed Statement Scan</p>
                            </div>
                            <span className="text-emerald-555 font-bold">Encrypted</span>
                          </div>
                        </TiltCard>
                      </div>
                    </div>

                    {/* BNS Sections */}
                    <div className="space-y-3">
                      <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Mapped Penal Sections (Confirmed by Officer):</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedFir.mappedBns.map((sec, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-405 text-xs font-bold"
                          >
                            {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-black/5 dark:border-white/5 text-[10px] text-slate-500 text-center leading-normal">
                      NyayaFlow AI does not establish or authorize legal offenses. Mapped penal listings are registered under the exclusive authority of the executing investigating officer.
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </motion.div>
          )}

          {/* WORKSPACE CONTENT: CREATE NEW FIR */}
          {activeTab === "new-fir" && (
            <motion.div
              key="new-fir-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 glass-panel text-left"
            >
              <div className="border-b border-black/5 dark:border-white/5 pb-4 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-805 dark:text-slate-100">Register FIR & BNS Advisor</h2>
                  <p className="text-slate-505 dark:text-slate-400 text-xs">Input incident details and run AI mapping helper for BNS section options.</p>
                </div>
                <span className="text-[10px] bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 rounded-lg text-red-500 dark:text-red-400 font-bold">
                  Human Validation Required
                </span>
              </div>

              <div className="space-y-4">
                {/* Form fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Complainant / Victim Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Harish Patil"
                      className="w-full bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-808 dark:text-slate-200 focus:outline-none focus:border-yellow-500/60 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-slate-550 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Crime Category Description</label>
                    <input
                      type="text"
                      placeholder="e.g., Theft / Cyber Crime / Physical Dispute"
                      className="w-full bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-808 dark:text-slate-200 focus:outline-none focus:border-yellow-500/60 transition-colors"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-slate-555 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Incident Narrative (Crime details)</label>
                  <textarea
                    rows={5}
                    value={incidentText}
                    onChange={(e) => setIncidentText(e.target.value)}
                    placeholder="Explain the incident details clearly. Include stolen items, weapon details, or threat logs..."
                    className="w-full bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-2xl p-4 text-slate-808 dark:text-slate-200 focus:outline-none focus:border-yellow-500/60 transition-colors text-xs"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex justify-between items-center pt-2">
                  <RippleWrapper>
                    <button
                      type="button"
                      onClick={handleUploadEvidence}
                      disabled={uploadingEvidence}
                      className="px-4 py-2 bg-white dark:bg-slate-950 border border-black/10 dark:border-white/5 hover:border-yellow-500/40 text-yellow-600 dark:text-yellow-500 rounded-xl font-bold flex items-center gap-1.5 text-xs cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      {uploadingEvidence ? "Uploading files..." : "Upload Evidence / Statements"}
                    </button>
                  </RippleWrapper>

                  <RippleWrapper>
                    <button
                      type="button"
                      disabled={!incidentText || analyzingBns}
                      onClick={handleBnsAnalysis}
                      className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      {analyzingBns ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing BNS Sections...
                        </>
                      ) : (
                        <>Analyze Applicable BNS Codes</>
                      )}
                    </button>
                  </RippleWrapper>
                </div>

                {/* Show evidence */}
                <AnimatePresence>
                  {evidenceFiles.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-white/60 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-2xl space-y-2.5"
                    >
                      <p className="font-bold text-slate-705 dark:text-slate-350 text-xs">Linked Evidence Files ({evidenceFiles.length})</p>
                      <div className="flex flex-wrap gap-2 text-[10px]">
                        {evidenceFiles.map((file) => (
                          <span key={file} className="px-2.5 py-1 rounded-lg bg-black/5 dark:bg-slate-900 border border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-300 font-semibold shadow-inner">
                            📎 {file}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* BNS AI Recommender suggestions block */}
                <AnimatePresence>
                  {bnsSuggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-black/5 dark:border-white/5 bg-white/40 dark:bg-slate-955/40 rounded-3xl p-5 space-y-4 shadow-xl"
                    >
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-yellow-605 dark:text-yellow-500 tracking-wider uppercase">
                            AI Code suggestions
                          </span>
                          <h4 className="text-md font-bold text-slate-805 dark:text-slate-100">Bharatiya Nyaya Sanhita (BNS) Recommendations</h4>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                          Advice Mode Active
                        </span>
                      </div>

                      <div className="space-y-3.5">
                        {bnsSuggestions.map((item, idx) => {
                          const isMapped = selectedBnsSections.includes(item.section);
                          return (
                            <motion.div
                              key={item.section}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: idx * 0.08 }}
                              className={`p-4 rounded-2xl border transition-all text-left ${
                                isMapped
                                  ? "bg-white dark:bg-slate-900 border-yellow-500/50 shadow-md"
                                  : "bg-white/40 dark:bg-slate-950/20 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                              }`}
                            >
                              <div className="flex justify-between items-start flex-wrap gap-3">
                                <div>
                                  <h5 className="font-bold text-slate-805 dark:text-slate-100 text-xs sm:text-sm">
                                    {item.section} - {item.title}
                                  </h5>
                                  <p className="text-[10px] text-slate-500">Confidence: {item.confidence}</p>
                                </div>
                                <RippleWrapper>
                                  <button
                                    type="button"
                                    onClick={() => handleToggleBns(item.section)}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer ${
                                      isMapped
                                        ? "bg-emerald-600 border-emerald-500 text-white"
                                        : "bg-white dark:bg-slate-950 hover:bg-black/5 dark:hover:bg-slate-900 border-black/5 dark:border-white/5 text-yellow-600 dark:text-yellow-500"
                                    }`}
                                  >
                                    {isMapped ? "✓ mapped to FIR" : "Map to FIR"}
                                  </button>
                                </RippleWrapper>
                              </div>
                              <p className="text-[11px] text-slate-505 dark:text-slate-400 mt-2 leading-relaxed">
                                {item.description}
                              </p>
                              <p className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold mt-1.5">
                                <strong>Penalty Scope:</strong> {item.penalty}
                              </p>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Final signature submit block */}
                      <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="text-[10px] text-slate-500 max-w-md text-center sm:text-left leading-normal">
                          Confirm mapped sections below. Once approved, the record is locked and transmitted to the Registry under your badge.
                        </div>
                        
                        {!officerConfirmed ? (
                          <RippleWrapper>
                            <button
                              type="button"
                              onClick={handleConfirmFiling}
                              disabled={actionLoading || selectedBnsSections.length === 0}
                              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold transition-all text-xs cursor-pointer shadow-lg animate-pulse"
                            >
                              Confirm & Transmit chargesheet
                            </button>
                          </RippleWrapper>
                        ) : (
                          <div className="flex gap-2.5 items-center text-emerald-600 dark:text-emerald-450 font-bold text-xs sm:text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                            <CheckCircle className="w-4 h-4 animate-bounce" />
                            FIR Transmitted to Registry (Case locked)
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}
