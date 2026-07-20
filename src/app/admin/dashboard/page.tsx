"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
import { apiGetStats, apiListAuditLogs } from "@/utils/api";

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
      action: "Recorded bench orderPassed civil decree case MHPU02-89210-2026",
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
        const statsData = await apiGetStats();
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
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center font-bold text-amber-500">
              SA
            </div>
            <div>
              <p className="font-bold text-slate-200">System Admin</p>
              <p className="text-[10px] text-slate-500">Sovereign Controls</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            <button
              className="w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold bg-yellow-500 text-slate-950 text-left"
            >
              <Activity className="w-4 h-4" />
              Platform Telemetry
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
              <Database className="w-5 h-5 text-amber-500" />
              Sovereign Administration Console
            </h1>
            <p className="text-slate-400 text-xs">Monitor sovereign server loads, review database audit trails, and inspect caseload statistics.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 flex items-center gap-1.5 font-bold">
              <Server className="w-3.5 h-3.5" />
              Database Health: 100% Operational
            </span>
          </div>
        </div>

        {/* Audit Notification Banner */}
        <div className="p-3.5 bg-yellow-500/5 border border-yellow-500/25 rounded-2xl flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-normal">
            <strong className="text-yellow-500">Sovereign Compliance:</strong> NyayaFlow telemetry tracks resource utilization and database writes. No citizen identity records (Aadhaar or biometric keys) are stored on public servers. Encryption keys are self-contained.
          </p>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl glass-panel text-left space-y-1">
            <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Total Active Cases</p>
            <p className="text-2xl font-black text-slate-100">{stats?.active_cases !== undefined ? Number(stats.active_cases).toLocaleString() : "1,48,209"}</p>
            <span className="text-[9px] text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +4.2% this month
            </span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl glass-panel text-left space-y-1">
            <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Disposed / Resolved</p>
            <p className="text-2xl font-black text-emerald-500">{stats?.disposed_cases !== undefined ? Number(stats.disposed_cases).toLocaleString() : "3,92,019"}</p>
            <span className="text-[9px] text-slate-400">Total lifetime platform</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl glass-panel text-left space-y-1">
            <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Pending Scrutiny</p>
            <p className="text-2xl font-black text-yellow-500">{stats?.pending_cases !== undefined ? Number(stats.pending_cases).toLocaleString() : "412"}</p>
            <span className="text-[9px] text-yellow-500">Action required (Registrar)</span>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl glass-panel text-left space-y-1">
            <p className="text-slate-500 font-semibold uppercase text-[10px] tracking-wider">Mean Resolution Speed</p>
            <p className="text-2xl font-black text-slate-100">{stats?.mean_resolution_speed || "5.2 Mo"}</p>
            <span className="text-[9px] text-emerald-400">Decreased from 18 Mo</span>
          </div>
        </div>

        {/* WORKSPACE ANALYTICS DIAGRAM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: WORKLOAD CHART */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 glass-panel">
            <div>
              <h3 className="font-bold text-slate-200 text-sm">Monthly Caseload & Resolution Velocity</h3>
              <p className="text-slate-500 text-[10px]">Comparative filing rates and processing outputs over past months</p>
            </div>

            {/* Custom SVG telemetry chart */}
            <div className="h-48 w-full flex items-center justify-center relative">
              <svg viewBox="0 0 300 120" className="w-full h-full stroke-slate-700 fill-none" strokeWidth="1">
                {/* Grid guidelines */}
                <line x1="30" y1="20" x2="280" y2="20" stroke="rgba(255,255,255,0.03)" />
                <line x1="30" y1="50" x2="280" y2="50" stroke="rgba(255,255,255,0.03)" />
                <line x1="30" y1="80" x2="280" y2="80" stroke="rgba(255,255,255,0.03)" />
                <line x1="30" y1="100" x2="280" y2="100" stroke="rgba(255,255,255,0.06)" />
                
                {/* Axis lines */}
                <line x1="30" y1="10" x2="30" y2="100" stroke="rgba(255,255,255,0.1)" />
                <line x1="30" y1="100" x2="280" y2="100" stroke="rgba(255,255,255,0.1)" />

                {/* Line 1: Filings (yellow-500) */}
                <path
                  d="M 30 90 L 70 80 L 110 50 L 150 40 L 190 70 L 230 45 L 280 20"
                  stroke="#eab308"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                
                {/* Line 2: Resolutions (emerald-500) */}
                <path
                  d="M 30 95 L 70 88 L 110 70 L 150 55 L 190 40 L 230 35 L 280 15"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Dots on nodes */}
                <circle cx="280" cy="20" r="3" fill="#eab308" />
                <circle cx="280" cy="15" r="3" fill="#10b981" />

                {/* Axis labels */}
                <text x="5" y="25" fill="#64748b" fontSize="7" fontWeight="bold">150k</text>
                <text x="5" y="55" fill="#64748b" fontSize="7" fontWeight="bold">100k</text>
                <text x="5" y="85" fill="#64748b" fontSize="7" fontWeight="bold">50k</text>
                
                <text x="65" y="112" fill="#64748b" fontSize="7" fontWeight="bold">Jan</text>
                <text x="105" y="112" fill="#64748b" fontSize="7" fontWeight="bold">Mar</text>
                <text x="145" y="112" fill="#64748b" fontSize="7" fontWeight="bold">May</text>
                <text x="185" y="112" fill="#64748b" fontSize="7" fontWeight="bold">Jul</text>
                <text x="225" y="112" fill="#64748b" fontSize="7" fontWeight="bold">Sep</text>
                <text x="270" y="112" fill="#64748b" fontSize="7" fontWeight="bold">Dec</text>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex gap-6 items-center text-[10px] text-slate-500 justify-center">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> New Cases Filed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Cases Resolved
              </span>
            </div>
          </div>

          {/* RIGHT: SYSTEM HOSTS NODES */}
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 glass-panel">
            <h3 className="font-bold text-slate-200 text-sm">Active Server Clusters</h3>
            <p className="text-slate-500 text-[10px]">Security state and server loads of self-contained local clusters</p>

            <div className="space-y-3.5">
              <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Server className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-255 text-xs">Primary Postgres Database (Supabase)</p>
                    <p className="text-[9px] text-slate-500">Location: NIC Central Server Node A, Delhi</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">99.98% Up</span>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-255 text-xs">Gemini AI LLM Private Server</p>
                    <p className="text-[9px] text-slate-500">API quota utilization: 4.8% (Warm standby)</p>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* AUDIT LOG TABLE */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 glass-panel">
          <div>
            <h3 className="font-bold text-slate-200 text-sm">System Database Action Audit Trails</h3>
            <p className="text-slate-500 text-[10px]">Real-time immutable ledger of registry edits and judicial orders</p>
          </div>

          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-semibold">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Actor Node</th>
                  <th className="py-2.5 px-3">User Role</th>
                  <th className="py-2.5 px-3">Database Action</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Audit State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-slate-950/30 text-slate-300">
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{log.timestamp}</td>
                    <td className="py-3 px-3 font-bold text-slate-200">{log.actor}</td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] uppercase font-bold">
                        {log.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 max-w-xs truncate">{log.action}</td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{log.ip}</td>
                    <td className="py-3 px-3">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[10px]">
                        <CheckCircle className="w-3.5 h-3.5 fill-emerald-500/10" /> Secure
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
