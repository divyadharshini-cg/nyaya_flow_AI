"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  ShieldAlert,
  Server,
  Activity,
  User,
  LogOut,
  RefreshCw,
  TrendingUp,
  Scale,
  Users,
  HardDrive,
  FileCheck,
  CheckCircle,
  Clock
} from "lucide-react";
import { apiListStats, apiListAuditLogs } from "@/utils/api";
import AssistantSidebar from "@/components/assistant-sidebar";
import TiltCard from "@/components/tilt-card";
import RippleWrapper from "@/components/ripple-wrapper";

interface AuditLog {
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  status: string;
  ip: string;
}

export default function AdminDashboard() {
  const [telemetryNode, setTelemetryNode] = useState("all-nodes");
  const [stats, setStats] = useState<any>({
    active_cases: 148209,
    disposed_cases: 392019,
    pending_cases: 412,
    mean_resolution_speed: "5.2 Mo",
  });
  const [logs, setLogs] = useState<AuditLog[]>([]);

  const defaultMockLogs: AuditLog[] = [
    {
      timestamp: "2026-07-18 18:04:12",
      actor: "Registrar Clerk RC-01",
      role: "Registrar",
      action: "Linked physical files folder barcode NF-BAR-4912019 to Box 109",
      status: "Success",
      ip: "10.0.4.12",
    },
    {
      timestamp: "2026-07-18 17:55:01",
      actor: "Hon. Judge Patil",
      role: "Judge",
      action: "Recorded bench order Passed civil decree case MHPU02-89210-2026",
      status: "Success",
      ip: "10.0.1.49",
    },
    {
      timestamp: "2026-07-18 17:42:30",
      actor: "Inspector S. Kadam",
      role: "Police",
      action: "Mapped Section 305 BNS to FIR reference and transmitted files",
      status: "Success",
      ip: "10.12.8.21",
    },
    {
      timestamp: "2026-07-18 17:30:15",
      actor: "Litigant Aditya Patil",
      role: "Citizen",
      action: "Filing new petition, OCR health score processed: 88%",
      status: "Success",
      ip: "192.168.1.104",
    },
    {
      timestamp: "2026-07-18 17:05:00",
      actor: "System Administrator",
      role: "Admin",
      action: "Database sync completed with Supabase sovereign secondary",
      status: "Success",
      ip: "10.0.99.1",
    },
  ];

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const statsData = await apiListStats();
        if (statsData) {
          setStats(statsData);
        }
        
        const rawLogs = await apiListAuditLogs();
        const mappedLogs: AuditLog[] = rawLogs.map((l: any) => ({
          timestamp: l.timestamp ? new Date(l.timestamp).toLocaleString() : "2026-07-20 12:00:00",
          actor: l.actor || "System",
          role: l.role || "Admin",
          action: l.action,
          status: l.status || "Success",
          ip: l.ip_address || "127.0.0.1",
        }));

        // Merge mapped database logs and mock logs
        const combined = [...mappedLogs];
        defaultMockLogs.forEach(mock => {
          if (!combined.some(c => c.action === mock.action)) {
            combined.push(mock);
          }
        });
        setLogs(combined);
      } catch (err) {
        console.error(err);
        setLogs(defaultMockLogs);
      }
    };

    loadAdminData();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" as const }
    })
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-805 dark:text-slate-100 text-xs sm:text-sm">
      
      {/* AI Assistant Sidebar */}
      <AssistantSidebar role="admin" />

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
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-bold text-amber-500">
              SA
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-700 dark:text-slate-200">System Admin</p>
              <p className="text-[10px] text-slate-405">Sovereign Controls</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 rounded-xl flex items-center gap-3 font-semibold bg-yellow-500 border border-yellow-405 text-slate-950 text-left shadow-lg shadow-yellow-500/10"
            >
              <Activity className="w-4 h-4" />
              Platform Telemetry
            </motion.button>
          </nav>
        </div>

        <div className="pt-4 border-t border-black/5 dark:border-white/5">
          <Link href="/auth">
            <motion.div
              whileHover={{ scale: 1.01, backgroundColor: "rgba(239, 68, 68, 0.05)" }}
              whileTap={{ scale: 0.99 }}
              className="w-full p-3 rounded-xl flex items-center gap-3 text-slate-405 hover:text-red-500 transition-all font-semibold cursor-pointer border border-transparent"
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
              <Database className="w-5 h-5 text-amber-550" />
              Sovereign Administration Console
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs">Monitor sovereign server loads, review database audit trails, and inspect caseload statistics.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-white/40 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 text-[10px] text-emerald-600 dark:text-emerald-455 flex items-center gap-1.5 font-bold shadow-inner">
              <Server className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              Database Health: 100% Operational
            </span>
          </div>
        </motion.div>

        {/* Audit Notification Banner */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-yellow-500/5 border border-yellow-500/15 rounded-2xl flex items-start gap-3.5 text-left"
        >
          <ShieldAlert className="w-4.5 h-4.5 text-yellow-550 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong className="text-yellow-600 dark:text-yellow-500">Sovereign Compliance:</strong> NyayaFlow telemetry tracks resource utilization and database writes. No citizen identity records (Aadhaar or biometric keys) are stored on public servers. Encryption keys are self-contained.
          </p>
        </motion.div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              title: "Total Active Cases",
              value: stats?.active_cases !== undefined ? Number(stats.active_cases).toLocaleString() : "1,48,209",
              indicator: <span className="text-[9px] text-emerald-500 dark:text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> +4.2% this month</span>
            },
            {
              title: "Disposed / Resolved",
              value: stats?.disposed_cases !== undefined ? Number(stats.disposed_cases).toLocaleString() : "3,92,019",
              indicator: <span className="text-[9px] text-slate-500 dark:text-slate-450">Total lifetime platform</span>,
              emerald: true
            },
            {
              title: "Pending Scrutiny",
              value: stats?.pending_cases !== undefined ? Number(stats.pending_cases).toLocaleString() : "412",
              indicator: <span className="text-[9px] text-yellow-600 dark:text-yellow-500">Action required (Registrar)</span>,
              gold: true
            },
            {
              title: "Mean Resolution Speed",
              value: stats?.mean_resolution_speed || "5.2 Mo",
              indicator: <span className="text-[9px] text-emerald-500 dark:text-emerald-400">Decreased from 18 Mo</span>
            }
          ].map((card, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -3 }}
              className="p-4 bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-2xl glass-panel text-left space-y-1"
            >
              <p className="text-slate-500 font-bold uppercase text-[9px] tracking-wider">{card.title}</p>
              <p className={`text-2xl font-black ${card.emerald ? "text-emerald-500" : (card.gold ? "text-yellow-500" : "text-slate-800 dark:text-slate-100")}`}>{card.value}</p>
              {card.indicator}
            </motion.div>
          ))}
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* LEFT: WORKLOAD CHART */}
          <div className="lg:col-span-6 bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-xl space-y-4 glass-panel">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Monthly Caseload & Resolution Velocity</h3>
              <p className="text-slate-500 text-[10px]">Comparative filing rates and processing outputs over past months</p>
            </div>

            {/* Custom SVG chart line */}
            <div className="h-48 w-full flex items-center justify-center relative">
              <svg viewBox="0 0 300 120" className="w-full h-full stroke-slate-550 dark:stroke-slate-700 fill-none" strokeWidth="1">
                <line x1="30" y1="20" x2="280" y2="20" stroke="rgba(0,0,0,0.02)" />
                <line x1="30" y1="50" x2="280" y2="50" stroke="rgba(0,0,0,0.02)" />
                <line x1="30" y1="80" x2="280" y2="80" stroke="rgba(0,0,0,0.02)" />
                <line x1="30" y1="100" x2="280" y2="100" stroke="rgba(0,0,0,0.04)" />
                
                <line x1="30" y1="10" x2="30" y2="100" stroke="rgba(0,0,0,0.08)" />
                <line x1="30" y1="100" x2="280" y2="100" stroke="rgba(0,0,0,0.08)" />

                {/* Line 1: Filings */}
                <motion.path
                  d="M 30 90 L 70 80 L 110 50 L 150 40 L 190 70 L 230 45 L 280 20"
                  stroke="#eab308"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                
                {/* Line 2: Resolutions */}
                <motion.path
                  d="M 30 95 L 70 88 L 110 70 L 150 55 L 190 40 L 230 35 L 280 15"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeInOut" }}
                />

                <circle cx="280" cy="20" r="3.5" fill="#eab308" />
                <circle cx="280" cy="15" r="3.5" fill="#10b981" />

                <text x="5" y="24" fill="#475569" fontSize="7" fontWeight="bold">150k</text>
                <text x="5" y="54" fill="#475569" fontSize="7" fontWeight="bold">100k</text>
                <text x="5" y="84" fill="#475569" fontSize="7" fontWeight="bold">50k</text>
                
                <text x="65" y="112" fill="#475569" fontSize="7" fontWeight="bold">Jan</text>
                <text x="105" y="112" fill="#475569" fontSize="7" fontWeight="bold">Mar</text>
                <text x="145" y="112" fill="#475569" fontSize="7" fontWeight="bold">May</text>
                <text x="185" y="112" fill="#475569" fontSize="7" fontWeight="bold">Jul</text>
                <text x="225" y="112" fill="#475569" fontSize="7" fontWeight="bold">Sep</text>
                <text x="270" y="112" fill="#475569" fontSize="7" fontWeight="bold">Dec</text>
              </svg>
            </div>

            <div className="flex gap-6 items-center text-[10px] text-slate-500 justify-center font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> New Cases Filed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Cases Resolved
              </span>
            </div>
          </div>

          {/* RIGHT: SYSTEM HOSTS NODES */}
          <div className="lg:col-span-6 bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-xl space-y-4 glass-panel">
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Active Server Clusters</h3>
            <p className="text-slate-505 text-[10px]">Security state and server loads of self-contained local clusters</p>

            <div className="space-y-3">
              {[
                { name: "Sovereign Primary DB Node (PostgreSQL)", usage: "42% Load", status: "Active", ip: "10.0.1.5", active: true },
                { name: "Gemini Advisory Inference Microservice", usage: "18% Load", status: "Active", ip: "10.0.1.20", active: true },
                { name: "OCR Document Scanners Node", usage: "0% Load", status: "Standby", ip: "10.0.2.14" }
              ].map((server, idx) => (
                <TiltCard key={idx}>
                  <div className="p-3.5 bg-white/60 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-2xl flex items-center justify-between text-xs flex-wrap gap-3">
                    <div className="flex gap-3 items-center">
                      <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-705 dark:text-slate-200">{server.name}</p>
                        <p className="text-[10px] text-slate-455 dark:text-slate-500 mt-0.5">IP: {server.ip} | Telemetry: {server.usage}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-lg text-[9px] font-bold border ${
                      server.active 
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 animate-pulse" 
                        : "bg-slate-900 text-slate-450 border-white/5"
                    }`}>
                      {server.status}
                    </span>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>

        </div>

        {/* BOTTOM: SYSTEM AUDIT LOG LEDGER */}
        <div className="bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-3xl p-6 shadow-xl space-y-4 glass-panel text-left">
          <div>
            <h3 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Sovereign Audit Ledger</h3>
            <p className="text-slate-505 text-[10px]">Sovereign audit logging records of database writes and nodes access history</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] text-slate-655 dark:text-slate-300">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/5 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Access Badge</th>
                  <th className="py-3 px-4">Node / Role</th>
                  <th className="py-3 px-4">Action Event Description</th>
                  <th className="py-3 px-4 text-right">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/5">
                {logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-200">{log.actor}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-black/5 dark:bg-slate-950 border border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-450 font-bold">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{log.action}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-605 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
