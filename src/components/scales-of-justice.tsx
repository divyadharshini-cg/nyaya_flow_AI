"use client";

import { useState, useEffect, useRef } from "react";

export default function ScalesOfJustice() {
  const [tilt, setTilt] = useState(0); // in degrees
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const dx = e.clientX - centerX;
      // Calculate tilt based on mouse offset, capped at ±12 degrees
      const maxTilt = 12;
      const calculatedTilt = Math.min(
        Math.max((dx / (rect.width / 2)) * maxTilt, -maxTilt),
        maxTilt
      );
      setTilt(calculatedTilt);
    };

    const handleMouseLeave = () => {
      // Return to horizontal balance slowly with an oscillation
      let count = 0;
      const interval = setInterval(() => {
        setTilt((prev) => {
          if (Math.abs(prev) < 0.1) {
            clearInterval(interval);
            return 0;
          }
          return -prev * 0.7; // Dampened oscillation bounce
        });
        count++;
        if (count > 15) {
          clearInterval(interval);
          setTilt(0);
        }
      }, 80);
      return () => clearInterval(interval);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  // Calculate pan movements: one goes down, other goes up
  const leftPanY = tilt * 1.5;
  const rightPanY = -tilt * 1.5;

  return (
    <div
      ref={containerRef}
      id="scales-container"
      className="relative w-full max-w-[280px] sm:max-w-[340px] aspect-square flex items-center justify-center cursor-pointer select-none drop-shadow-[0_0_30px_rgba(195,155,52,0.15)] hover:drop-shadow-[0_0_40px_rgba(195,155,52,0.25)] transition-all duration-500"
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f39c12" />
            <stop offset="30%" stopColor="#f1c40f" />
            <stop offset="70%" stopColor="#d4af37" />
            <stop offset="100%" stopColor="#aa7c11" />
          </linearGradient>
          <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(195,155,52,0.2)" />
            <stop offset="100%" stopColor="rgba(195,155,52,0)" />
          </radialGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="100" cy="100" r="85" fill="url(#glow)" />

        {/* Central Stand / Pillar */}
        {/* Base */}
        <path
          d="M 60 170 L 140 170 L 130 160 L 70 160 Z"
          fill="url(#goldGradient)"
        />
        <rect x="75" y="152" width="50" height="8" rx="2" fill="url(#goldGradient)" />
        {/* Pillar Shaft */}
        <rect x="96" y="55" width="8" height="97" fill="url(#goldGradient)" />
        {/* Decorative elements on Pillar */}
        <circle cx="100" cy="85" r="7" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
        <circle cx="100" cy="120" r="7" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
        {/* Pillar Cap */}
        <path
          d="M 90 55 L 110 55 L 100 40 Z"
          fill="url(#goldGradient)"
        />
        <circle cx="100" cy="38" r="4" fill="url(#goldGradient)" />

        {/* --- Rotating Beam --- */}
        <g style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "100px 58px", transition: "transform 0.15s ease-out" }}>
          {/* Main Beam */}
          <path
            d="M 30 58 C 30 58, 65 54, 100 58 C 135 54, 170 58, 170 58 L 170 60 C 170 60, 135 56, 100 60 C 65 56, 30 60, 30 60 Z"
            fill="url(#goldGradient)"
          />
          {/* Center Hinge Pin */}
          <circle cx="100" cy="58" r="3.5" fill="#1e293b" stroke="url(#goldGradient)" strokeWidth="1.5" />
          
          {/* Left Hook */}
          <circle cx="32" cy="59" r="2.5" fill="url(#goldGradient)" />
          {/* Right Hook */}
          <circle cx="168" cy="59" r="2.5" fill="url(#goldGradient)" />
        </g>

        {/* --- Left Pan (Hangs from left hook @ 32,59 when tilt=0) --- */}
        <g style={{ transform: `translateY(${leftPanY}px)`, transition: "transform 0.15s ease-out" }}>
          {/* Left strings (origin at left hook point: 32, 59 relative to beam. But since strings drag, we approximate coordinates) */}
          {/* To make it look natural, we draw strings from fixed x=32 but offset their bottom relative to leftPanY */}
          <line x1="32" y1="59" x2="16" y2="120" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.8" />
          <line x1="32" y1="59" x2="48" y2="120" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.8" />
          <line x1="32" y1="59" x2="32" y2="120" stroke="url(#goldGradient)" strokeWidth="0.8" opacity="0.5" />
          
          {/* Left Pan Plate */}
          <path d="M 12 120 C 12 120, 12 128, 32 128 C 52 128, 52 120, 52 120 Z" fill="url(#goldGradient)" />
          <path d="M 16 120 L 48 120" stroke="url(#goldGradient)" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Weight on left pan (Symbolizing Citizen Cases) */}
          <circle cx="32" cy="115" r="4.5" fill="url(#emeraldGradient)" />
          <circle cx="27" cy="117" r="3.5" fill="url(#emeraldGradient)" />
        </g>

        {/* --- Right Pan (Hangs from right hook @ 168,59 when tilt=0) --- */}
        <g style={{ transform: `translateY(${rightPanY}px)`, transition: "transform 0.15s ease-out" }}>
          {/* Right strings */}
          <line x1="168" y1="59" x2="152" y2="120" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.8" />
          <line x1="168" y1="59" x2="184" y2="120" stroke="url(#goldGradient)" strokeWidth="1" opacity="0.8" />
          <line x1="168" y1="59" x2="168" y2="120" stroke="url(#goldGradient)" strokeWidth="0.8" opacity="0.5" />

          {/* Right Pan Plate */}
          <path d="M 148 120 C 148 120, 148 128, 168 128 C 188 128, 188 120, 188 120 Z" fill="url(#goldGradient)" />
          <path d="M 152 120 L 184 120" stroke="url(#goldGradient)" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Weight on right pan (Symbolizing AI Data insights) */}
          <path d="M 164 116 L 172 116 L 168 111 Z" fill="url(#goldGradient)" />
          <circle cx="168" cy="116" r="3.5" fill="url(#goldGradient)" />
        </g>

        {/* Logo overlay badge on center post */}
        <g transform="translate(90, 95)">
          <rect width="20" height="20" rx="3" fill="#090d0f" stroke="url(#goldGradient)" strokeWidth="1" />
          {/* Stylized 'NF' inside badge */}
          <text x="5" y="14" fill="#d4af37" fontSize="8" fontWeight="bold" fontFamily="sans-serif">NF</text>
        </g>
      </svg>
      
      {/* Decorative Outer Ring HUD */}
      <div className="absolute inset-0 border border-yellow-500/10 rounded-full scale-105 pointer-events-none animate-pulse-gold" />
      <div className="absolute inset-0 border border-dashed border-emerald-500/5 rounded-full scale-110 pointer-events-none animate-[spin_120s_linear_infinite]" />
    </div>
  );
}
