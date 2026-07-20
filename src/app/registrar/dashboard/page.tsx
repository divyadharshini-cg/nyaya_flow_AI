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
      
      // Update local state tracking for filters
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
            <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400">
              RC
            </div>
            <div>
              <p className="font-bold text-slate-200">Registrar Clerk</p>
              <p className="text-[10px] text-slate-500">Subordinate Registry</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("pending")}
              className={`w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold transition-all text-left ${
                activeTab === "pending"
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              Pending Petitions
            </button>

            <button
              onClick={() => setActiveTab("accepted")}
              className={`w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold transition-all text-left ${
                activeTab === "accepted"
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              Accepted (CNR Linked)
            </button>

            <button
              onClick={() => setActiveTab("returned")}
              className={`w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold transition-all text-left ${
                activeTab === "returned"
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              Returned Files
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-yellow-500" />
              Registry Scrutiny Workspace
            </h1>
            <p className="text-slate-400 text-xs">Verify digital filing packets, catalog physical files, and record court CNR identifiers.</p>
          </div>

          {/* Search box */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by litigant or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-yellow-500 text-slate-200"
            />
          </div>
        </div>

        {/* WORKSPACE CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: PENDING PETITIONS LIST */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-300">Petitions Inbox ({filteredCases.length})</h3>
            
            {filteredCases.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 border border-slate-850 rounded-2xl text-slate-500 text-xs">
                No petitions found matching filters.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCases.map((c) => {
                  const isSelected = selectedCaseId === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`p-4 rounded-xl border cursor-pointer text-left transition-all ${
                        isSelected
                          ? "bg-slate-900 border-yellow-500/60 shadow-lg scale-102"
                          : "bg-slate-900/40 border-slate-850 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-200">{c.applicant}</h4>
                          <p className="text-[10px] text-slate-500 mt-0.5">{c.type}</p>
                        </div>
                        <span className="text-[9px] text-slate-400">{c.date}</span>
                      </div>
                      <div className="mt-3 flex justify-between items-center text-[10px]">
                        <span className={`px-1.5 py-0.5 rounded font-bold ${
                          c.healthScore >= 85 ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        }`}>
                          Doc Score: {c.healthScore}%
                        </span>
                        {c.hasDuplicates && (
                          <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-bold flex items-center gap-1">
                            ⚠️ Duplicate
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: DETAIL WORKSPACE PANEL */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              {filteredCases.length > 0 && selectedCase ? (
                <motion.div
                  key={selectedCase.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 glass-panel"
                >
                  {/* Case Header */}
                  <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wide">
                        Scrutiny Case: {selectedCase.id}
                      </span>
                      <h3 className="text-md font-bold text-slate-100 mt-1">
                        {selectedCase.applicant} v. Respondent
                      </h3>
                      <p className="text-xs text-slate-500">{selectedCase.type}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 rounded bg-slate-950 text-slate-400 text-xs border border-slate-850">
                        Registry Scrutiny Phase
                      </span>
                    </div>
                  </div>

                  {/* AI Assistant automatically extracted details */}
                  <div className="border border-yellow-500/20 bg-slate-950/40 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-yellow-500 flex items-center gap-1.5">
                      <Sliders className="w-4 h-4" />
                      AI Assistant Scrutiny Extraction (Advisory)
                    </h4>

                    <div className="text-slate-300 space-y-2">
                      <p className="font-semibold text-slate-200">Automated Summary Brief:</p>
                      <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-850">
                        {selectedCase.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-slate-500 font-semibold">Suggested Jurisdictional Court:</p>
                        <p className="text-slate-200 font-bold">{selectedCase.suggestedCourt}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 font-semibold">Missing/Suggested Documents Checklist:</p>
                        <ul className="list-disc pl-4 text-slate-400 space-y-0.5 text-[11px]">
                          {selectedCase.missingFiles.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {selectedCase.hasDuplicates && (
                      <div className="p-3 bg-red-500/5 border border-red-500/20 text-red-400 rounded-lg flex items-start gap-2.5 text-[11px]">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span><strong>Duplicate Check Warning:</strong> {selectedCase.duplicateInfo}</span>
                      </div>
                    )}
                  </div>

                  {/* Document attachments list */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Uploaded Documents Health Audit
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCase.documents.map((doc, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex justify-between items-center gap-4 text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-300 truncate max-w-[180px]">{doc.name}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">{doc.type}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            doc.status === "Verified"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Physical archival logger form */}
                  <div className="border border-slate-850 p-4 rounded-xl space-y-4">
                    <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                      <Archive className="w-4 h-4 text-yellow-500" />
                      Link Physical Archive Location
                    </h4>
                    <p className="text-slate-500 text-[10px] leading-normal">
                      Input the exact location details once physical copies are received and verified by the clerk.
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 font-semibold">Building</label>
                        <input
                          type="text"
                          value={archiveForm.building}
                          onChange={(e) => setArchiveForm({ ...archiveForm, building: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-semibold">Floor / Room</label>
                        <input
                          type="text"
                          value={archiveForm.room}
                          onChange={(e) => setArchiveForm({ ...archiveForm, room: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-semibold">Rack No</label>
                        <input
                          type="text"
                          value={archiveForm.rack}
                          onChange={(e) => setArchiveForm({ ...archiveForm, rack: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-semibold">Shelf / Cupboard</label>
                        <input
                          type="text"
                          value={archiveForm.shelf}
                          onChange={(e) => setArchiveForm({ ...archiveForm, shelf: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 font-semibold">Box Number</label>
                        <input
                          type="text"
                          value={archiveForm.box}
                          onChange={(e) => setArchiveForm({ ...archiveForm, box: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={handleSaveArchive}
                          disabled={actionLoading || archivedCases.includes(selectedCase.id)}
                          className="w-full py-1.5 bg-slate-950 border border-slate-800 hover:border-yellow-500/40 text-yellow-500 font-bold rounded flex justify-center items-center gap-1 cursor-pointer"
                        >
                          <Barcode className="w-3.5 h-3.5" /> 
                          {archivedCases.includes(selectedCase.id) ? "Location Linked" : "Save Archive"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Official CNR Assignment panel */}
                  <div className="border border-slate-850 p-4 rounded-xl space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-slate-300 flex items-center gap-1.5">
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        Official court system CNR Linkage
                      </h4>
                      <span className="text-[10px] text-yellow-500/90 font-medium">
                        ⚠️ NyayaFlow AI NEVER generates official CNR numbers.
                      </span>
                    </div>

                    <form onSubmit={handleRegisterCnr} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-slate-400 font-semibold">Enter Official Court CNR Identifiers</label>
                        <input
                          type="text"
                          required
                          value={officialCnr}
                          onChange={(e) => setOfficialCnr(e.target.value)}
                          placeholder="e.g., MHPU02-00891-2026"
                          className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-yellow-500/80 text-xs sm:text-sm"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          type="button"
                          onClick={handleReturnCase}
                          disabled={actionLoading}
                          className="px-4 py-2 border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold rounded-lg cursor-pointer"
                        >
                          Return Petition (With Scrutiny Feedback)
                        </button>

                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer shadow-lg"
                        >
                          {actionLoading ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" /> Linkage processing...
                            </>
                          ) : (
                            <>Confirm & Register CNR</>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </motion.div>
              ) : (
                <div className="p-8 text-center bg-slate-900 border border-slate-850 rounded-2xl text-slate-500">
                  Select a pending petition from the list to begin audit checks.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
