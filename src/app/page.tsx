"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Shield,
  Search,
  BookOpen,
  UserCheck,
  Cpu,
  ChevronDown,
  ArrowRight,
  Sun,
  Moon,
  CheckCircle,
  AlertTriangle,
  FolderOpen,
  Volume2,
  FileText,
  Lock,
  Layers,
  PhoneCall,
  Star,
  Menu,
  X
} from "lucide-react";
import { gsap } from "gsap";
import NeuralNetworkCanvas from "@/components/neural-network";
import ScalesOfJustice from "@/components/scales-of-justice";
import IndiaMapComponent from "@/components/india-map";
import CourthouseComponent from "@/components/courthouse";
import TiltCard from "@/components/tilt-card";
import RippleWrapper from "@/components/ripple-wrapper";

function AnimatedCounter({ value, suffix = "", duration = 1.5 }: { value: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const totalMiliseconds = duration * 1000;
    const incrementTime = 16; // 60 fps
    const step = end / (totalMiliseconds / incrementTime);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(Math.floor(start));
      }
    }, incrementTime);
    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Sync theme with HTML tag
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // GSAP scroll trigger/entrance effects
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.fromTo(
        ".gsap-fade-in",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power4.out" }
      );
    }
  }, []);

  // Workflow steps
  const steps = [
    {
      title: "Citizen Petition",
      desc: "Citizen submits complaint in native voice/text. AI extracts details, checks document health (OCR), and recommends matching advocates.",
      role: "Citizen Dashboard",
    },
    {
      title: "Advocate Engagement",
      desc: "Advocate reviews AI recommendation, accepts case, guides petition completion, and submits details for official registry.",
      role: "Advocate Collaboration",
    },
    {
      title: "Police Registration",
      desc: "Police officers upload FIRs & evidence. AI indexes data and flags suggested BNS sections, subject to officer verification.",
      role: "Police Portal",
    },
    {
      title: "Registry Audit",
      desc: "Registrar audits upload quality, updates official CNR number, and records physical archive storage details (room, box, barcodes).",
      role: "Registrar Workspace",
    },
    {
      title: "Judicial Evaluation",
      desc: "Judge accesses automated brief summaries, preceding cases, and applicable statutes. Judge conducts hearing and inputs final decree.",
      role: "Judge Cause Panel",
    },
  ];

  // FAQs
  const faqs = [
    {
      q: "Does NyayaFlow AI replace human judges?",
      a: "Absolutely not. Under our strict Human-in-the-Loop guidelines, the AI acts exclusively as a summary and organization assistant. Every official legal decision—including registering case CNR numbers, approving/rejecting petitions, and drafting verdicts—remains under the sole authority of judges, registrars, and officers.",
    },
    {
      q: "How does the document health check work?",
      a: "When a citizen or lawyer uploads files, the built-in OCR analyzes document resolution, completeness, matching fields, and signatures. It outputs a Document Health Score (0-100%). Applications can only proceed to the registry once they satisfy a safety quality threshold (85-90%).",
    },
    {
      q: "Does NyayaFlow support regional Indian languages?",
      a: "Yes. Using the Gemini API, citizens can dictate or write their complaints in any of the scheduled Indian languages (Hindi, Tamil, Marathi, Bengali, Telugu, etc.). The AI processes, translates, and drafts the structured categories for legal classification in English.",
    },
    {
      q: "How secure is user case data?",
      a: "NyayaFlow is designed to meet strict governmental database compliance. All files are fully encrypted in transit and at rest using database row-level security (RLS) policies, ensuring records are only visible to authorized case participants.",
    },
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 dark:bg-[#030712] dark:text-slate-100 transition-colors duration-500 overflow-hidden">
      
      {/* Neural Background - Absolute Positioning */}
      <div className="absolute inset-0 h-[1200px] pointer-events-none overflow-hidden select-none z-0">
        <NeuralNetworkCanvas />
      </div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 h-[1400px] grid-bg-overlay opacity-30 pointer-events-none z-0" />

      {/* Ambient decorative glows */}
      <div className="absolute top-[10%] left-[-10%] w-[50%] aspect-square rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[40%] right-[-10%] w-[50%] aspect-square rounded-full bg-yellow-500/5 blur-[120px] pointer-events-none z-0" />

      {/* HEADER NAVBAR */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 w-full glass-panel border-b border-black/5 dark:border-white/5 backdrop-blur-xl px-6 py-4 flex justify-between items-center transition-all"
      >
        <div className="flex items-center gap-3">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-600 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg shadow-emerald-500/10"
          >
            NF
          </motion.div>
          <span className="font-bold text-lg tracking-wider text-slate-800 dark:text-slate-100">
            NYAYA<span className="text-yellow-500">FLOW</span> <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-500 rounded-full border border-yellow-500/20 font-semibold ml-1">AI</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500 dark:text-slate-400">
          {["about", "problem", "workflow", "features", "security", "faq"].map((item) => (
            <motion.a 
              key={item}
              href={`#${item}`} 
              whileHover={{ scale: 1.03, color: "#f59e0b" }}
              className="hover:text-yellow-500 transition-colors capitalize relative"
            >
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-yellow-500/30 text-slate-400 hover:text-yellow-500 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-emerald-500" />}
          </motion.button>

          {/* Call to action button */}
          <Link href="/auth">
            <RippleWrapper>
              <div className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-yellow-600 to-amber-500 text-slate-950 transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer">
                Sign In Portal
              </div>
            </RippleWrapper>
          </Link>

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-550 dark:text-slate-400 hover:text-yellow-500 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.header>

      {/* MOBILE NAV MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden w-full bg-slate-100 dark:bg-slate-950 border-b border-black/5 dark:border-white/5 px-6 py-4 flex flex-col gap-3.5 z-40 relative text-left"
          >
            {["about", "problem", "workflow", "features", "security", "faq"].map((item) => (
              <a
                key={item}
                href={`#${item}`}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-650 dark:text-slate-350 hover:text-yellow-500 transition-colors py-1 capitalize"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-16 py-12 md:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto w-full">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div className="gsap-fade-in inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 text-xs font-semibold tracking-wide shadow-inner">
              <Shield className="w-3.5 h-3.5 animate-pulse" />
              Empowering the Indian Judiciary System
            </div>
            
            <h1 className="gsap-fade-in text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-800 dark:text-slate-100">
              AI-Powered Legal Workflows. <br />
              <span className="bg-gradient-to-r from-yellow-600 via-amber-505 to-emerald-500 dark:from-yellow-500 dark:via-amber-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Human-In-The-Loop.
              </span>
            </h1>

            <p className="gsap-fade-in text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              NyayaFlow AI is an intelligent judicial assistance platform designed to resolve backlogs, catalog physical evidence, audit document health, and assist citizens, advocates, and judges with structured workflows.
            </p>

            <div className="gsap-fade-in flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <Link href="/auth" className="w-full sm:w-auto">
                <RippleWrapper>
                  <div className="inline-flex w-full items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-yellow-600 to-amber-500 text-slate-950 gap-2 cursor-pointer">
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </RippleWrapper>
              </Link>
              <a href="#demo" className="w-full sm:w-auto">
                <RippleWrapper>
                  <div className="inline-flex w-full items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-slate-700 dark:text-slate-200 gap-2 cursor-pointer">
                    Launch Interactive Demo
                  </div>
                </RippleWrapper>
              </a>
            </div>

            {/* Micro stats banner with Animated Counters */}
            <div className="gsap-fade-in grid grid-cols-3 gap-6 pt-8 w-full max-w-lg border-t border-black/5 dark:border-white/5">
              <div>
                <p className="text-2xl font-black text-yellow-500">
                  <AnimatedCounter value={6} suffix=" Roles" />
                </p>
                <p className="text-xs text-slate-405">Integrated Dashboards</p>
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-500">
                  <AnimatedCounter value={100} suffix="%" />
                </p>
                <p className="text-xs text-slate-450">Human Autonomy</p>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-650 dark:text-slate-300">
                  <AnimatedCounter value={148} suffix="k+" />
                </p>
                <p className="text-xs text-slate-450">Cases Filed Mock</p>
              </div>
            </div>
          </div>

          {/* Right Scales Canvas Column inside TiltCard */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center relative py-6">
            <TiltCard maxTilt={10} className="w-full max-w-md">
              <div className="p-6 bg-slate-900/10 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-3xl shadow-xl glass-panel relative flex flex-col items-center">
                <ScalesOfJustice />
                <p className="text-xs text-slate-500 mt-6 tracking-wide uppercase italic text-center animate-pulse">
                  Hover to Balance the Scales of Justice
                </p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-24 bg-slate-100/50 dark:bg-[#030712]/60 border-t border-black/5 dark:border-white/5 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
          >
            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
              About NyayaFlow AI
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              Modernizing Justice with Intelligence and Safety
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              NyayaFlow is not a replacement. It is a robust digital ecosystem that streamlines case filing, evidence uploads, and registry tracking while keeping legal decision-making exclusively in the hands of authorized judges.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <TiltCard>
              <div className="p-8 h-full bg-slate-900/5 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-2xl glass-panel glass-panel-hover flex flex-col space-y-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <Layers className="w-6 h-6 animate-float" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Intelligent Workflows</h3>
                <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                  Connects Citizens, Lawyers, Police, Registrars, and Judges in one transparent pipeline. Ensures records move instantly between departments without physical delay.
                </p>
              </div>
            </TiltCard>

            {/* Box 2 */}
            <TiltCard>
              <div className="p-8 h-full bg-slate-900/5 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-2xl glass-panel glass-panel-hover flex flex-col space-y-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Cpu className="w-6 h-6 animate-sway" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Gemini LLM Advisory</h3>
                <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                  Translates multilingual inputs, extracts petition categories, and flags relevant statutes/precedents. Simplifies complex laws into accessible notifications for citizens.
                </p>
              </div>
            </TiltCard>

            {/* Box 3 */}
            <TiltCard>
              <div className="p-8 h-full bg-slate-900/5 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-2xl glass-panel glass-panel-hover flex flex-col space-y-4 text-left">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <Shield className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Strict Safety Barriers</h3>
                <p className="text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                  Ensures AI does not auto-reject cases, draft fake judgements, or assign official CNR numbers. NyayaFlow keeps AI strictly structured in a supportive audit role.
                </p>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* PROBLEM STATEMENT SECTION */}
      <section id="problem" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Map column on left in TiltCard */}
            <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <TiltCard maxTilt={6} className="w-full max-w-lg">
                <div className="p-6 bg-slate-900/5 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-3xl shadow-xl glass-panel relative flex flex-col items-center">
                  <IndiaMapComponent />
                </div>
              </TiltCard>
            </div>

            {/* Text description on right */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2 text-left">
              <h2 className="text-sm font-bold tracking-widest text-red-500 uppercase">
                The Backlog Challenge
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 leading-tight">
                Millions of Pending Cases. <br />
                Overloaded Courtrooms.
              </h3>
              <p className="text-slate-550 dark:text-slate-400 leading-relaxed">
                The Indian Judicial System faces significant caseload pressure, driven by manual registry entry, incomplete filing paperwork, scanning errors, and language differences. Registries spend months verifying physical documents and looking for case references.
              </p>
              
              <div className="space-y-4 pt-2">
                {[
                  {
                    title: "Filing Inefficiencies",
                    desc: "Up to 35% of petitions are delayed due to missing signatures, poor OCR scans, or wrong formats."
                  },
                  {
                    title: "Archival Separation",
                    desc: "Finding the exact shelf/cupboard of physical records for old trials is a time sink."
                  },
                  {
                    title: "Language Barriers",
                    desc: "Citizens struggle to convey issues and access local lawyers when they write in regional dialects."
                  }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0 text-xs font-bold">!</div>
                    <p className="text-sm text-slate-650 dark:text-slate-350">
                      <strong className="text-slate-800 dark:text-slate-100">{item.title}:</strong> {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKFLOW SECTION */}
      <section id="workflow" className="py-24 bg-slate-900/5 dark:bg-slate-900/10 border-t border-b border-black/5 dark:border-white/5 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
          >
            <h2 className="text-sm font-bold tracking-widest text-yellow-600 dark:text-yellow-500 uppercase">
              Workflow Animation
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              The Journey of a Petition
            </h3>
            <p className="text-slate-550 dark:text-slate-400">
              See how NyayaFlow integrates human validation steps with AI-powered suggestions at every milestone.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Interactive Step Buttons */}
            <div className="lg:col-span-5 space-y-4">
              {steps.map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                  <motion.div
                    key={step.title}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setActiveStep(idx)}
                    className={`cursor-pointer p-4 rounded-xl border text-left transition-all duration-300 ${
                      isActive
                        ? "bg-white dark:bg-slate-900 border-yellow-500/50 shadow-[0_0_30px_rgba(245,158,11,0.08)] scale-102"
                        : "bg-slate-900/5 dark:bg-slate-950/20 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-yellow-600 dark:text-yellow-500 tracking-wider">
                        STEP 0{idx + 1}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/5 dark:bg-slate-800 text-slate-650 dark:text-slate-300 font-bold">
                        {step.role}
                      </span>
                    </div>
                    <h4 className="text-md font-bold text-slate-800 dark:text-slate-100 mt-1">{step.title}</h4>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed"
                      >
                        {step.desc}
                      </motion.p>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Interactive Visual Dashboard on Right inside TiltCard */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <TiltCard maxTilt={4} className="w-full">
                <div className="bg-slate-900/5 dark:bg-slate-950/80 border border-black/5 dark:border-white/5 rounded-2xl p-6 h-[350px] relative glass-panel flex flex-col justify-between overflow-hidden shadow-2xl">
                  <div className="flex justify-between items-center border-b border-black/5 dark:border-white/5 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-mono text-slate-500 ml-2">NyayaFlow Engine v1.0.0</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20 rounded">
                      {steps[activeStep].role} Active
                    </span>
                  </div>

                  {/* Dynamic State Display */}
                  <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, scale: 0.96, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: -10 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="text-center space-y-4 w-full"
                      >
                        {activeStep === 0 && (
                          <div className="max-w-md mx-auto space-y-2">
                            <div className="inline-flex gap-2 items-center text-emerald-600 dark:text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full shadow-inner animate-pulse">
                              <Volume2 className="w-4 h-4" /> Audio Dictation Captured
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 italic">"Mera zameen padosi ne kabza kar liya..."</p>
                            <div className="text-left bg-white/40 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 p-3.5 rounded-xl text-xs space-y-1.5">
                              <p className="font-bold text-slate-700 dark:text-slate-200">AI Analysis Summary:</p>
                              <p className="text-slate-500 dark:text-slate-400"><strong className="text-yellow-600 dark:text-yellow-500">Category:</strong> Property Dispute | <strong className="text-yellow-600 dark:text-yellow-500">Confidence:</strong> 94%</p>
                              <p className="text-slate-500 dark:text-slate-400"><strong className="text-yellow-600 dark:text-yellow-500">Suggested Court:</strong> Sub-Divisional Magistrate Court</p>
                            </div>
                          </div>
                        )}

                        {activeStep === 1 && (
                          <div className="max-w-md mx-auto space-y-2">
                            <div className="text-left bg-white/40 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 p-3.5 rounded-xl text-xs space-y-2.5">
                              <p className="font-bold text-slate-700 dark:text-slate-200">Lawyer Recommendation Matched:</p>
                              <div className="flex gap-3 items-center">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center font-bold text-yellow-500">AD</div>
                                <div>
                                  <p className="font-bold text-slate-600 dark:text-slate-300">Adv. Abhishek Deshmukh</p>
                                  <p className="text-[10px] text-slate-500">Property Specialist | 12 Yrs Exp | Mumbai District</p>
                                </div>
                              </div>
                              <p className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold">⚠️ User choice is ultimate. AI never auto-selects.</p>
                            </div>
                          </div>
                        )}

                        {activeStep === 2 && (
                          <div className="max-w-md mx-auto space-y-2">
                            <div className="inline-flex gap-2 items-center text-yellow-600 dark:text-yellow-500 font-bold text-sm bg-yellow-500/10 border border-yellow-500/20 px-3.5 py-1.5 rounded-full">
                              <Search className="w-4 h-4" /> BNS Mapping Advisor
                            </div>
                            <div className="text-left bg-white/40 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 p-3.5 rounded-xl text-xs space-y-1.5">
                              <p className="font-bold text-slate-700 dark:text-slate-200">Incident: House Theft (evidence attached)</p>
                              <p className="text-slate-500 dark:text-slate-400">🚨 Recommended: <span className="text-emerald-600 dark:text-emerald-400 font-bold">Section 305 BNS</span> (Theft in dwelling house)</p>
                              <p className="text-[10px] text-slate-500 italic">Verify and click confirm to seal FIR Reference</p>
                            </div>
                          </div>
                        )}

                        {activeStep === 3 && (
                          <div className="max-w-md mx-auto space-y-2">
                            <div className="inline-flex gap-2 items-center text-slate-700 dark:text-slate-100 font-bold text-xs bg-black/5 dark:bg-slate-900 p-2 rounded-lg border border-black/5 dark:border-white/5">
                              <FileText className="w-4 h-4 text-emerald-500" /> Physical Archive Lock
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-left text-[11px] bg-white/40 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 p-3 rounded-lg">
                              <p className="text-slate-500 dark:text-slate-400">🏢 Building: <span className="text-slate-700 dark:text-slate-200 font-bold">Main Court A</span></p>
                              <p className="text-slate-500 dark:text-slate-400">📦 Box No: <span className="text-slate-700 dark:text-slate-200 font-bold">BOX-291</span></p>
                              <p className="text-slate-500 dark:text-slate-400">🗄️ Room / Shelf: <span className="text-slate-700 dark:text-slate-200 font-bold">RM-3 / SLF-D</span></p>
                              <p className="text-slate-500 dark:text-slate-400">🔢 Barcode: <span className="text-yellow-600 dark:text-yellow-500 font-bold">NF-8921-291</span></p>
                            </div>
                          </div>
                        )}

                        {activeStep === 4 && (
                          <div className="max-w-md mx-auto space-y-2">
                            <div className="inline-flex gap-2 items-center text-emerald-600 dark:text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                              <CheckCircle className="w-4 h-4" /> Judge Cause List Assistant
                            </div>
                            <div className="text-left bg-white/40 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 p-3 rounded-lg text-[11px] space-y-1.5">
                              <p className="font-bold text-slate-600 dark:text-slate-350">AI Brief Summary: Case CNR-DL0291-2026</p>
                              <p className="text-slate-500 dark:text-slate-400">Civil suit claiming illegal property encroachment. Prior hearings show document registry missing deed verification. Cites Section 44 property code.</p>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Progress visualizer bar */}
                  <div className="flex gap-2 items-center pt-3 border-t border-black/5 dark:border-white/5 text-[10px] text-slate-500 justify-between">
                    <span>Phase Progress</span>
                    <div className="flex gap-1.5">
                      {steps.map((_, idx) => (
                        <motion.div
                          key={idx}
                          className="h-1.5 rounded-full"
                          animate={{ 
                            width: idx === activeStep ? 24 : 8,
                            backgroundColor: idx <= activeStep ? "#eab308" : "rgba(255,255,255,0.08)"
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
          >
            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
              Core Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              State-of-the-Art Judicial AI Suite
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Fully optimized tools to accelerate filings, catalog physical records, and summarize precedents safely.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Volume2,
                color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20",
                title: "Multilingual Voice Input",
                desc: "Speaks native languages. Translates, transcribes, and maps statements to digital legal parameters instantly."
              },
              {
                icon: FileText,
                color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
                title: "AI Document Validation",
                desc: "Automatically scans PDF and images for signatures, blurred pages, or format errors. Produces a Health Score."
              },
              {
                icon: Cpu,
                color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
                title: "BNS Section Suggester",
                desc: "Analyzes details of FIR reports and proposes matching Bharatiya Nyaya Sanhita chapters for police verification."
              },
              {
                icon: BookOpen,
                color: "text-red-500 bg-red-500/10 border-red-500/20",
                title: "Cause List Summarizer",
                desc: "Aggregates preceding case histories and outputs brief digests so judges can inspect the core issues before hearings."
              },
              {
                icon: FolderOpen,
                color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
                title: "Physical File Linking",
                desc: "Maps digitized profiles to specific archival physical locations (Building, Floor, Room, Rack, Box) using barcodes."
              },
              {
                icon: Search,
                color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
                title: "Semantic Precedent Search",
                desc: "Search cases not just by index numbers, but by descriptions, situations, and arguments across the high court records."
              }
            ].map((feature, idx) => (
              <TiltCard key={idx}>
                <div className="p-6 h-full bg-slate-900/5 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-2xl glass-panel glass-panel-hover space-y-4 text-left">
                  <div className={`w-10 h-10 border rounded-lg flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{feature.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* TECH STACK & SECURITY */}
      <section id="security" className="py-24 bg-slate-100/50 dark:bg-[#030712]/60 border-t border-black/5 dark:border-white/5 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left column: Courthouse and Security info */}
            <div className="space-y-6 text-left">
              <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
                Government-Grade Security
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
                Confidentiality. Privacy. Self-Hostable.
              </h3>
              <p className="text-slate-550 dark:text-slate-400 leading-relaxed">
                NyayaFlow is designed to deploy inside sovereign digital networks. It is compatible with self-hosted PostgreSQL clusters, government cloud environments, and isolated local servers, eliminating third-party leaks.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="flex gap-2 items-center text-slate-700 dark:text-slate-200 font-semibold text-sm">
                    <Lock className="w-4 h-4 text-yellow-500" />
                    Row-Level Security
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Supabase and PostgreSQL schemas restrict case files only to verified parties.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center text-slate-700 dark:text-slate-200 font-semibold text-sm">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    Audit Logs
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    System audits track every single document download, CNR update, or registry shift.
                  </p>
                </div>
              </div>
            </div>

            {/* Right column: Graphic visualization in TiltCard */}
            <div className="flex flex-col justify-center items-center relative">
              <TiltCard maxTilt={5}>
                <div className="p-6 bg-slate-900/5 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-3xl shadow-xl glass-panel relative flex flex-col items-center">
                  <CourthouseComponent />
                </div>
              </TiltCard>
              <p className="text-xs text-slate-500 mt-4 text-center">
                NyayaFlow AI Sovereign Infrastructure Node (Active)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO VIDEO / INTERACTIVE PORTAL */}
      <section id="demo" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-3xl mx-auto"
          >
            <h2 className="text-sm font-bold tracking-widest text-yellow-600 dark:text-yellow-500 uppercase">
              Demonstration
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              See the System in Action
            </h3>
            <p className="text-slate-550 dark:text-slate-400">
              Take a walk through the 6 core dashboards and see how citizens interact with AI advice.
            </p>
          </motion.div>

          <TiltCard maxTilt={3} className="max-w-4xl mx-auto">
            <div className="relative aspect-video rounded-3xl bg-slate-900/5 dark:bg-slate-900/40 border border-black/5 dark:border-white/5 shadow-2xl overflow-hidden flex flex-col justify-center items-center glass-panel">
              {/* Visual simulation of playing a video */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_80%)]" />
              <div className="z-10 text-center space-y-4 p-8">
                <motion.div 
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 mx-auto"
                >
                  <Scale className="w-8 h-8" />
                </motion.div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100">Interactive Demo Sandbox Mode Active</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  No complex server dependencies required. Press the button below to sign in and play with all 6 live workflows directly in mock mode.
                </p>
                <Link href="/auth">
                  <RippleWrapper>
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 text-slate-950 font-bold hover:bg-yellow-450 transition-colors shadow-lg cursor-pointer">
                      Launch Portal <ArrowRight className="w-4 h-4" />
                    </div>
                  </RippleWrapper>
                </Link>
              </div>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* STAKEHOLDER FEEDBACK */}
      <section className="py-24 bg-slate-900/5 dark:bg-slate-900/10 border-t border-black/5 dark:border-white/5 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto space-y-4 mb-16"
          >
            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
              System Feedback
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100">
              Trusted by Legal Practitioners
            </h3>
            <p className="text-slate-555 dark:text-slate-400">
              Simulated testimonial responses from mock legal stakeholders using NyayaFlow prototypes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TiltCard>
              <div className="p-8 h-full bg-slate-900/5 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-2xl glass-panel space-y-5 text-left">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed">
                  "The physical document storage tracking feature alone saves our registry team hours every week. We no longer struggle with duplicate filings, and the document health audit flags incomplete submissions instantly."
                </p>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Harish K. Sharma</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Senior Registrar (Retired), Subordinate Courts</p>
                </div>
              </div>
            </TiltCard>

            <TiltCard>
              <div className="p-8 h-full bg-slate-900/5 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-2xl glass-panel space-y-5 text-left">
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />)}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed">
                  "NyayaFlow ensures that as advocates, we can easily track our filings without getting lost in court hallways. The AI recommended categories help citizen clients state their cases correctly before they even consult us."
                </p>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Sneha Patil</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Advocate, Bombay High Court</p>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-24 px-6 relative z-10 border-t border-black/5 dark:border-white/5">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <h2 className="text-sm font-bold tracking-widest text-yellow-600 dark:text-yellow-500 uppercase">
              Common Inquiries
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              Frequently Asked Questions
            </h3>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900/5 dark:bg-slate-900/20 border border-black/5 dark:border-white/5 rounded-xl overflow-hidden glass-panel"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center text-sm sm:text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-yellow-600 dark:hover:text-yellow-500 hover:bg-white/5 transition-all cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-yellow-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-black/5 dark:border-white/5"
                      >
                        <p className="p-5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-905/20 text-left">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-24 bg-slate-100/70 dark:bg-[#030712]/80 border-t border-black/5 dark:border-white/5 relative z-10 px-6">
        <div className="max-w-xl mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
              Get in Touch
            </h2>
            <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
              Contact NyayaFlow AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Have questions about deploying NyayaFlow AI inside your court or department? Submit an inquiry below.
            </p>
          </motion.div>

          <TiltCard>
            <div className="p-6 sm:p-8 bg-slate-900/5 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-2xl glass-panel relative">
              <AnimatePresence mode="wait">
                {!contactSubmitted ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setContactSubmitted(true);
                    }}
                    className="space-y-5 text-xs sm:text-sm text-left"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Full Name</label>
                        <input
                          type="text"
                          required
                          className="w-full bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500 transition-colors"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Designation / Role</label>
                        <input
                          type="text"
                          placeholder="e.g., Advocate, Registrar"
                          className="w-full bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        className="w-full bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-100 focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Message Details</label>
                      <textarea
                        rows={4}
                        required
                        className="w-full bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-2xl p-3 text-slate-100 focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>

                    <RippleWrapper>
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold transition-all duration-300 shadow-md cursor-pointer"
                      >
                        Submit Query
                      </button>
                    </RippleWrapper>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8 space-y-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mx-auto animate-bounce">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <h4 className="text-md font-bold text-slate-800 dark:text-slate-100">Inquiry Received</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                      Thank you. A representative from the NyayaFlow Government Integrations team will reach out shortly.
                    </p>
                    <button
                      onClick={() => setContactSubmitted(false)}
                      className="text-xs text-yellow-600 dark:text-yellow-500 hover:underline pt-2 cursor-pointer font-bold"
                    >
                      Send another query
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/5 dark:border-white/5 py-10 px-6 relative z-10 bg-slate-100 dark:bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center font-bold text-slate-950 text-[10px]">
              NF
            </div>
            <span className="font-bold text-sm tracking-wider text-slate-700 dark:text-slate-300">
              NYAYA<span className="text-yellow-500">FLOW</span>
            </span>
          </div>
          
          <p>© 2026 NyayaFlow AI Platform. Developed for Digital India Judicial Assistance. All rights reserved.</p>

          <div className="flex gap-6 text-slate-600 dark:text-slate-400 font-semibold">
            <a href="#about" className="hover:text-yellow-550 transition-colors">Privacy Policy</a>
            <a href="#about" className="hover:text-yellow-550 transition-colors">Terms of Use</a>
            <a href="#about" className="hover:text-yellow-555 transition-colors">Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
