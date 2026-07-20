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
  const [selectedFirId, setSelectedFirId] = useState("fir-101");
  const [incidentText, setIncidentText] = useState("");
  const [analyzingBns, setAnalyzingBns] = useState(false);
  const [bnsSuggestions, setBnsSuggestions] = useState<any[]>([]);
  const [selectedBnsSections, setSelectedBnsSections] = useState<string[]>([]);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState<string[]>([]);
  const [officerConfirmed, setOfficerConfirmed] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  const [actionLoading, setActionLoading] = useState(false);

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 text-xs sm:text-sm">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 p-4">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-2 pb-4 border-b border-slate-800/80">
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-yellow-600 to-emerald-600 flex items-center justify-center font-bold text-white text-xs">
              NF
            </div>
            <span className="font-bold tracking-wider text-slate-100">
              NYAYA<span className="text-yellow-500">FLOW</span>
            </span>
          </div>

          <div className="flex gap-3 items-center p-2.5 bg-slate-950/40 rounded-xl border border-slate-850">
            <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
              IO
            </div>
            <div>
              <p className="font-bold text-slate-200">Inspector S. Kadam</p>
              <p className="text-[10px] text-slate-500">Investigating Officer</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("fir-list")}
              className={`w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold transition-all text-left ${
                activeTab === "fir-list"
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              Active FIR Listings
            </button>

            <button
              onClick={() => setActiveTab("new-fir")}
              className={`w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold transition-all text-left ${
                activeTab === "new-fir"
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <Plus className="w-4 h-4" />
              Register FIR / Chargesheet
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-850">
          <Link
            href="/auth"
            className="w-full p-2.5 rounded-lg flex items-center gap-3 text-slate-400 hover:bg-slate-850 hover:text-red-400 transition-all font-semibold"
          >
            <LogOut className="w-4 h-4" />
            Sign Out Portal
          </Link>
        </div>
      </aside>

      {/* MAIN CONTAINER CONTENT */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto w-full space-y-6">
        
        {/* Header Title */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800/80">
          <div>
            <h1 className="text-xl font-black text-slate-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400 animate-pulse" />
              Police Investigation Portal
            </h1>
            <p className="text-slate-400 text-xs">Register local crime briefs, construct digital evidence links, and verify applicable BNS sections.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-400 flex items-center gap-1.5 font-bold">
              <FolderLock className="w-3.5 h-3.5" />
              Sovereign Network Node: Active
            </span>
          </div>
        </div>

        {/* WORKSPACE CONTENT SPLIT */}
        {activeTab === "fir-list" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT LIST PANEL */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="text-sm font-bold text-slate-300">Station FIR Ledger</h3>
              <div className="space-y-3">
                {mockFirs.map((fir) => {
                  const isSelected = selectedFirId === fir.id;
                  return (
                    <div
                      key={fir.id}
                      onClick={() => setSelectedFirId(fir.id)}
                      className={`p-4 rounded-xl border cursor-pointer text-left transition-all ${
                        isSelected
                          ? "bg-slate-900 border-yellow-500/60 shadow-lg scale-102"
                          : "bg-slate-900/40 border-slate-850 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-200">{fir.id}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{fir.crimeType}</p>
                        </div>
                        <span className="text-[9px] text-slate-400">{fir.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 truncate">{fir.description}</p>
                      
                      <div className="mt-3 flex justify-between items-center text-[9px] text-slate-400">
                        <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-300">
                          📄 {fir.evidenceCount} Files
                        </span>
                        <span className="text-yellow-500 font-medium">{fir.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RIGHT DETAIL WORKSPACE PANEL */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 glass-panel">
                <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wide">
                      Active Case File
                    </span>
                    <h3 className="text-md font-bold text-slate-100 mt-1">
                      {selectedFir.id} - Complainant: {selectedFir.complainant}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedFir.station}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    Case Authenticated
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-slate-400 font-semibold">Incident Narrative Record:</p>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                    {selectedFir.description}
                  </p>
                </div>

                {/* Evidence count and listing */}
                <div className="space-y-3">
                  <p className="text-slate-400 font-semibold">Digitized Evidence Logs ({selectedFir.evidenceCount}):</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-300">broken_door_photo.jpg</p>
                        <p className="text-[9px] text-slate-500">Image Hash: SHA256-4291</p>
                      </div>
                      <span className="text-emerald-400 font-bold">Encrypted</span>
                    </div>
                    <div className="p-3 bg-slate-950/20 border border-slate-850 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-300">witness_statement_aditya.pdf</p>
                        <p className="text-[9px] text-slate-500">Signed Statement Scan</p>
                      </div>
                      <span className="text-emerald-400 font-bold">Encrypted</span>
                    </div>
                  </div>
                </div>

                {/* Mapped BNS sections display */}
                <div className="space-y-3">
                  <p className="text-slate-400 font-semibold">Mapped Penal Sections (Confirmed by Officer):</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFir.mappedBns.map((sec, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-bold"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center leading-normal">
                  NyayaFlow AI does not establish or authorize legal offenses. Mapped penal listings are registered under the exclusive authority of the executing investigating officer.
                </div>
              </div>
            </div>

          </div>
        )}

        {/* WORKSPACE CONTENT: CREATE NEW FIR & RUN BNS ADVISOR */}
        {activeTab === "new-fir" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 glass-panel">
            <div className="border-b border-slate-800 pb-4 flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Filing New FIR & BNS Advisor</h2>
                <p className="text-slate-400 text-xs">Input incident details and run AI mapping helper for BNS section options.</p>
              </div>
              <span className="text-[10px] bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded text-red-400 font-bold">
                Human Validation Required
              </span>
            </div>

            <div className="space-y-4">
              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Complainant / Victim Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Harish Patil"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400 font-semibold">Crime Category Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Theft / Cyber Crime / Physical Dispute"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-slate-400 font-semibold">Incident Narrative (Crime details)</label>
                <textarea
                  rows={5}
                  value={incidentText}
                  onChange={(e) => setIncidentText(e.target.value)}
                  placeholder="Explain the incident details clearly. Include stolen items, weapon details, or threat logs..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none text-xs sm:text-sm"
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-between items-center pt-2">
                {/* Upload evidence simulation */}
                <button
                  type="button"
                  onClick={handleUploadEvidence}
                  disabled={uploadingEvidence}
                  className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-yellow-500/40 text-yellow-500 rounded-lg font-bold flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  {uploadingEvidence ? "Uploading files..." : "Upload Evidence / Statements"}
                </button>

                <button
                  type="button"
                  disabled={!incidentText || analyzingBns}
                  onClick={handleBnsAnalysis}
                  className="px-5 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {analyzingBns ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing BNS Sections...
                    </>
                  ) : (
                    <>Analyze Applicable BNS Codes</>
                  )}
                </button>
              </div>

              {/* Show uploaded evidence files list */}
              {evidenceFiles.length > 0 && (
                <div className="p-3.5 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2">
                  <p className="font-bold text-slate-300 text-xs">Linked Evidence Files ({evidenceFiles.length})</p>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    {evidenceFiles.map((file) => (
                      <span key={file} className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
                        📎 {file}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* BNS AI Recommender suggestions block */}
              <AnimatePresence>
                {bnsSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-yellow-500/20 bg-slate-950/80 rounded-2xl p-5 space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-yellow-500 tracking-wider uppercase">
                          AI Code suggestions
                        </span>
                        <h4 className="text-md font-bold text-slate-100">Bharatiya Nyaya Sanhita (BNS) Recommendations</h4>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                        Advice Mode Active
                      </span>
                    </div>

                    <div className="space-y-3">
                      {bnsSuggestions.map((item) => {
                        const isMapped = selectedBnsSections.includes(item.section);
                        return (
                          <div
                            key={item.section}
                            className={`p-3.5 rounded-xl border transition-all text-left ${
                              isMapped
                                ? "bg-slate-900 border-yellow-500/50 shadow-md"
                                : "bg-slate-900/40 border-slate-850 hover:border-slate-800"
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-slate-100 text-xs sm:text-sm">
                                  {item.section} - {item.title}
                                </h5>
                                <p className="text-[10px] text-slate-500">Confidence: {item.confidence}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleToggleBns(item.section)}
                                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                                  isMapped
                                    ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                                    : "bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-yellow-500/30 text-yellow-500"
                                }`}
                              >
                                {isMapped ? "✓ mapped to FIR" : "Map to FIR"}
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                              {item.description}
                            </p>
                            <p className="text-[10px] text-yellow-500/90 font-medium mt-1">
                              <strong>Penalty Scope:</strong> {item.penalty}
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    {/* Final signature submit block */}
                    <div className="pt-4 border-t border-slate-850 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="text-[10px] text-slate-500 max-w-md text-center sm:text-left leading-normal">
                        Confirm mapped sections below. Once approved, the record is locked and transmitted to the Registry under your badge.
                      </div>
                      
                      {!officerConfirmed ? (
                        <button
                          type="button"
                          onClick={handleConfirmFiling}
                          disabled={actionLoading || selectedBnsSections.length === 0}
                          className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold transition-all text-xs cursor-pointer shadow-lg animate-pulse"
                        >
                          Confirm & Transmit chargesheet
                        </button>
                      ) : (
                        <div className="flex gap-2 items-center text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
                          <CheckCircle className="w-4 h-4 animate-bounce" />
                          FIR Transmitted to Registry (Case locked)
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        </main>
      </div>
    );
  }
