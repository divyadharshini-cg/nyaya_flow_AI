"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  FileText,
  BookOpen,
  Search,
  Check,
  CheckCircle,
  Clock,
  ArrowRight,
  LogOut,
  Sliders,
  Calendar,
  Layers,
  ChevronRight,
  FileCheck,
  Gavel,
  Shield,
  Briefcase,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { apiListPetitions, apiSaveOrder } from "@/utils/api";

interface CourtCase {
  cnr: string;
  id: string;
  applicant: string;
  respondent: string;
  category: string;
  time: string;
  stage: string;
  summary: string;
  previousHearings: { date: string; summary: string }[];
  applicableActs: string[];
  precedents: { title: string; citation: string; relevance: string; matchScore: string }[];
}

export default function JudgePortal() {
  const [selectedCnr, setSelectedCnr] = useState("MHPU02-89210-2026");
  const [activeSubTab, setActiveSubTab] = useState<"brief" | "evidence" | "orders">("brief");
  const [actionNotes, setActionNotes] = useState("");
  const [actionStatus, setActionStatus] = useState("Passed");
  const [processingOrder, setProcessingOrder] = useState(false);
  const [casesLogged, setCasesLogged] = useState<string[]>([]);
  const [causeList, setCauseList] = useState<CourtCase[]>([]);
  const [user, setUser] = useState<any>(null);

  // Mock cause list cases
  const defaultMockCauseList: CourtCase[] = [
    {
      cnr: "MHPU02-89210-2026",
      id: "mock-1",
      applicant: "Aditya Patil",
      respondent: "Kothrud Ward Office / BMC",
      category: "Property Encroachment (Civil)",
      time: "10:30 AM",
      stage: "First Cause Admissibility",
      summary:
        "Petition regarding illegal masonry boundary partition wall constructed on survey plot #142, Kothrud. Applicant possesses a valid 1989 Family Partition deed, claiming respondent municipal ward has ignored survey records and allowed neighbor encroachment.",
      previousHearings: [
        { date: "Jul 16, 2026", summary: "Registrar scrutinized digitized filing. Official CNR linked to archive Box #109." },
      ],
      applicableActs: [
        "Maharashtra Land Revenue Code, 1966 (Section 143)",
        "The Specific Relief Act, 1963 (Section 6)",
        "Code of Civil Procedure, 1908 (O.39 R.1 - Temporary Injunctions)",
      ],
      precedents: [
        {
          title: "Vasant Rao v. State of Maharashtra (2018)",
          citation: "2018 SCC Online Bom 192",
          relevance: "Reaffirms that partition survey bounds established by talathi record must precede municipal boundary adjustments.",
          matchScore: "94%",
        },
        {
          title: "Sudhir Kumar v. Municipal Corp (2021)",
          citation: "2021 INSC 4902",
          relevance: "Injunction qualification criteria against public works encroaching private layout partitions.",
          matchScore: "88%",
        },
      ],
    },
    {
      cnr: "MHPU02-82910-2026",
      id: "mock-2",
      applicant: "Karan Johar",
      respondent: "State of Maharashtra",
      category: "Cybercrime / Extortion (Criminal)",
      time: "11:15 AM",
      stage: "Bail / Admissibility Hearing",
      summary:
        "Bail application regarding cyber threats and phishing clone complaints. Police reports indicate digital extortion via foreign proxy servers. Respondent claims custodial interrogation required to retrieve servers.",
      previousHearings: [
        { date: "Jul 15, 2026", summary: "Police registered FIR reference. BNS Section 305/331 matched by investigating officer." },
      ],
      applicableActs: [
        "Section 318 BNS (Cheating & property delivery)",
        "Section 66D of Information Technology Act, 2000",
        "Section 438 CrPC (Anticipatory Bail qualifications)",
      ],
      precedents: [
        {
          title: "Ramesh Sen v. Cyber Police cell (2022)",
          citation: "2022 SCC Online DL 1492",
          relevance: "Anticipatory bail conditions in extortion allegations lacking trace of physical IP device custody.",
          matchScore: "91%",
        },
      ],
    },
  ];

  const loadData = async () => {
    try {
      const rawPetitions = await apiListPetitions();
      
      // Filter only petitions that have CNR issued (registered)
      const registeredPetitions = rawPetitions.filter((p: any) => p.cnr_number !== null && p.cnr_number !== "");
      
      const dbCases: CourtCase[] = registeredPetitions.map((p: any) => ({
        cnr: p.cnr_number,
        id: p.id,
        applicant: p.citizen_name || "Aditya Patil",
        respondent: p.advocate_name ? `Adv. ${p.advocate_name}` : "Respondent Party",
        category: p.category,
        time: "12:00 PM",
        stage: p.status === "Disposed" ? "Disposed / Final Order" : "Hearing Active",
        summary: p.description,
        previousHearings: [
          { date: "Jul 16, 2026", summary: "Case officially registered at Registry. Scrutiny passed successfully." }
        ],
        applicableActs: [
          "Maharashtra Land Revenue Code, 1966 (Section 143)",
          "The Specific Relief Act, 1963 (Section 6)",
        ],
        precedents: [
          {
            title: "Vasant Rao v. State of Maharashtra (2018)",
            citation: "2018 SCC Online Bom 192",
            relevance: "Reaffirms land boundary guidelines.",
            matchScore: "94%"
          }
        ]
      }));

      const combined = [...dbCases];
      defaultMockCauseList.forEach((mock) => {
        if (!combined.some((c) => c.cnr === mock.cnr)) {
          combined.push(mock);
        }
      });

      setCauseList(combined);
      
      const loggedCaseCnrs = rawPetitions
        .filter((p: any) => p.status === "Disposed")
        .map((p: any) => p.cnr_number)
        .filter(Boolean);
      setCasesLogged(loggedCaseCnrs);

      if (combined.length > 0 && !combined.some(c => c.cnr === selectedCnr)) {
        setSelectedCnr(combined[0].cnr);
      }
    } catch (err) {
      console.error(err);
      setCauseList(defaultMockCauseList);
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

  const activeCase = causeList.find((c) => c.cnr === selectedCnr) || causeList[0] || defaultMockCauseList[0];

  const handlePassOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionNotes) return;
    setProcessingOrder(true);
    try {
      await apiSaveOrder(
        activeCase.id,
        activeCase.cnr,
        `Order of Admissibility - ${actionStatus}`,
        actionNotes,
        user?.id || "sandbox-id-judge"
      );
      await loadData();
      setActionNotes("");
      alert(`Order logged: ${actionStatus}. Notification dispatched to litigating parties.`);
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingOrder(false);
    }
  };

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
            <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center font-bold text-purple-400">
              JO
            </div>
            <div>
              <p className="font-bold text-slate-200">Hon. Judge Patil</p>
              <p className="text-[10px] text-slate-500">Civil & Criminal Bench</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            <button
              className="w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold bg-yellow-500 text-slate-950 text-left"
            >
              <Calendar className="w-4 h-4" />
              Today's Cause List
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
              <Gavel className="w-5 h-5 text-yellow-500" />
              Judicial Cause Bench
            </h1>
            <p className="text-slate-400 text-xs">Access today's scheduled hearings, view automated brief digests, and record official court orders.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-yellow-500 flex items-center gap-1.5 font-bold">
              ⚖️ Court Room 4 Active
            </span>
          </div>
        </div>

        {/* Human Authority Guard Alert */}
        <div className="p-3.5 bg-yellow-500/5 border border-yellow-500/25 rounded-2xl flex items-start gap-3">
          <Shield className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-normal">
            <strong className="text-yellow-500">Judicial Independence Guard:</strong> AI extracts summaries and locates precedent citations solely as an advice model. Under Article 50, all final verdicts, decrees, bail admissions, or hearing adjournments are executed exclusively by the presiding judicial officer.
          </p>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CAUSE LIST INDEX */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-300">Cause Ledger ({causeList.length})</h3>
            <div className="space-y-3">
              {causeList.map((c) => {
                const isSelected = selectedCnr === c.cnr;
                const isLogged = casesLogged.includes(c.cnr);
                return (
                  <div
                    key={c.cnr}
                    onClick={() => setSelectedCnr(c.cnr)}
                    className={`p-4 rounded-xl border cursor-pointer text-left transition-all ${
                      isSelected
                        ? "bg-slate-900 border-yellow-500/60 shadow-lg scale-102"
                        : "bg-slate-900/40 border-slate-850 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-bold text-slate-500">{c.time}</span>
                      {isLogged && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-bold">
                          ✓ Order Recorded
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-200 mt-1">{c.applicant} v. {c.respondent.split("/")[0]}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{c.category}</p>
                    <div className="mt-2.5 flex justify-between items-center text-[10px] text-slate-400">
                      <span className="text-[9px] text-yellow-500">{c.cnr}</span>
                      <span>{c.stage}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT workspace detail sheet */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 glass-panel">
              
              {/* Tabs */}
              <div className="flex gap-4 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setActiveSubTab("brief")}
                  className={`pb-1 font-bold text-xs border-b-2 transition-all ${
                    activeSubTab === "brief"
                      ? "border-yellow-500 text-slate-100"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  AI Case Brief & Precedents
                </button>
                <button
                  onClick={() => setActiveSubTab("evidence")}
                  className={`pb-1 font-bold text-xs border-b-2 transition-all ${
                    activeSubTab === "evidence"
                      ? "border-yellow-500 text-slate-100"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Evidence & Filings
                </button>
                <button
                  onClick={() => setActiveSubTab("orders")}
                  className={`pb-1 font-bold text-xs border-b-2 transition-all ${
                    activeSubTab === "orders"
                      ? "border-yellow-500 text-slate-100"
                      : "border-transparent text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Log Bench Orders
                </button>
              </div>

              {/* Dynamic Sub-tab views */}
              <AnimatePresence mode="wait">
                {activeSubTab === "brief" && (
                  <motion.div
                    key="brief"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    {/* Case summary */}
                    <div className="space-y-2">
                      <p className="text-slate-400 font-semibold">AI Digest Summary:</p>
                      <p className="text-xs text-slate-300 bg-slate-950/40 p-4 rounded-xl border border-slate-850 leading-relaxed">
                        {activeCase.summary}
                      </p>
                    </div>

                    {/* Hearing histories */}
                    <div className="space-y-2.5">
                      <p className="text-slate-400 font-semibold">Prior Hearing Timelines:</p>
                      <div className="space-y-2">
                        {activeCase.previousHearings.map((h, i) => (
                          <div key={i} className="flex gap-4 p-3 bg-slate-950/20 border border-slate-850 rounded-lg text-xs">
                            <span className="text-yellow-500 font-bold shrink-0">{h.date}</span>
                            <span className="text-slate-400">{h.summary}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Statutes */}
                    <div className="space-y-2">
                      <p className="text-slate-400 font-semibold">Identified Codes / Applicable Acts:</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {activeCase.applicableActs.map((act) => (
                          <span key={act} className="px-2.5 py-1 rounded bg-slate-950 border border-slate-850 text-slate-300">
                            📕 {act}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Precedent citations */}
                    <div className="space-y-3">
                      <p className="text-slate-400 font-semibold">Similar Precedents Finder (Gemini Search):</p>
                      <div className="space-y-3 text-xs">
                        {activeCase.precedents.map((prec, i) => (
                          <div key={i} className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl space-y-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-slate-200">{prec.title}</h5>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{prec.citation}</p>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[9px] border border-emerald-500/20">
                                Match Relevance: {prec.matchScore}
                              </span>
                            </div>
                            <p className="text-slate-400 leading-normal">
                              {prec.relevance}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSubTab === "evidence" && (
                  <motion.div
                    key="evidence"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <p className="text-slate-400 font-semibold">Filing attachments ledger:</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-300">boundary_dispute_appeal.pdf</p>
                          <p className="text-[10px] text-slate-500">Certified Petition Copy</p>
                        </div>
                        <button className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-yellow-500 rounded text-[10px]">
                          View
                        </button>
                      </div>

                      <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between">
                        <div>
                          <p className="font-bold text-slate-300">land_records_survey_1989.pdf</p>
                          <p className="text-[10px] text-slate-500">Deed Annexure File</p>
                        </div>
                        <button className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-yellow-500 rounded text-[10px]">
                          View
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-950 border border-slate-850 rounded-2xl text-center text-slate-500 text-xs">
                      Integrate with PDF viewer slot to view raw documents on this panel.
                    </div>
                  </motion.div>
                )}

                {activeSubTab === "orders" && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4 text-xs sm:text-sm"
                  >
                    <h4 className="font-bold text-slate-200">Log bench order decree</h4>

                    <form onSubmit={handlePassOrder} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400 font-semibold">Order Action</label>
                          <select
                            value={actionStatus}
                            onChange={(e) => setActionStatus(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                          >
                            <option>Passed (Temporary Injunction)</option>
                            <option>Adjourned (Next date verification)</option>
                            <option>Disposed (Verdict final)</option>
                            <option>Returned (Registry corrections)</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400 font-semibold">Next hearing date (if adjourned)</label>
                          <input
                            type="date"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400 font-semibold">Decree Notes / Judicial Directives</label>
                        <textarea
                          rows={4}
                          required
                          value={actionNotes}
                          onChange={(e) => setActionNotes(e.target.value)}
                          placeholder="Type orders Passed during session..."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={processingOrder}
                          className="px-5 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-lg"
                        >
                          {processingOrder ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" /> Recording Decree...
                            </>
                          ) : (
                            <>Sign and Log bench order</>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
