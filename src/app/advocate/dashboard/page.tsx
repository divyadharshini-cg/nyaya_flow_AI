"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  FileText,
  UserCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  LogOut,
  Calendar,
  AlertCircle,
  Shield,
  Briefcase,
  Check,
  User,
  MapPin,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { apiListPetitions, apiUpdatePetitionAdvocate } from "@/utils/api";
import AssistantSidebar from "@/components/assistant-sidebar";
import TiltCard from "@/components/tilt-card";
import RippleWrapper from "@/components/ripple-wrapper";

interface MatchRequest {
  id: string;
  litigant: string;
  category: string;
  date: string;
  summary: string;
  suggestedCourt: string;
  relevanceMatch: string;
  status: string;
}

export default function AdvocateDashboard() {
  const [selectedCaseId, setSelectedCaseId] = useState("req-01");
  const [acceptedRequests, setAcceptedRequests] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [matchRequests, setMatchRequests] = useState<MatchRequest[]>([]);

  const defaultMockRequests: MatchRequest[] = [
    {
      id: "req-01",
      litigant: "Aditya Patil",
      category: "Property & Land Dispute (Civil)",
      date: "Jul 16, 2026",
      summary:
        "Claiming partition encroachment on a 7/12 mutation survey plot #142 in Kothrud, Pune. Neighbor constructed a partition masonry boundary wall violating survey drawings. Injunction needed.",
      suggestedCourt: "Sub-Divisional Magistrate Court, Pune",
      relevanceMatch: "92% match - You have settled 42 civil property disputes in Pune SDM Court.",
      status: "Awaiting Advocate Confirmation",
    },
    {
      id: "req-02",
      litigant: "Ramesh Iyer",
      category: "Consumer Contract Dispute",
      date: "Jul 14, 2026",
      summary:
        "Filing a claim against an electronic dealer for supplying a defective home generator and failing to refund booking deposit. Case values Rs 1.8 Lakhs under Consumer Protection Act.",
      suggestedCourt: "District Consumer Disputes Redressal Commission, Pune",
      relevanceMatch: "85% match - Matches your secondary practice area (Commercial Consumer disputes).",
      status: "Awaiting Advocate Confirmation",
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }

    const loadCases = async () => {
      try {
        const rawPetitions = await apiListPetitions();
        // Map database petitions where status is pending or matched
        const dbRequests: MatchRequest[] = rawPetitions
          .filter((p: any) => p.status === "Scrutiny Pending" || p.advocate_id === user?.id)
          .map((p: any) => ({
            id: p.id,
            litigant: p.citizen_name || "Citizen / Litigant",
            category: p.category,
            date: p.created_at ? new Date(p.created_at).toLocaleDateString() : "Jul 18, 2026",
            summary: p.description,
            suggestedCourt: p.suggested_court || "Sub-Divisional Magistrate Court",
            relevanceMatch: p.ai_confidence ? `${p.ai_confidence} Match - Suggested court aligns with specialization.` : "90% match",
            status: p.status === "Scrutiny Pending" ? "Awaiting Advocate Confirmation" : p.status,
          }));
        
        // Merge without duplicate IDs
        const combined = [...dbRequests];
        defaultMockRequests.forEach(mock => {
          if (!combined.some(c => c.id === mock.id)) {
            combined.push(mock);
          }
        });
        setMatchRequests(combined);
        if (combined.length > 0) {
          setSelectedCaseId(combined[0].id);
        }
      } catch (err) {
        console.error(err);
        setMatchRequests(defaultMockRequests);
      }
    };

    loadCases();
  }, [user]);

  const selectedRequest = matchRequests.find((r) => r.id === selectedCaseId) || matchRequests[0] || defaultMockRequests[0];

  const handleAcceptRequest = async () => {
    setActionLoading(true);
    try {
      await apiUpdatePetitionAdvocate(selectedRequest.id, user?.id || "89121500-0000-4444-8888-999900000002");
      setAcceptedRequests([...acceptedRequests, selectedRequest.id]);
      alert("Representation request accepted. A notifications packet has been dispatched to the litigant.");
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-805 dark:text-slate-100 text-xs sm:text-sm">
      
      {/* AI Assistant Sidebar */}
      <AssistantSidebar role="advocate" />

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
            <div className="w-9 h-9 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center font-bold text-yellow-500">
              AD
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-700 dark:text-slate-200">{user?.full_name || "Adv. A. Deshmukh"}</p>
              <p className="text-[10px] text-slate-400">Bar Council Reg: 8912/15</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 rounded-xl flex items-center gap-3 font-semibold bg-yellow-500 border border-yellow-405 text-slate-950 text-left shadow-lg shadow-yellow-500/10"
            >
              <Scale className="w-4 h-4" />
              Litigant Match Requests
            </motion.button>
          </nav>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/5">
          <Link href="/auth">
            <motion.div
              whileHover={{ scale: 1.01, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 rounded-xl flex items-center gap-3 text-slate-400 hover:text-red-400 transition-all font-semibold cursor-pointer border border-transparent"
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
              <Scale className="w-5 h-5 text-yellow-500" />
              Advocate Representation Panel
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Review case filings suggested by the NyayaFlow matching recommender, accept litigant requests, and download dossiers.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-white/40 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 text-[10px] text-yellow-600 dark:text-yellow-550 flex items-center gap-1.5 font-bold shadow-inner">
              ⚖️ Bar Association: Maharashtra
            </span>
          </div>
        </motion.div>

        {/* Human Agency Alert */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex items-start gap-3.5 text-left"
        >
          <Shield className="w-4.5 h-4.5 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong className="text-yellow-600 dark:text-yellow-500">Autonomous Mandate:</strong> NyayaFlow matches profiles based on experience, language, and district bounds. The AI will never auto-assign or bind counsel. Representation is sealed only when the advocate confirms.
          </p>
        </motion.div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INCOMING MATCH REQUESTS LIST */}
          <div className="lg:col-span-4 space-y-4 text-left">
            <h3 className="text-sm font-bold text-slate-600 dark:text-slate-350 px-1">Representation Requests ({matchRequests.length})</h3>
            <div className="space-y-3">
              {matchRequests.map((req) => {
                const isSelected = selectedCaseId === req.id;
                const isAccepted = acceptedRequests.includes(req.id);
                return (
                  <TiltCard key={req.id}>
                    <div
                      onClick={() => setSelectedCaseId(req.id)}
                      className={`p-4 rounded-2xl border cursor-pointer text-left transition-all ${
                        isSelected
                          ? "bg-white dark:bg-slate-900/45 border-yellow-500/60 shadow-lg scale-102"
                          : "bg-white/40 dark:bg-slate-955/30 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono text-slate-500 font-semibold">{req.date}</span>
                        {isAccepted && (
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-extrabold border border-emerald-500/20">
                            ✓ Accepted
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-805 dark:text-slate-200 mt-1.5">{req.litigant}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">{req.category}</p>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>

          {/* RIGHT: DETAILS PANEL */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedCaseId}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl space-y-6 glass-panel text-left"
              >
                <div className="flex justify-between items-start border-b border-black/5 dark:border-white/5 pb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-yellow-605 dark:text-yellow-500 uppercase tracking-wider">
                      Request ID: {selectedRequest.id}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-808 dark:text-slate-100 mt-1.5">
                      Litigant: {selectedRequest.litigant}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedRequest.category}</p>
                  </div>
                  <span className="px-3 py-1 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-450 border border-yellow-500/20 text-[10px] font-bold">
                    {selectedRequest.status}
                  </span>
                </div>

                {/* Dispute narrative */}
                <div className="space-y-2">
                  <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Litigant Case Narrative Summary:</p>
                  <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed bg-white/60 dark:bg-slate-950/40 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                    {selectedRequest.summary}
                  </p>
                </div>

                {/* Match Reason */}
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl space-y-1 text-xs">
                  <p className="font-bold text-emerald-600 dark:text-emerald-450 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <UserCheck className="w-4.5 h-4.5 text-emerald-555" /> AI Matching Analytics
                  </p>
                  <p className="text-slate-505 dark:text-slate-400 leading-normal">{selectedRequest.relevanceMatch}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                  <div>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Suggested Appellate Court:</p>
                    <p className="text-slate-805 dark:text-slate-200 font-bold flex items-center gap-1.5 mt-1 text-xs sm:text-sm">
                      <MapPin className="w-4 h-4 text-yellow-500" />
                      {selectedRequest.suggestedCourt}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Filing Date Proposal:</p>
                    <p className="text-slate-805 dark:text-slate-200 font-bold flex items-center gap-1.5 mt-1 text-xs sm:text-sm">
                      <Calendar className="w-4 h-4 text-yellow-500" /> Immediate / Next Board Session
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-5 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <p className="text-[10px] text-slate-500 max-w-sm text-center sm:text-left leading-normal">
                    Click 'Accept Representation' to accept. The litigant will receive an SMS and email notification confirming your counsel registration.
                  </p>

                  {acceptedRequests.includes(selectedRequest.id) ? (
                    <div className="flex gap-2.5 items-center text-emerald-600 dark:text-emerald-455 font-bold text-xs sm:text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Case Representation Active
                    </div>
                  ) : (
                    <RippleWrapper>
                      <button
                        type="button"
                        onClick={handleAcceptRequest}
                        disabled={actionLoading}
                        className="px-5 py-3 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold rounded-xl flex items-center gap-1 cursor-pointer shadow-md"
                      >
                        {actionLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" /> Transmitting...
                          </>
                        ) : (
                          <>Accept Representation</>
                        )}
                      </button>
                    </RippleWrapper>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
