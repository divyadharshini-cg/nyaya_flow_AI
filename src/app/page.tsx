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
  Star
} from "lucide-react";
import NeuralNetworkCanvas from "@/components/neural-network";
import ScalesOfJustice from "@/components/scales-of-justice";
import IndiaMapComponent from "@/components/india-map";
import CourthouseComponent from "@/components/courthouse";

export default function LandingPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    // Sync theme with HTML tag
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 dark:bg-slate-950 dark:text-slate-100 light:bg-slate-50 light:text-slate-900 transition-colors duration-300">
      {/* Neural Background - Absolute Positioning */}
      <div className="absolute inset-0 h-[1000px] pointer-events-none overflow-hidden select-none z-0">
        <NeuralNetworkCanvas />
      </div>

      {/* Grid overlay for texture */}
      <div className="absolute inset-0 h-[1200px] grid-bg-overlay opacity-30 pointer-events-none z-0" />

      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/80 backdrop-blur-md px-6 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-600 to-emerald-600 flex items-center justify-center font-bold text-white shadow-lg">
            NF
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-100">
            NYAYA<span className="text-yellow-500">FLOW</span> <span className="text-xs px-1.5 py-0.5 bg-yellow-500/20 text-yellow-400 rounded-full border border-yellow-500/30">AI</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <a href="#about" className="hover:text-yellow-500 transition-colors">About</a>
          <a href="#problem" className="hover:text-yellow-500 transition-colors">Problem</a>
          <a href="#workflow" className="hover:text-yellow-500 transition-colors">Workflow</a>
          <a href="#features" className="hover:text-yellow-500 transition-colors">Features</a>
          <a href="#security" className="hover:text-yellow-500 transition-colors">Security</a>
          <a href="#faq" className="hover:text-yellow-500 transition-colors">FAQ</a>
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-yellow-500/50 text-slate-300 transition-all"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4 text-emerald-500" />}
          </button>

          {/* Call to action button */}
          <Link
            href="/auth"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-slate-950 transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.45)] hover:scale-105"
          >
            Sign In Portal
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center px-6 lg:px-16 py-12 md:py-24 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-7xl mx-auto w-full">
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
              <Shield className="w-3.5 h-3.5" />
              Empowering the Indian Judiciary System
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              AI-Powered Legal Workflows. <br />
              <span className="bg-gradient-to-r from-yellow-500 via-amber-400 to-emerald-500 bg-clip-text text-transparent">
                Human-In-The-Loop.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              NyayaFlow AI is an intelligent judicial assistance platform designed to resolve backlogs, catalog physical evidence, audit document health, and assist citizens, advocates, and judges with structured workflows.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <Link
                href="/auth"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl bg-gradient-to-r from-yellow-600 to-amber-500 text-slate-950 transition-all duration-300 hover:from-yellow-500 hover:to-amber-400 shadow-[0_4px_20px_rgba(245,158,11,0.3)] hover:scale-105 gap-2"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center px-6 py-3.5 text-base font-semibold rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-yellow-500/30 transition-all duration-300 gap-2"
              >
                Watch Concept Video
              </a>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-3 gap-6 pt-8 w-full max-w-lg border-t border-slate-900">
              <div>
                <p className="text-2xl font-bold text-yellow-500">6 Roles</p>
                <p className="text-xs text-slate-500">Integrated Dashboards</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-500">100%</p>
                <p className="text-xs text-slate-500">Human Autonomy</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-300">0s</p>
                <p className="text-xs text-slate-500">Manual Classification</p>
              </div>
            </div>
          </div>

          {/* Right Scales Canvas Column */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center relative py-6">
            <ScalesOfJustice />
            <p className="text-xs text-slate-500 mt-6 tracking-wide uppercase italic text-center animate-pulse">
              Hover to Balance the Scales of Justice
            </p>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-slate-950/60 border-t border-slate-900/60 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
              About NyayaFlow AI
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              Modernizing Justice with Intelligence and Safety
            </p>
            <p className="text-slate-400">
              NyayaFlow is not a replacement. It is a robust digital ecosystem that streamlines case filing, evidence uploads, and registry tracking while keeping legal decision-making exclusively in the hands of authorized judges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 glass-panel flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Intelligent Workflows</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connects Citizens, Lawyers, Police, Registrars, and Judges in one transparent pipeline. Ensures records move instantly between departments without physical delay.
              </p>
            </div>

            {/* Box 2 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 glass-panel flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Gemini LLM Advisory</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Translates multilingual inputs, extracts petition categories, and flags relevant statutes/precedents. Simplifies complex laws into accessible notifications for citizens.
              </p>
            </div>

            {/* Box 3 */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 glass-panel flex flex-col space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-100">Strict Safety Barriers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Ensures AI does not auto-reject cases, draft fake judgements, or assign official CNR numbers. NyayaFlow keeps AI strictly structured in a supportive audit role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM STATEMENT SECTION */}
      <section id="problem" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Map column on left */}
            <div className="lg:col-span-6 flex justify-center order-2 lg:order-1">
              <IndiaMapComponent />
            </div>

            {/* Text description on right */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <h2 className="text-sm font-bold tracking-widest text-red-500 uppercase">
                The Backlog Challenge
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
                Millions of Pending Cases. <br />
                Overloaded Courtrooms.
              </h3>
              <p className="text-slate-400 leading-relaxed">
                The Indian Judicial System faces significant caseload pressure, driven by manual registry entry, incomplete filing paperwork, scanning errors, and language differences. Registries spend months verifying physical documents and looking for case references.
              </p>
              
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 text-xs">!</div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-slate-100">Filing Inefficiencies:</strong> Up to 35% of petitions are delayed due to missing signatures, poor OCR scans, or wrong formats.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 text-xs">!</div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-slate-100">Archival Separation:</strong> Finding the exact shelf/cupboard of physical records for old trials is a time sink.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 text-xs">!</div>
                  <p className="text-sm text-slate-300">
                    <strong className="text-slate-100">Language Barriers:</strong> Citizens struggle to convey issues and access local lawyers when they write in regional dialects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKFLOW SECTION */}
      <section id="workflow" className="py-20 bg-slate-900/30 border-t border-b border-slate-900/60 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase">
              Workflow Animation
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              The Journey of a Petition
            </h3>
            <p className="text-slate-400">
              See how NyayaFlow integrates human validation steps with AI-powered suggestions at every milestone.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Interactive Step Buttons */}
            <div className="lg:col-span-5 space-y-4">
              {steps.map((step, idx) => {
                const isActive = idx === activeStep;
                return (
                  <div
                    key={step.title}
                    onClick={() => setActiveStep(idx)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all duration-300 text-left ${
                      isActive
                        ? "bg-slate-900 border-yellow-500/50 shadow-lg scale-102"
                        : "bg-slate-950/20 border-slate-800/65 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-yellow-500 tracking-wider">
                        STEP 0{idx + 1}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {step.role}
                      </span>
                    </div>
                    <h4 className="text-md font-bold text-slate-100 mt-1">{step.title}</h4>
                    {isActive && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-xs text-slate-400 mt-2 leading-relaxed"
                      >
                        {step.desc}
                      </motion.p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Interactive Visual Dashboard on Right */}
            <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800/80 rounded-2xl p-6 h-[350px] relative glass-panel flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-xs font-mono text-slate-500 ml-2">NyayaFlow Engine v1.0.0</span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded">
                  {steps[activeStep].role} Active
                </span>
              </div>

              {/* Dynamic State Display */}
              <div className="flex-1 flex flex-col justify-center items-center space-y-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="text-center space-y-4 w-full"
                  >
                    {activeStep === 0 && (
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="inline-flex gap-2 items-center text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full">
                          <Volume2 className="w-4 h-4 animate-bounce" /> Audio Dictation Captured
                        </div>
                        <p className="text-xs text-slate-400 italic">"Mera zameen padosi ne kabza kar liya..."</p>
                        <div className="text-left bg-slate-900/60 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                          <p className="font-semibold text-slate-300">AI Analysis Summary:</p>
                          <p className="text-slate-400"><strong className="text-yellow-500">Category:</strong> Property Dispute | <strong className="text-yellow-500">Confidence:</strong> 94%</p>
                          <p className="text-slate-400"><strong className="text-yellow-500">Suggested Court:</strong> Sub-Divisional Magistrate Court</p>
                        </div>
                      </div>
                    )}

                    {activeStep === 1 && (
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="text-left bg-slate-900/60 border border-slate-800 p-3 rounded-lg text-xs space-y-2">
                          <p className="font-semibold text-slate-300">Lawyer Recommendation Matched:</p>
                          <div className="flex gap-3 items-center">
                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center font-bold text-yellow-500">AD</div>
                            <div>
                              <p className="font-bold">Adv. Abhishek Deshmukh</p>
                              <p className="text-[10px] text-slate-500">Property Specialist | 12 Yrs Exp | Mumbai District</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-yellow-500/90 font-medium">⚠️ User choice is ultimate. AI never auto-selects.</p>
                        </div>
                      </div>
                    )}

                    {activeStep === 2 && (
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="inline-flex gap-2 items-center text-yellow-500 font-bold text-sm bg-yellow-500/10 border border-yellow-500/30 px-3 py-1.5 rounded-full">
                          <Search className="w-4 h-4" /> BNS Mapping Advisor
                        </div>
                        <div className="text-left bg-slate-900/60 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                          <p className="font-semibold text-slate-300">Incident: House Theft (evidence attached)</p>
                          <p className="text-slate-400">🚨 Recommended: <span className="text-emerald-400 font-semibold">Section 305 BNS</span> (Theft in dwelling house)</p>
                          <p className="text-[9px] text-slate-500 italic">Verify and click confirm to seal FIR Reference</p>
                        </div>
                      </div>
                    )}

                    {activeStep === 3 && (
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="inline-flex gap-2 items-center text-slate-100 font-bold text-xs bg-slate-800 p-2 rounded-lg border border-slate-700">
                          <FileText className="w-4 h-4 text-emerald-400" /> Physical Archive Lock
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-left text-[11px] bg-slate-900/60 border border-slate-800 p-3 rounded-lg">
                          <p className="text-slate-400">🏢 Building: <span className="text-slate-200">Main Court A</span></p>
                          <p className="text-slate-400">📦 Box No: <span className="text-slate-200">BOX-291</span></p>
                          <p className="text-slate-400">🗄️ Room / Shelf: <span className="text-slate-200">RM-3 / SLF-D</span></p>
                          <p className="text-slate-400">🔢 Barcode: <span className="text-yellow-500">NF-8921-291</span></p>
                        </div>
                      </div>
                    )}

                    {activeStep === 4 && (
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="inline-flex gap-2 items-center text-emerald-400 font-bold text-xs bg-emerald-500/10 border border-emerald-500/20 p-2 rounded-lg">
                          <CheckCircle className="w-4 h-4" /> Judge Cause List Assistant
                        </div>
                        <div className="text-left bg-slate-900/60 border border-slate-800 p-3 rounded-lg text-[11px] space-y-1">
                          <p className="font-bold text-slate-300">AI Brief Summary: Case CNR-DL0291-2026</p>
                          <p className="text-slate-400">Civil suit claiming illegal property encroachment. Prior hearings show document registry missing deed verification. Cites Section 44 property code.</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress visualizer bar */}
              <div className="flex gap-2 items-center pt-3 border-t border-slate-800/60 text-xs text-slate-500 justify-between">
                <span>Phase Progress</span>
                <div className="flex gap-1">
                  {steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx <= activeStep ? "w-6 bg-yellow-500" : "w-2 bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
              Core Capabilities
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              State-of-the-Art Judicial AI Suite
            </p>
            <p className="text-slate-400">
              Fully optimized tools to accelerate filings, catalog physical records, and summarize precedents safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Grid 1 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl glass-panel space-y-3">
              <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-semibold">Multilingual Voice Input</h4>
              <p className="text-sm text-slate-400">
                Speaks native languages. Translates, transcribes, and maps statements to digital legal parameters instantly.
              </p>
            </div>

            {/* Grid 2 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl glass-panel space-y-3">
              <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-semibold">AI Document Validation</h4>
              <p className="text-sm text-slate-400">
                Automatically scans PDF and images for signatures, blurred pages, or format errors. Produces a Health Score.
              </p>
            </div>

            {/* Grid 3 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl glass-panel space-y-3">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-semibold">BNS Section Suggester</h4>
              <p className="text-sm text-slate-400">
                Analyzes details of FIR reports and proposes matching Bharatiya Nyaya Sanhita chapters for police verification.
              </p>
            </div>

            {/* Grid 4 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl glass-panel space-y-3">
              <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-semibold">Cause List Summarizer</h4>
              <p className="text-sm text-slate-400">
                Aggregates preceding case histories and outputs brief digests so judges can inspect the core issues before hearings.
              </p>
            </div>

            {/* Grid 5 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl glass-panel space-y-3">
              <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-semibold">Physical File Location Linking</h4>
              <p className="text-sm text-slate-400">
                Maps digitized profiles to specific archival physical locations (Building, Floor, Room, Rack, Box) using barcodes.
              </p>
            </div>

            {/* Grid 6 */}
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl glass-panel space-y-3">
              <div className="w-10 h-10 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-semibold">Semantic Precedent Search</h4>
              <p className="text-sm text-slate-400">
                Search cases not just by index numbers, but by descriptions, situations, and arguments across the high court records.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK & SECURITY */}
      <section id="security" className="py-20 bg-slate-950/60 border-t border-slate-900 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left column: Courthouse and Security info */}
            <div className="space-y-6">
              <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
                Government-Grade Security
              </h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
                Confidentiality. Privacy. Self-Hostable.
              </h3>
              <p className="text-slate-400 leading-relaxed">
                NyayaFlow is designed to deploy inside sovereign digital networks. It is compatible with self-hosted PostgreSQL clusters, government cloud environments, and isolated local servers, eliminating third-party leaks.
              </p>

              <div className="grid grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <div className="flex gap-2 items-center text-slate-200 font-semibold text-sm">
                    <Lock className="w-4 h-4 text-yellow-500" />
                    Row-Level Security
                  </div>
                  <p className="text-xs text-slate-500">
                    Supabase and PostgreSQL schemas restrict case files only to verified parties.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 items-center text-slate-200 font-semibold text-sm">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Audit Logs
                  </div>
                  <p className="text-xs text-slate-500">
                    System audits track every single document download, CNR update, or registry shift.
                  </p>
                </div>
              </div>
            </div>

            {/* Right column: Graphic visualization */}
            <div className="flex flex-col justify-center items-center relative">
              <CourthouseComponent />
              <p className="text-xs text-slate-500 mt-4 text-center">
                NyayaFlow AI Sovereign Infrastructure Node (Active)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DEMO VIDEO */}
      <section id="demo" className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="space-y-4 max-w-3xl mx-auto">
            <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase">
              Demonstration
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              See the System in Action
            </h3>
            <p className="text-slate-400">
              Take a walk through the 6 core dashboards and see how citizens interact with AI advice.
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto aspect-video rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col justify-center items-center">
            {/* Visual simulation of playing a video */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_80%)]" />
            <div className="z-10 text-center space-y-4 p-8">
              <div className="w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 mx-auto animate-pulse">
                <Scale className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold">Interactive Demo Sandbox Mode Active</h4>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                No complex server dependencies required. Press the button below to sign in and play with all 6 live workflows directly in mock mode.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-yellow-500 text-slate-950 font-bold hover:bg-yellow-400 transition-colors shadow-lg"
              >
                Launch Portal <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* DUMMY TESTIMONIALS */}
      <section className="py-20 bg-slate-900/10 border-t border-slate-900 relative z-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
              System Feedback
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-100">
              Trusted by Legal Practitioners
            </h3>
            <p className="text-slate-400">
              Simulated testimonial responses from mock legal stakeholders using NyayaFlow prototypes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl glass-panel space-y-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500" />)}
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "The physical document storage tracking feature alone saves our registry team hours every week. We no longer struggle with duplicate filings, and the document health audit flags incomplete submissions instantly."
              </p>
              <div>
                <p className="text-xs font-bold text-slate-100">Harish K. Sharma</p>
                <p className="text-[10px] text-slate-500">Senior Registrar (Retired), Subordinate Courts</p>
              </div>
            </div>

            <div className="p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl glass-panel space-y-4">
              <div className="flex items-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-500" />)}
              </div>
              <p className="text-sm text-slate-300 italic leading-relaxed">
                "NyayaFlow ensures that as advocates, we can easily track our filings without getting lost in court hallways. The AI recommended categories help citizen clients state their cases correctly before they even consult us."
              </p>
              <div>
                <p className="text-xs font-bold text-slate-100">Sneha Patil</p>
                <p className="text-[10px] text-slate-500">Advocate, Bombay High Court</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 px-6 relative z-10 border-t border-slate-900">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-sm font-bold tracking-widest text-yellow-500 uppercase">
              Common Inquiries
            </h2>
            <h3 className="text-3xl font-extrabold text-slate-100">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = faqOpen === index;
              return (
                <div
                  key={index}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden glass-panel"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : index)}
                    className="w-full p-5 text-left flex justify-between items-center text-sm sm:text-base font-semibold text-slate-200 hover:text-slate-100 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-yellow-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-800/60"
                      >
                        <p className="p-5 text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-950/20">
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
      <section className="py-20 bg-slate-950/80 border-t border-slate-900 relative z-10 px-6">
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-sm font-bold tracking-widest text-emerald-500 uppercase">
              Get in Touch
            </h2>
            <h3 className="text-3xl font-bold text-slate-100">
              Contact NyayaFlow AI
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Have questions about deploying NyayaFlow AI inside your court or department? Submit an inquiry below.
            </p>
          </div>

          <div className="p-6 bg-slate-900/50 border border-slate-800/80 rounded-2xl glass-panel relative">
            <AnimatePresence mode="wait">
              {!contactSubmitted ? (
                <motion.form
                  key="contact-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setContactSubmitted(true);
                  }}
                  className="space-y-4 text-xs sm:text-sm"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium">Full Name</label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium">Designation / Role</label>
                      <input
                        type="text"
                        placeholder="e.g., Advocate, Registrar"
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-yellow-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Email Address</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Message Details</label>
                    <textarea
                      rows={4}
                      required
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-yellow-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold transition-all duration-300 shadow-md"
                  >
                    Submit Query
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h4 className="text-md font-bold text-slate-100">Inquiry Received</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Thank you. A representative from the NyayaFlow Government Integrations team will reach out shortly.
                  </p>
                  <button
                    onClick={() => setContactSubmitted(false)}
                    className="text-xs text-yellow-500 hover:underline pt-2"
                  >
                    Send another query
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 py-10 px-6 relative z-10 bg-slate-950 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center font-bold text-slate-950 text-[10px]">
              NF
            </div>
            <span className="font-bold text-sm tracking-wider text-slate-300">
              NYAYA<span className="text-yellow-500">FLOW</span>
            </span>
          </div>
          
          <p>© 2026 NyayaFlow AI Platform. Developed for Digital India Judicial Assistance. All rights reserved.</p>

          <div className="flex gap-6 text-slate-400">
            <a href="#about" className="hover:text-yellow-500 transition-colors">Privacy Policy</a>
            <a href="#about" className="hover:text-yellow-500 transition-colors">Terms of Use</a>
            <a href="#about" className="hover:text-yellow-500 transition-colors">Disclaimer</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
