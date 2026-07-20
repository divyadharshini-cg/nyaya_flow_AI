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
import AssistantSidebar from "@/components/assistant-sidebar";
import TiltCard from "@/components/tilt-card";
import RippleWrapper from "@/components/ripple-wrapper";

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
        user?.id || "sandbox-id-judge",
        `Order of Admissibility - ${actionStatus}`,
        actionNotes
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
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-805 dark:text-slate-100 text-xs sm:text-sm">
      
      {/* AI Assistant Sidebar */}
      <AssistantSidebar role="judge" />

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
            <div className="w-9 h-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center font-bold text-purple-500">
              JO
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-700 dark:text-slate-200">{user?.full_name || "Hon. Judge Patil"}</p>
              <p className="text-[10px] text-slate-400">Civil & Criminal Bench</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 rounded-xl flex items-center gap-3 font-semibold bg-yellow-500 border border-yellow-405 text-slate-955 text-left shadow-lg shadow-yellow-500/10"
            >
              <Calendar className="w-4 h-4" />
              Today's Cause List
            </motion.button>
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
              <Gavel className="w-5 h-5 text-yellow-500" />
              Judicial Cause Bench
            </h1>
            <p className="text-slate-505 dark:text-slate-400 text-xs">Access today's scheduled hearings, view automated brief digests, and record official court orders.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-white/40 dark:bg-slate-955/40 border border-black/5 dark:border-white/5 text-[10px] text-yellow-600 dark:text-yellow-500 flex items-center gap-1.5 font-bold shadow-inner">
              ⚖️ Court Room 4 Active
            </span>
          </div>
        </motion.div>

        {/* Human Authority Guard Alert */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-3.5 text-left"
        >
          <Shield className="w-4.5 h-4.5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong className="text-yellow-605 dark:text-yellow-500">Judicial Independence Guard:</strong> AI extracts summaries and locates precedent citations solely as an advice model. Under Article 50, all final verdicts, decrees, bail admissions, or hearing adjournments are executed exclusively by the presiding judicial officer.
          </p>
        </motion.div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT CAUSE LIST INDEX */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-350 px-1">Cause Ledger ({causeList.length})</h3>
            <div className="space-y-3">
              {causeList.map((c) => {
                const isSelected = selectedCnr === c.cnr;
                const isLogged = casesLogged.includes(c.cnr);
                return (
                  <TiltCard key={c.cnr}>
                    <div
                      onClick={() => setSelectedCnr(c.cnr)}
                      className={`p-4 rounded-2xl border cursor-pointer text-left transition-all ${
                        isSelected
                          ? "bg-white dark:bg-slate-900/40 border-yellow-500/60 shadow-lg scale-102"
                          : "bg-white/40 dark:bg-slate-955/30 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start flex-wrap gap-1">
                        <span className="text-[10px] text-slate-500 font-bold">{c.time}</span>
                        {isLogged && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-extrabold">
                            ✓ Order Recorded
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-805 dark:text-slate-202 mt-2">{c.applicant} v. {c.respondent}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">CNR: {c.cnr}</p>
                      <p className="text-[9px] text-yellow-600 dark:text-yellow-500 mt-2 font-bold">{c.stage}</p>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>

          {/* RIGHT DETAILS WORKSPACE */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCnr}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 glass-panel text-left"
              >
                {/* Selected case title header */}
                <div className="flex justify-between items-start border-b border-black/5 dark:border-white/5 pb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-yellow-605 dark:text-yellow-500 uppercase tracking-wider">
                      CNR Case File: {activeCase.cnr}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-808 dark:text-slate-100 mt-1.5">
                      {activeCase.applicant} v. {activeCase.respondent}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeCase.category} | Scheduled {activeCase.time}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-450 text-[10px] font-bold">
                    {activeCase.stage}
                  </span>
                </div>

                {/* Sub Tab buttons */}
                <div className="flex gap-2 border-b border-black/5 dark:border-white/5 pb-2 text-[11px] font-bold flex-wrap">
                  {[
                    { id: "brief", label: "AI Brief Digest", icon: FileText },
                    { id: "evidence", label: "Precedents & Laws", icon: BookOpen },
                    { id: "orders", label: "Record Bench Order", icon: FileCheck },
                  ].map((sub) => {
                    const Icon = sub.icon;
                    const isSubActive = activeSubTab === sub.id;
                    return (
                      <RippleWrapper key={sub.id}>
                        <button
                          onClick={() => setActiveSubTab(sub.id as any)}
                          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                            isSubActive
                              ? "bg-yellow-500 text-slate-950 shadow-md"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          {sub.label}
                        </button>
                      </RippleWrapper>
                    );
                  })}
                </div>

                {/* Sub Tab Panel Content */}
                <AnimatePresence mode="wait">
                  {activeSubTab === "brief" && (
                    <motion.div
                      key="brief-tab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">AI Case Brief Summary:</p>
                        <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed bg-white/60 dark:bg-slate-950/40 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                          {activeCase.summary}
                        </p>
                      </div>

                      {/* Timelines of registry hearings */}
                      <div className="space-y-3">
                        <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Registry History Audit Logs ({activeCase.previousHearings.length}):</p>
                        <div className="space-y-2">
                          {activeCase.previousHearings.map((h, i) => (
                            <div key={i} className="p-3.5 bg-white/60 dark:bg-slate-955/20 border border-black/5 dark:border-white/5 rounded-xl flex gap-3.5 items-start text-xs">
                              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-450 shrink-0 mt-0.5" />
                              <div>
                                <p className="font-bold text-slate-700 dark:text-slate-200">{h.date}</p>
                                <p className="text-slate-500 dark:text-slate-405 mt-1 leading-relaxed">{h.summary}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSubTab === "evidence" && (
                    <motion.div
                      key="evidence-tab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-5"
                    >
                      {/* Applicable statutes list */}
                      <div className="space-y-2">
                        <p className="text-slate-505 dark:text-slate-450 font-bold uppercase text-[10px] tracking-wider">AI Suggested Statutes & Sections:</p>
                        <div className="flex flex-wrap gap-2">
                          {activeCase.applicableActs.map((act) => (
                            <span
                              key={act}
                              className="px-2.5 py-1 rounded-lg bg-white/60 dark:bg-slate-950 border border-black/5 dark:border-white/5 text-[10px] text-slate-705 dark:text-slate-300 font-bold"
                            >
                              ⚖️ {act}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Precedents cards matching results */}
                      <div className="space-y-3">
                        <p className="text-slate-505 dark:text-slate-450 font-bold uppercase text-[10px] tracking-wider">Semantic Precedent Matches:</p>
                        <div className="grid grid-cols-1 gap-4">
                          {activeCase.precedents.map((pre, idx) => (
                            <TiltCard key={idx}>
                              <div className="p-4 bg-white/60 dark:bg-slate-955/20 border border-black/5 dark:border-white/5 rounded-2xl space-y-2.5 hover:border-yellow-500/30 transition-all shadow-inner">
                                <div className="flex justify-between items-start flex-wrap gap-2">
                                  <div>
                                    <h4 className="font-extrabold text-slate-700 dark:text-slate-200 text-xs sm:text-sm">{pre.title}</h4>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{pre.citation}</p>
                                  </div>
                                  <span className="px-2.5 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-450 text-[10px] font-black animate-pulse-gold">
                                    {pre.matchScore} Match Score
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-505 dark:text-slate-405 leading-relaxed bg-white/40 dark:bg-slate-900/40 p-3 rounded-xl border border-black/5 dark:border-white/5">
                                  <strong className="text-emerald-600 dark:text-emerald-450">Statutory Relevance:</strong> {pre.relevance}
                                </p>
                              </div>
                            </TiltCard>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeSubTab === "orders" && (
                    <motion.div
                      key="orders-tab"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <h4 className="font-bold text-slate-700 dark:text-slate-200 text-xs">Record Official bench Order</h4>
                      <p className="text-slate-505 dark:text-slate-450 text-[10px]">Provide brief notes for the official decree log. Transmits instantly to litigants.</p>
                      
                      {casesLogged.includes(activeCase.cnr) ? (
                        <div className="flex gap-2.5 items-center text-emerald-600 dark:text-emerald-455 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl shadow-lg">
                          <CheckCircle className="w-5 h-5 text-emerald-500" /> Court Order Disposed and Recorded. Notifications Transmitted.
                        </div>
                      ) : (
                        <form onSubmit={handlePassOrder} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="text-slate-550 dark:text-slate-450 font-bold text-[10px] uppercase">Bench Decision Action</label>
                            <select
                              value={actionStatus}
                              onChange={(e) => setActionStatus(e.target.value)}
                              className="w-full bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-808 dark:text-slate-100 text-xs font-semibold"
                            >
                              <option value="Passed">Decree Passed (Injunction Granted)</option>
                              <option value="Adjourned">Adjourned / Next Board Hearing</option>
                              <option value="Dismissed">Petition Dismissed</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-slate-555 dark:text-slate-455 font-bold text-[10px] uppercase">Bench Order Text Summary</label>
                            <textarea
                              rows={4}
                              value={actionNotes}
                              onChange={(e) => setActionNotes(e.target.value)}
                              placeholder="Record official brief order details to publish..."
                              required
                              className="w-full bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-2xl p-4 text-slate-808 dark:text-slate-100 text-xs focus:outline-none focus:border-yellow-500/60 transition-colors"
                            />
                          </div>

                          <div className="flex justify-end">
                            <RippleWrapper>
                              <button
                                type="submit"
                                disabled={processingOrder}
                                className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                              >
                                {processingOrder ? (
                                  <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Recording order...
                                  </>
                                ) : (
                                  <>Publish Court Order</>
                                )}
                              </button>
                            </RippleWrapper>
                          </div>
                        </form>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
