"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Sparkles, User, Brain, CornerDownLeft } from "lucide-react";
import RippleWrapper from "@/components/ripple-wrapper";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export default function AssistantSidebar({ role = "citizen" }: { role?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Role-specific introductory messages and prompts
  const initialMessagesByRole: Record<string, string> = {
    citizen: "Hello! I am your NyayaFlow AI assistant. I can help guide you through the process of filing a new petition, check your document OCR compliance, or match you with a certified advocate. How can I help you today?",
    advocate: "Welcome back, Counsel. I've analyzed your current representation briefs. I can review matching scores, check for overlapping case summaries, or suggest formatting layouts. What would you like to review?",
    police: "Officer, active investigation assistance is online. I can help suggest applicable BNS penal code mappings based on your incident narratives, or verify digital hashes for uploaded evidence files.",
    registrar: "Registry Auditor tool initialized. I can help verify OCR scan thresholds, flag potential duplicate filings across subordinate courts, or help document physical archival box codes.",
    judge: "presiding Judicial Assistant active. I can help draft automated summaries, search semantic matches for case precedents, or verify applicable statutes for active cause lists.",
    admin: "Sovereign Administrator console telemetry link is active. I can help analyze postgres cluster nodes, review system audit logging events, or check monthly caseload status.",
  };

  const suggestionsByRole: Record<string, string[]> = {
    citizen: ["How to file a property dispute?", "What is a CNR number?", "How do I choose an advocate?"],
    advocate: ["Verify document overlap rules", "Explain match score factors", "Review partition deed formats"],
    police: ["BNS Codes for cyber theft", "Explain evidence digital hashes", "How to submit chargesheets?"],
    registrar: ["Verify OCR scan safety limits", "Flag duplicate case rules", "Archive location codes"],
    judge: ["Analyze precedents match scores", "Show MLRC Section 143 cases", "Draft temporary injunction brief"],
    admin: ["Show PostgreSQL cluster status", "Analyze system load charts", "Audit security alerts log"],
  };

  const answersByRole: Record<string, Record<string, string>> = {
    citizen: {
      "How to file a property dispute?": "To file a property dispute, enter your personal details in Step 1, describe the boundary issue in Step 2, select an advocate in Step 3, download templates in Step 4, and run the AI OCR document audit in Step 5 before sending it to the registry.",
      "What is a CNR number?": "A CNR (Case Number Record) is a unique 16-character code assigned to every filing in Indian courts. It allows tracking the live pipeline status, assigned judges, and cause hearings from any device.",
      "How do I choose an advocate?": "NyayaFlow matches you with certified advocates in your district who specialize in civil/property code and have successfully resolved similar boundary partition disputes.",
    },
    advocate: {
      "Verify document overlap rules": "NyayaFlow checks the database for overlapping text. Overlaps above 90% are flagged as potential duplicate filings, allowing you to reconcile claims prior to registrar scrutiny.",
      "Explain match score factors": "Matching is based on district boundary overlap, matching practice areas (e.g., civil partition law), availability status, and historic case records within that subordinate court.",
      "Review partition deed formats": "Official formats require survey descriptions of boundary coordinates, Talathi mutation record sheets as 'Schedule A', and signature confirmation in the presence of a notary public.",
    },
    police: {
      "BNS Codes for cyber theft": "For cyber theft, cheating by impersonation is covered under Section 318 BNS, while identity theft is prosecuted under Section 66D of the Information Technology Act.",
      "Explain evidence digital hashes": "When files are uploaded, a local SHA256 checksum is calculated. This creates a secure digital signature to ensure files are not modified, verifying the chain of custody for court admissibilities.",
      "How to submit chargesheets?": "Input victim names, outline details of incident narrative, run AI BNS suggest tools, map verified sections to the case, upload evidence, and tap 'Confirm & Transmit' to lock and send.",
    },
    registrar: {
      "Verify OCR scan safety limits": "The safety target limit is set to 85% score. Scores below 85% indicate poor scanned file resolutions, missing boundary maps, or signature discrepancy warnings, and must be returned.",
      "Flag duplicate case rules": "Any case overlapping substantially with pending files or active police FIR registries will trigger red flags. Registrars review details on the right panel to confirm admissions.",
      "Archive location codes": "Physical archive links are stored in Building, Floor, Room, Rack, Box, and shelf segments, with barcode index configurations supporting paper file retrieval.",
    },
    judge: {
      "Analyze precedents match scores": "AI semantic model compares the case narrative text with High Court databases. Scores above 90% represent highly relevant precedent decrees on similar land boundaries or partition suits.",
      "Show MLRC Section 143 cases": "Section 143 of the Maharashtra Land Revenue Code governs right of way over land borders. Relevant precedents state that established talathi partition maps outline boundary parameters.",
      "Draft temporary injunction brief": "Under CPC Order 39 Rules 1 & 2, temporary injunctions are admissible if a prima facie boundary encroachment is confirmed, showing threat of irreparable loss to partition layouts.",
    },
    admin: {
      "Show PostgreSQL cluster status": "Database clusters are currently running at 42% CPU load. Automatic read-replica sync loops are 100% operational with no latency alerts.",
      "Analyze system load charts": " Caseload volumes peak mid-week, matching subordinate registry schedules. Memory capacity remains stabilized under Next.js server limits.",
      "Audit security alerts log": "All access tokens are valid. Audit ledger records indicate 0 unauthorized access attempts, and RLS data constraints are strictly validated.",
    },
  };

  useEffect(() => {
    // Load initial message
    setMessages([
      {
        id: "init",
        sender: "ai",
        text: initialMessagesByRole[role] || initialMessagesByRole.citizen,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  }, [role]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const roleAnswers = answersByRole[role] || answersByRole.citizen;
      let replyText = "I'm processing that question. Could you clarify your request?";
      
      // Exact match or fallback response
      if (roleAnswers[textToSend]) {
        replyText = roleAnswers[textToSend];
      } else {
        replyText = `Based on your role as ${role.toUpperCase()}, you can use the dashboard options to manage cases. Let me know if you would like me to explain standard procedures.`;
      }

      const aiReply: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <RippleWrapper>
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-500 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.4)] border border-yellow-400 cursor-pointer"
          >
            {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 animate-pulse" />}
          </motion.button>
        </RippleWrapper>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            className="fixed top-20 right-6 bottom-24 w-80 sm:w-96 glass-panel border border-white/10 rounded-3xl z-40 flex flex-col shadow-2xl overflow-hidden backdrop-blur-2xl bg-slate-950/80"
          >
            {/* Header */}
            <div className="p-4 bg-slate-900/40 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs sm:text-sm text-slate-100 flex items-center gap-1.5">
                    NyayaFlow AI Assistant
                  </h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Active Counsel Mode</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-450 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[85%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border text-[10px] font-bold ${
                      msg.sender === "user"
                        ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                        : "bg-emerald-500/10 border-emerald-500/30 text-emerald-450"
                    }`}
                  >
                    {msg.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Brain className="w-3.5 h-3.5" />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-[11px] leading-relaxed text-left ${
                      msg.sender === "user"
                        ? "bg-yellow-500/10 border border-yellow-500/20 text-yellow-100 rounded-tr-none"
                        : "bg-slate-900/60 border border-white/5 text-slate-300 rounded-tl-none"
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[8px] text-slate-550 mt-1.5 text-right">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 max-w-[80%] mr-auto">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-450 text-[10px]">
                    <Brain className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-slate-900/60 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce delay-200" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !isTyping && (
              <div className="p-3 bg-slate-900/20 border-t border-white/5 space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-left pl-1">Suggested prompts</p>
                <div className="flex flex-col gap-1.5">
                  {(suggestionsByRole[role] || suggestionsByRole.citizen).map((sug) => (
                    <button
                      key={sug}
                      onClick={() => handleSend(sug)}
                      className="w-full p-2 rounded-xl bg-slate-950/40 border border-white/5 hover:border-yellow-500/30 text-[10px] text-slate-400 hover:text-yellow-500 text-left transition-colors font-medium"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 bg-slate-900/40 border-t border-white/5 flex gap-2">
              <input
                type="text"
                placeholder="Ask AI legal question..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend(inputVal);
                }}
                className="flex-1 bg-slate-950 border border-white/5 rounded-xl px-3 py-2 text-[11px] text-slate-200 focus:outline-none focus:border-yellow-500/50"
              />
              <RippleWrapper>
                <button
                  onClick={() => handleSend(inputVal)}
                  className="w-8 h-8 rounded-xl bg-yellow-500 text-slate-950 flex items-center justify-center cursor-pointer shadow-md hover:bg-yellow-450"
                >
                  <Send className="w-4 h-4" />
                </button>
              </RippleWrapper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
