"use client";

import { motion } from "framer-motion";

export default function CourthouseComponent() {
  return (
    <div
      id="courthouse-container"
      className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square flex items-center justify-center p-4 filter drop-shadow-[0_0_20px_rgba(16,185,129,0.1)] hover:drop-shadow-[0_0_35px_rgba(16,185,129,0.25)] transition-all duration-500"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="metalGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4af37" />
            <stop offset="50%" stopColor="#f1c40f" />
            <stop offset="100%" stopColor="#9a7b1c" />
          </linearGradient>
          <linearGradient id="pillarGlow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.4)" />
            <stop offset="50%" stopColor="rgba(16, 185, 129, 0.1)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.5)" />
          </linearGradient>
          <radialGradient id="courtGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.15)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0)" />
          </radialGradient>
        </defs>

        {/* Ambient Court Glow */}
        <circle cx="100" cy="105" r="80" fill="url(#courtGlow)" />

        {/* Neural Network Nodes behind the courthouse */}
        <g opacity="0.6">
          <line x1="20" y1="130" x2="60" y2="60" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="60" y1="60" x2="100" y2="35" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="100" y1="35" x2="140" y2="60" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3,3" />
          <line x1="140" y1="60" x2="180" y2="130" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3,3" />
          <circle cx="60" cy="60" r="3" fill="#10b981" />
          <circle cx="100" cy="35" r="4.5" fill="#f1c40f" className="animate-ping" />
          <circle cx="100" cy="35" r="3.5" fill="#d4af37" />
          <circle cx="140" cy="60" r="3" fill="#10b981" />
        </g>

        {/* The Courthouse Structure */}
        {/* Foundation steps */}
        <rect x="25" y="165" width="150" height="7" rx="1.5" fill="url(#metalGold)" />
        <rect x="30" y="157" width="140" height="8" rx="1" fill="#0f172a" stroke="url(#metalGold)" strokeWidth="1.5" />
        <rect x="36" y="150" width="128" height="7" rx="1" fill="#0f172a" stroke="url(#metalGold)" strokeWidth="1" />

        {/* Pillars (6 standard visual pillars representing core pillars of justice) */}
        {/* Background glow for pillars */}
        <g opacity="0.8">
          <rect x="44" y="90" width="12" height="60" fill="url(#pillarGlow)" />
          <rect x="64" y="90" width="12" height="60" fill="url(#pillarGlow)" />
          <rect x="84" y="90" width="12" height="60" fill="url(#pillarGlow)" />
          <rect x="104" y="90" width="12" height="60" fill="url(#pillarGlow)" />
          <rect x="124" y="90" width="12" height="60" fill="url(#pillarGlow)" />
          <rect x="144" y="90" width="12" height="60" fill="url(#pillarGlow)" />
        </g>

        {/* Solid Pillars */}
        <g fill="url(#metalGold)">
          {/* Pillar 1 */}
          <rect x="46" y="90" width="8" height="60" rx="0.5" />
          <rect x="44" y="87" width="12" height="3" />
          <rect x="44" y="148" width="12" height="2" />

          {/* Pillar 2 */}
          <rect x="66" y="90" width="8" height="60" rx="0.5" />
          <rect x="64" y="87" width="12" height="3" />
          <rect x="64" y="148" width="12" height="2" />

          {/* Pillar 3 */}
          <rect x="86" y="90" width="8" height="60" rx="0.5" />
          <rect x="84" y="87" width="12" height="3" />
          <rect x="84" y="148" width="12" height="2" />

          {/* Pillar 4 */}
          <rect x="106" y="90" width="8" height="60" rx="0.5" />
          <rect x="104" y="87" width="12" height="3" />
          <rect x="104" y="148" width="12" height="2" />

          {/* Pillar 5 */}
          <rect x="126" y="90" width="8" height="60" rx="0.5" />
          <rect x="124" y="87" width="12" height="3" />
          <rect x="124" y="148" width="12" height="2" />

          {/* Pillar 6 */}
          <rect x="146" y="90" width="8" height="60" rx="0.5" />
          <rect x="144" y="87" width="12" height="3" />
          <rect x="144" y="148" width="12" height="2" />
        </g>

        {/* Architrave & Frieze */}
        <rect x="36" y="80" width="128" height="8" fill="url(#metalGold)" />
        <line x1="38" y1="84" x2="162" y2="84" stroke="#0f172a" strokeWidth="1" />

        {/* Pediment (Triangle Top) */}
        <path
          d="M 34 80 L 166 80 L 100 48 Z"
          fill="#0f172a"
          stroke="url(#metalGold)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        
        {/* Emblem inside Pediment (Ashoka Chakra Simplified) */}
        <circle cx="100" cy="69" r="6" stroke="url(#metalGold)" strokeWidth="1" />
        <circle cx="100" cy="69" r="2" fill="url(#metalGold)" />

        {/* Dome (Satyamev Jayate Dome visual) */}
        <path
          d="M 65 48 C 65 24, 135 24, 135 48 Z"
          fill="none"
          stroke="url(#metalGold)"
          strokeWidth="2"
          strokeDasharray="4,2"
          opacity="0.75"
        />
        <path
          d="M 75 48 C 75 32, 125 32, 125 48 Z"
          fill="none"
          stroke="url(#metalGold)"
          strokeWidth="1.5"
        />
        {/* Dome Spire */}
        <line x1="100" y1="30" x2="100" y2="15" stroke="url(#metalGold)" strokeWidth="1.5" />
        <circle cx="100" cy="13" r="2.5" fill="url(#metalGold)" />

        {/* Gate/Doorway in Center (Pillars 3 and 4) */}
        <path
          d="M 94 150 L 94 115 C 94 110, 106 110, 106 115 L 106 150 Z"
          fill="rgba(16, 185, 129, 0.1)"
          stroke="url(#metalGold)"
          strokeWidth="1"
        />
      </svg>
      
      {/* Outer Floating Digital HUD brackets */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-emerald-500/30" />
        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-emerald-500/30" />
        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-emerald-500/30" />
        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-emerald-500/30" />
      </div>
    </div>
  );
}
