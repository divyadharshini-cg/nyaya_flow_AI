"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
            <div className="w-9 h-9 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center font-bold text-yellow-500">
              AD
            </div>
            <div>
              <p className="font-bold text-slate-200">Adv. A. Deshmukh</p>
              <p className="text-[10px] text-slate-500">Bar Council Reg: 8912/15</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            <button className="w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold bg-yellow-500 text-slate-950 text-left">
              <Scale className="w-4 h-4" />
              Litigant Match Requests
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
              <Scale className="w-5 h-5 text-yellow-500" />
              Advocate Representation Panel
            </h1>
            <p className="text-slate-400 text-xs">Review case filings suggested by the NyayaFlow matching recommender, accept litigant requests, and download dossiers.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-yellow-500 flex items-center gap-1.5 font-bold">
              ⚖️ Bar Association: Maharashtra
            </span>
          </div>
        </div>

        {/* Human Agency Alert */}
        <div className="p-3.5 bg-yellow-500/5 border border-yellow-500/25 rounded-2xl flex items-start gap-3">
          <Shield className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-normal">
            <strong className="text-yellow-500">Autonomous Mandate:</strong> NyayaFlow matches profiles based on experience, language, and district bounds. The AI will never auto-assign or bind counsel. Representation is sealed only when the advocate confirms.
          </p>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: INCOMING MATCH REQUESTS LIST */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-300">Representation Requests ({matchRequests.length})</h3>
            <div className="space-y-3">
              {matchRequests.map((req) => {
                const isSelected = selectedCaseId === req.id;
                const isAccepted = acceptedRequests.includes(req.id);
                return (
                  <div
                    key={req.id}
                    onClick={() => setSelectedCaseId(req.id)}
                    className={`p-4 rounded-xl border cursor-pointer text-left transition-all ${
                      isSelected
                        ? "bg-slate-900 border-yellow-500/60 shadow-lg scale-102"
                        : "bg-slate-900/40 border-slate-850 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[9px] font-mono text-slate-500">{req.date}</span>
                      {isAccepted && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[8px] font-bold">
                          ✓ Accepted
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-200 mt-1">{req.litigant}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{req.category}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: DETAILS PANEL */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 glass-panel">
              <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wide">
                    Request ID: {selectedRequest.id}
                  </span>
                  <h3 className="text-md font-bold text-slate-100 mt-1">
                    Litigant: {selectedRequest.litigant}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedRequest.category}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] font-bold">
                  {selectedRequest.status}
                </span>
              </div>

              {/* Dispute narrative */}
              <div className="space-y-2">
                <p className="text-slate-400 font-semibold">Litigant Case Narrative Summary:</p>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-850">
                  {selectedRequest.summary}
                </p>
              </div>

              {/* Match Reason */}
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-1 text-xs">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4" /> AI Matching Analytics
                </p>
                <p className="text-slate-400">{selectedRequest.relevanceMatch}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-500 font-semibold">Suggested Appellate Court:</p>
                  <p className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                    {selectedRequest.suggestedCourt}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold">Filing Date Proposal:</p>
                  <p className="text-slate-200 font-bold flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-yellow-500" /> Immediate / Next Board Session
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-center gap-4">
                <p className="text-[10px] text-slate-500 max-w-sm">
                  Click 'Accept Representation' to accept. The litigant will receive an SMS and email notification confirming your counsel registration.
                </p>

                {acceptedRequests.includes(selectedRequest.id) ? (
                  <div className="flex gap-2 items-center text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
                    <CheckCircle className="w-4 h-4" /> Case Representation Active
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleAcceptRequest}
                      disabled={actionLoading}
                      className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      {actionLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Transmitting...
                        </>
                      ) : (
                        <>Accept Representation</>
                      )}
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
