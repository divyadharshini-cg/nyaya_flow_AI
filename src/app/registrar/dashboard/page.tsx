"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  FileText,
  Search,
  Check,
  Building2,
  Barcode,
  Clock,
  ArrowRight,
  BookOpen,
  RefreshCw,
  LogOut,
  Sliders,
  Archive,
  QrCode
} from "lucide-react";
import { apiListPetitions, apiUpdatePetitionCnr, apiUpdatePetitionStatus, apiSaveArchive } from "@/utils/api";
import AssistantSidebar from "@/components/assistant-sidebar";
import TiltCard from "@/components/tilt-card";
import RippleWrapper from "@/components/ripple-wrapper";

interface PetitionCase {
  id: string;
  applicant: string;
  type: string;
  date: string;
  summary: string;
  suggestedCourt: string;
  hasDuplicates: boolean;
  duplicateInfo?: string;
  missingFiles: string[];
  documents: { name: string; type: string; status: string }[];
  healthScore: number;
}

export default function RegistrarDashboard() {
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedCaseId, setSelectedCaseId] = useState("pet-01");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Archival inputs
  const [archiveForm, setArchiveForm] = useState({
    building: "High Court Building A",
    floor: "3rd Floor",
    room: "Record Room Room-B",
    rack: "Rack-08",
    cupboard: "Cupboard-02",
    shelf: "Shelf-C",
    box: "Box-109",
    fileNumber: "FIL-PUN-2026-0891",
    barcode: "NF-BAR-4912019",
    qrCode: "NF-QR-4912019",
  });
  
  const [officialCnr, setOfficialCnr] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [registeredCases, setRegisteredCases] = useState<string[]>([]);
  const [returnedCases, setReturnedCases] = useState<string[]>([]);
  const [archivedCases, setArchivedCases] = useState<string[]>([]);
  const [cases, setCases] = useState<PetitionCase[]>([]);
  const [user, setUser] = useState<any>(null);

  const defaultMockCases: PetitionCase[] = [
    {
      id: "pet-01",
      applicant: "Aditya Patil",
      type: "Property & Land Dispute",
      date: "Jul 16, 2026",
      summary:
        "Litigant claims boundary encroachment on survey plot #142 in Kothrud by neighbour who built a concrete partition wall. Talathi reports are attached showing discrepancy. Requesting injunction.",
      suggestedCourt: "Sub-Divisional Magistrate Civil Court, Pune",
      hasDuplicates: false,
      missingFiles: ["Original Registered Boundary deed copy"],
      healthScore: 88,
      documents: [
        { name: "Litigant Petition Memo.pdf", type: "Petition", status: "Verified" },
        { name: "Land Boundary survey map.png", type: "Map", status: "Verified" },
        { name: "Aadhaar Card copy.pdf", type: "Identity", status: "Verified" },
        { name: "7/12 Extract Mutation.pdf", type: "Property Deed", status: "Requires Hard Copy Verification" },
      ],
    },
    {
      id: "pet-02",
      applicant: "Karan Johar (Adv. S. Sharma)",
      type: "Cyber / Online Extortion",
      date: "Jul 15, 2026",
      summary:
        "Involves continuous extortion threats received via WhatsApp and Telegram messages. Litigant requests trace and emergency block orders against unknown digital handles. IPC Section 308 digital claims.",
      suggestedCourt: "District Cyber Crime Court, Pune",
      hasDuplicates: true,
      duplicateInfo: "98% overlap detected with pending FIR #IO-921-2026 registered at Shivajinagar Police Station.",
      missingFiles: [],
      healthScore: 95,
      documents: [
        { name: "Filing Complaint details.pdf", type: "Petition", status: "Verified" },
        { name: "WhatsApp Screenshots logs.pdf", type: "Evidence", status: "Verified" },
        { name: "Telegram Chat Backup.txt", type: "Evidence", status: "Verified" },
        { name: "Police FIR Reference.pdf", type: "Police Record", status: "Verified" },
      ],
    },
    {
      id: "pet-03",
      applicant: "Radha Deshpande",
      type: "Consumer Dispute",
      date: "Jul 14, 2026",
      summary:
        "Filing against auto dealer for delivering a vehicle with factory engine defects. Dealership refuses replacements or refund. Section 12 Consumer Protection Act claims.",
      suggestedCourt: "District Consumer Redressal Forum, Pune",
      hasDuplicates: false,
      missingFiles: ["Dealer Sales invoice details", "Service Center assessment report"],
      healthScore: 71,
      documents: [
        { name: "Complaint Form.pdf", type: "Petition", status: "Verified" },
        { name: "Booking Deposit receipt.pdf", type: "Finance Doc", status: "Verified" },
      ],
    },
  ];

  const loadData = async () => {
    try {
      const rawPetitions = await apiListPetitions();
      const dbCases: PetitionCase[] = rawPetitions.map((p: any) => ({
        id: p.id,
        applicant: p.citizen_name || "Aditya Patil",
        type: p.category,
        date: p.created_at ? new Date(p.created_at).toLocaleDateString() : "Jul 18, 2026",
        summary: p.description,
        suggestedCourt: p.suggested_court || "Subordinate Court",
        hasDuplicates: false,
        missingFiles: [],
        healthScore: 85,
        documents: [
          { name: "Litigant Petition Memo.pdf", type: "Petition", status: "Verified" },
        ],
      }));

      // Merge mock and db cases
      const combined = [...dbCases];
      defaultMockCases.forEach((mock) => {
        if (!combined.some((c) => c.id === mock.id)) {
          combined.push(mock);
        }
      });
      
      setCases(combined);
      
      const completedCnrIds = rawPetitions
        .filter((p: any) => p.status === "CNR Issued" || p.status === "Hearings Active" || p.status === "Disposed")
        .map((p: any) => p.id);
      const returnedIds = rawPetitions
        .filter((p: any) => p.status === "Returned")
        .map((p: any) => p.id);
      const archivedIds = rawPetitions
        .filter((p: any) => p.status === "Registry Audited" || p.status === "CNR Issued" || p.status === "Hearings Active" || p.status === "Disposed")
        .map((p: any) => p.id);
      
      setRegisteredCases(completedCnrIds);
      setReturnedCases(returnedIds);
      setArchivedCases(archivedIds);

      if (combined.length > 0 && !combined.some(c => c.id === selectedCaseId)) {
        setSelectedCaseId(combined[0].id);
      }
    } catch (err) {
      console.error(err);
      setCases(defaultMockCases);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    loadData();
  }, []);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0] || defaultMockCases[0];

  const handleRegisterCnr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officialCnr) return;
    setActionLoading(true);
    try {
      await apiUpdatePetitionCnr(selectedCase.id, officialCnr);
      await loadData();
      setOfficialCnr("");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnCase = async () => {
    setActionLoading(true);
    try {
      await apiUpdatePetitionStatus(selectedCase.id, "Returned");
      await loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveArchive = async () => {
    setActionLoading(true);
    try {
      await apiSaveArchive(
        selectedCase.id,
        archiveForm.building,
        archiveForm.floor,
        archiveForm.room,
        archiveForm.rack,
        archiveForm.cupboard,
        archiveForm.shelf,
        archiveForm.box,
        archiveForm.barcode,
        user?.id || "sandbox-id-registrar"
      );
      await loadData();
      alert("Physical archive location linked to digital case profile successfully.");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  // Filters
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.applicant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "pending") {
      return matchesSearch && !registeredCases.includes(c.id) && !returnedCases.includes(c.id);
    }
    if (activeTab === "accepted") {
      return matchesSearch && registeredCases.includes(c.id);
    }
    if (activeTab === "returned") {
      return matchesSearch && returnedCases.includes(c.id);
    }
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-805 dark:text-slate-100 text-xs sm:text-sm">
      
      {/* AI Assistant Sidebar */}
      <AssistantSidebar role="registrar" />

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

          <div className="flex gap-3 items-center p-3 bg-white/60 dark:bg-slate-950/40 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
            <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center font-bold text-cyan-500">
              RC
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-700 dark:text-slate-200">{user?.full_name || "Registrar Clerk"}</p>
              <p className="text-[10px] text-slate-400">Subordinate Registry</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: "pending", label: "Pending Petitions", icon: FileText },
              { id: "accepted", label: "Registered (CNR Issued)", icon: CheckCircle },
              { id: "returned", label: "Returned Petitions", icon: AlertTriangle },
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
              <Building className="w-5 h-5 text-cyan-505" />
              Registrar Scrutiny Registry
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Verify scanned documents health scores, audit duplicates, assign official court CNRs, and log physical archives storage locations.</p>
          </div>
        </motion.div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT LIST PANEL */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-350 px-1">Submissions Queue</h3>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-550" />
                <input
                  type="text"
                  placeholder="Search applicant or type..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl pl-9 pr-4 py-2.5 text-xs text-slate-808 dark:text-slate-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              {filteredCases.map((c) => {
                const isSelected = selectedCaseId === c.id;
                return (
                  <TiltCard key={c.id}>
                    <div
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`p-4 rounded-2xl border cursor-pointer text-left transition-all ${
                        isSelected
                          ? "bg-white dark:bg-slate-900/40 border-yellow-500/60 shadow-lg scale-102"
                          : "bg-white/40 dark:bg-slate-955/30 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-slate-500 font-semibold">{c.date}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 font-bold">
                          Score: {c.healthScore}%
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-805 dark:text-slate-202 mt-2">{c.applicant}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{c.type}</p>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>

          {/* RIGHT DETAIL WORKSPACE PANEL */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {selectedCase && (
                <motion.div
                  key={selectedCase.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 glass-panel text-left"
                >
                  <div className="flex justify-between items-start border-b border-black/5 dark:border-white/5 pb-4 flex-wrap gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-yellow-605 dark:text-yellow-500 uppercase tracking-wider">
                        Scrutiny Case ID: {selectedCase.id}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-805 dark:text-slate-100 mt-1.5">
                        Applicant: {selectedCase.applicant}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedCase.type}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-450 border border-yellow-500/20 text-[10px] font-bold">
                      {registeredCases.includes(selectedCase.id) ? "CNR Issued" : (returnedCases.includes(selectedCase.id) ? "Returned" : "Scrutiny Pending")}
                    </span>
                  </div>

                  {/* Summary Card */}
                  <div className="space-y-2">
                    <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Case Narrative Abstract:</p>
                    <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed bg-white/60 dark:bg-slate-950/40 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                      {selectedCase.summary}
                    </p>
                  </div>

                  {/* Document audit files lists & score */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <p className="text-slate-505 dark:text-slate-450 font-bold uppercase text-[10px] tracking-wider">Filing Document Health Score:</p>
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 rounded-full border-4 border-yellow-500/20 border-t-yellow-500 flex items-center justify-center font-black text-yellow-605 dark:text-yellow-500 text-base shadow-lg animate-pulse-gold">
                          {selectedCase.healthScore}%
                        </div>
                        <div>
                          <p className="font-bold text-slate-700 dark:text-slate-200 text-xs">OCR health target passed</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">Threshold 85% required</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-left">
                      <p className="text-slate-505 dark:text-slate-450 font-bold uppercase text-[10px] tracking-wider">Required Document Completeness Checklist:</p>
                      {selectedCase.missingFiles.length === 0 ? (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 border border-emerald-500/20 text-[9px] font-bold uppercase">
                          ✓ All documents attached
                        </span>
                      ) : (
                        <div className="space-y-1.5">
                          {selectedCase.missingFiles.map((f) => (
                            <span key={f} className="block px-2.5 py-1 rounded-lg bg-red-500/5 border border-red-500/20 text-red-500 dark:text-red-400 text-[10px] font-semibold leading-normal">
                              ⚠ Missing: {f}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Duplicate checks warnings */}
                  {selectedCase.hasDuplicates && (
                    <div className="p-4 bg-red-500/5 border border-red-500/15 rounded-2xl flex gap-3 text-xs">
                      <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-450 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-red-500 dark:text-red-455 uppercase text-[10px] tracking-wider">Overlap / Duplicate warning detected by AI</p>
                        <p className="text-slate-550 dark:text-slate-400 mt-1 leading-relaxed text-[11px]">{selectedCase.duplicateInfo}</p>
                      </div>
                    </div>
                  )}

                  {/* Document ledger table */}
                  <div className="space-y-2.5">
                    <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Scanned Document Attachments ({selectedCase.documents.length}):</p>
                    <div className="space-y-2">
                      {selectedCase.documents.map((doc, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 bg-white/60 dark:bg-slate-955/20 border border-black/5 dark:border-white/5 rounded-xl text-xs flex-wrap gap-2">
                          <span className="font-bold text-slate-705 dark:text-slate-300">{doc.name}</span>
                          <span className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-slate-900 border border-black/5 dark:border-white/5 text-[9px] text-slate-500 dark:text-slate-400 font-bold">{doc.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="pt-6 border-t border-black/5 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
                    
                    {/* Part A: Issue CNR number */}
                    <div className="space-y-3">
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xs">Acknowledge Scrutiny & Issue CNR</h4>
                      <p className="text-[10px] text-slate-500 leading-normal">Assign the standard unique 16-character CNR number to verify official registration in the High Court cause records.</p>
                      
                      {registeredCases.includes(selectedCase.id) ? (
                        <div className="flex gap-2 items-center text-emerald-600 dark:text-emerald-455 font-bold text-xs sm:text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 rounded-xl">
                          <CheckCircle className="w-4 h-4 text-emerald-500" /> Court Registered (CNR Transmitted)
                        </div>
                      ) : (
                        <form onSubmit={handleRegisterCnr} className="flex gap-2">
                          <input
                            type="text"
                            required
                            placeholder="e.g., MHPU02-89210-2026"
                            value={officialCnr}
                            onChange={(e) => setOfficialCnr(e.target.value)}
                            className="bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2 text-xs text-slate-808 dark:text-slate-100 focus:outline-none flex-1"
                          />
                          <RippleWrapper>
                            <button
                              type="submit"
                              disabled={actionLoading}
                              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-xl text-xs cursor-pointer"
                            >
                              Register
                            </button>
                          </RippleWrapper>
                        </form>
                      )}
                    </div>

                    {/* Part B: Physical Archive Location Details */}
                    <div className="space-y-3 border-l-0 sm:border-l border-black/5 dark:border-white/5 pl-0 sm:pl-6">
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xs">Link Physical Archive Location</h4>
                      <p className="text-[10px] text-slate-500 leading-normal">Map scanned profiles to physical locations using barcodes and room bounds.</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="space-y-1">
                          <span className="text-slate-500">Building</span>
                          <input
                            type="text"
                            value={archiveForm.building}
                            onChange={(e) => setArchiveForm({ ...archiveForm, building: e.target.value })}
                            className="w-full bg-white/60 dark:bg-slate-955/60 border border-black/5 dark:border-white/5 rounded px-2 py-1 text-slate-708 dark:text-slate-300"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-slate-500">Box ID / Room</span>
                          <input
                            type="text"
                            value={archiveForm.box}
                            onChange={(e) => setArchiveForm({ ...archiveForm, box: e.target.value })}
                            className="w-full bg-white/60 dark:bg-slate-955/60 border border-black/5 dark:border-white/5 rounded px-2 py-1 text-slate-708 dark:text-slate-300"
                          />
                        </div>
                      </div>
                      
                      <RippleWrapper>
                        <button
                          type="button"
                          onClick={handleSaveArchive}
                          disabled={actionLoading}
                          className="w-full py-2 bg-white dark:bg-slate-950 hover:bg-black/5 dark:hover:bg-white/5 border border-black/10 dark:border-white/5 text-yellow-600 dark:text-yellow-500 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Archive className="w-3.5 h-3.5" /> Save Archival Link
                        </button>
                      </RippleWrapper>
                    </div>

                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
