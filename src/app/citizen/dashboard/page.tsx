"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Scale,
  FileText,
  Search,
  CheckCircle,
  AlertTriangle,
  Upload,
  UserCheck,
  ChevronRight,
  TrendingUp,
  Volume2,
  Calendar,
  Bell,
  Check,
  Download,
  AlertCircle,
  ShieldAlert,
  SearchCode,
  MapPin,
  Clock,
  Briefcase,
  HelpCircle,
  RefreshCw,
  LogOut
} from "lucide-react";
import { apiClassifyCase, apiAuditDocument, apiListPetitions, apiListAdvocates, apiUpdatePetitionAdvocate, apiUpdatePetitionStatus } from "@/utils/api";
import AssistantSidebar from "@/components/assistant-sidebar";
import TiltCard from "@/components/tilt-card";
import RippleWrapper from "@/components/ripple-wrapper";

// Simulated canvas audio wave visualizer
function WaveformVisualizer({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;
    const width = (canvas.width = 120);
    const height = (canvas.height = 30);
    const barsCount = 12;
    const barWidth = 4;
    const gap = 3;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#ef4444"; // active recording red
      for (let i = 0; i < barsCount; i++) {
        const barHeight = Math.random() * (height - 6) + 4;
        const x = i * (barWidth + gap) + 15;
        const y = height / 2 - barHeight / 2;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [active]);

  return <canvas ref={canvasRef} className="w-[120px] h-[30px]" />;
}

// Mock Advocates database
const mockAdvocates = [
  {
    id: "adv-1",
    name: "Adv. Abhishek Deshmukh",
    specialization: "Property & Civil Law",
    experience: "12 Yrs",
    languages: "English, Hindi, Marathi",
    practiceYears: 12,
    feeEstimate: "₹25,000 / case",
    availability: "Available tomorrow",
    rating: "4.9/5",
    reason: "He resides in your district and has solved 42 similar property disputes with a 92% success rate in the SDM Court.",
  },
  {
    id: "adv-2",
    name: "Adv. Meera Sen",
    specialization: "Family & Property Law",
    experience: "9 Yrs",
    languages: "English, Bengali, Hindi",
    practiceYears: 9,
    feeEstimate: "₹18,000 / case",
    availability: "Next week",
    rating: "4.7/5",
    reason: "Expert in local partition law, handles familial reconciliation disputes, highly rated for clear communication.",
  },
  {
    id: "adv-3",
    name: "Adv. Rohan Malhotra",
    specialization: "Cyber Law & Intellectual Property",
    experience: "15 Yrs",
    languages: "English, Hindi, Punjabi",
    practiceYears: 15,
    feeEstimate: "₹40,000 / case",
    availability: "Available today",
    rating: "4.95/5",
    reason: "A national consultant on BNS digital theft laws, recommended for complex cybersecurity litigation.",
  },
];

const MOCK_PETITIONS = [
  {
    id: "default-petition-001",
    citizen_id: "55446677-8899-4444-8888-999900000001",
    citizen_name: "Aditya Patil",
    advocate_id: null,
    advocate_name: null,
    category: "Property & Land Dispute (Civil)",
    description: "Claiming partition encroachment on a 7/12 mutation survey plot #142 in Kothrud, Pune. Neighbor constructed a partition masonry boundary wall violating survey drawings. Injunction needed.",
    language: "Marathi",
    suggested_court: "Sub-Divisional Magistrate Court, Pune",
    ai_confidence: "94.8%",
    status: "Scrutiny Pending",
    cnr_number: null,
    created_at: new Date().toISOString(),
  },
];

export default function CitizenDashboard() {
  const [activeTab, setActiveTab] = useState("new-petition");
  
  // Wizard States
  const [wizardStep, setWizardStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState({
    name: "Aditya Patil",
    age: "34",
    gender: "Male",
    phone: "+91 98765 43210",
    email: "aditya.patil@email.com",
    occupation: "Agricultural Consultant",
    address: "Flat 102, Shanti Nivas, Kothrud",
    district: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    language: "Marathi",
    idProof: "Aadhaar Card",
    aadhaar: "5544-6677-8899",
    emergencyContact: "+91 98123 45678",
  });
  const [problemDescription, setProblemDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  
  // AI Classification Response State
  const [classificationResult, setClassificationResult] = useState<any>(null);
  const [analyzingCase, setAnalyzingCase] = useState(false);
  
  // Advocate selection states
  const [hasAdvocate, setHasAdvocate] = useState<string | null>(null);
  const [advocateDetails, setAdvocateDetails] = useState({ name: "", barNo: "", phone: "" });
  const [selectedRecommendedLawyer, setSelectedRecommendedLawyer] = useState<string | null>(null);
  
  // OCR Document health check states
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);
  const [healthCheckRun, setHealthCheckRun] = useState(false);
  const [healthScore, setHealthScore] = useState(0);
  const [healthIssues, setHealthIssues] = useState<string[]>([]);
  const [registrySent, setRegistrySent] = useState(false);

  // Appeal states
  const [appealQuery, setAppealQuery] = useState("");
  const [appealResult, setAppealResult] = useState<any>(null);

  // User and live state integration
  const [user, setUser] = useState<any>(null);
  const [petitions, setPetitions] = useState<any[]>([]);
  const [advocates, setAdvocates] = useState<any[]>(mockAdvocates);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.role === "citizen") {
          setPersonalInfo((prev) => ({
            ...prev,
            name: parsed.full_name,
            email: parsed.email,
            phone: parsed.phone || prev.phone,
          }));
        }
      }
    }

    // Load advocates and petitions
    apiListAdvocates().then((data) => {
      if (data && data.length > 0) setAdvocates(data);
    });
    apiListPetitions().then((data) => {
      if (data && data.length > 0) setPetitions(data);
    });
  }, []);

  // Simulated Voice Input trigger
  const triggerVoiceSimulation = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      setProblemDescription(
        "Majhi zameen padosi ne kabza kela ahe. Amcha sathi 1989 madhe bhumi vatan zale hote, pan tyane sadhya ek navin compound wall bandhli ahe ji amchya shetat yete. Me talathya kade gelo pan kahi madat nahi milali."
      );
    }, 2500);
  };

  // Run AI Case Classification
  const runCaseClassification = async () => {
    setAnalyzingCase(true);
    try {
      const res = await apiClassifyCase(problemDescription, personalInfo.language, user?.id);
      if (res.success) {
        setClassificationResult(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzingCase(false);
    }
  };

  // Run OCR Document audit with visual upload progress simulation
  const runDocAudit = async () => {
    setUploadingFiles(true);
    setUploadPercent(0);
    
    const interval = setInterval(() => {
      setUploadPercent((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 15;
      });
    }, 250);

    try {
      const res = await apiAuditDocument(
        classificationResult?.id || null,
        "Litigant Petition Memo.pdf",
        problemDescription,
        classificationResult?.category || "Petition"
      );
      clearInterval(interval);
      setUploadPercent(100);
      
      setTimeout(() => {
        if (res.success) {
          setHealthScore(res.healthScore);
          setHealthIssues(res.issues);
          setHealthCheckRun(true);
          setUploadingFiles(false);
        }
      }, 300);
    } catch (err) {
      console.error(err);
      setUploadingFiles(false);
    }
  };

  // Reset Petition Wizard
  const resetPetitionWizard = () => {
    setWizardStep(1);
    setProblemDescription("");
    setClassificationResult(null);
    setHasAdvocate(null);
    setAdvocateDetails({ name: "", barNo: "", phone: "" });
    setSelectedRecommendedLawyer(null);
    setHealthCheckRun(false);
    setRegistrySent(false);

    // Reload petitions
    apiListPetitions().then((data) => {
      if (data && data.length > 0) setPetitions(data);
    });
  };

  const handleSendToRegistry = async () => {
    try {
      if (classificationResult?.id) {
        if (hasAdvocate === "no" && selectedRecommendedLawyer) {
          const selectedAdv = advocates.find((a) => a.id === selectedRecommendedLawyer);
          if (selectedAdv) {
            await apiUpdatePetitionAdvocate(classificationResult.id, selectedAdv.user_id || selectedAdv.id);
          }
        }
        await apiUpdatePetitionStatus(classificationResult.id, "Scrutiny Pending");
      }
      setRegistrySent(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Run Appeal assistant advice
  const checkAppealAdvice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealQuery) return;
    setAppealResult({
      available: "Likely Available",
      statute: "Section 96, Civil Procedure Code (CPC)",
      timeline: "30 Days from date of decree",
      court: "District Court of Pune (First Appeal)",
      templates: ["CPC First Appeal Petition Template (CIVIL)"],
      notes: "An appeal lies against a primary civil decree in the local district court. You must file a certified copy of the decree along with your memo of appeal before Aug 25, 2026.",
    });
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-slate-100 text-xs sm:text-sm">
      
      {/* AI Assistant Sidebar */}
      <AssistantSidebar role="citizen" />

      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-white/40 dark:bg-slate-900/30 border-r border-black/5 dark:border-white/5 flex flex-col justify-between shrink-0 p-4 backdrop-blur-2xl">
        <div className="space-y-6">
          {/* Logo */}
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

          {/* User profile capsule */}
          <div className="flex gap-3 items-center p-3 bg-white/60 dark:bg-slate-950/40 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
            <div className="w-9 h-9 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center font-bold text-yellow-500 shadow-sm">
              AP
            </div>
            <div className="text-left">
              <p className="font-bold text-slate-700 dark:text-slate-200">{user?.full_name || "Aditya Patil"}</p>
              <p className="text-[10px] text-slate-400">Citizen litigant</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: "new-petition", label: "New Petition Wizard", icon: FileText },
              { id: "track-case", label: "Track Active Case", icon: Scale },
              { id: "appeal-assistant", label: "Appeal Assistant", icon: ShieldAlert },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full p-3 rounded-xl flex items-center gap-3 font-semibold transition-all text-left cursor-pointer border ${
                    isActive
                      ? "bg-yellow-500 border-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/10"
                      : "text-slate-500 dark:text-slate-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveTab("notifications")}
              className={`w-full p-3 rounded-xl flex items-center justify-between font-semibold transition-all text-left cursor-pointer border ${
                activeTab === "notifications"
                  ? "bg-yellow-500 border-yellow-400 text-slate-950 shadow-lg shadow-yellow-500/10"
                  : "text-slate-500 dark:text-slate-400 border-transparent hover:bg-black/5 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <span className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                Notifications
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-red-500 text-white font-bold animate-pulse">
                2
              </span>
            </motion.button>
          </nav>
        </div>

        {/* Logout block */}
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
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
        
        {/* Banner Safety Warnings */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-3.5 text-[11px] text-emerald-600 dark:text-emerald-450 font-medium text-left"
        >
          <CheckCircle className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
          <span><strong>Human in Command:</strong> NyayaFlow AI will never auto-submit applications, select advocates, or reject your submissions. You retain complete agency over your petition files.</span>
        </motion.div>

        {/* TABS CONTAINER */}
        <div className="bg-white/40 dark:bg-slate-900/30 border border-black/5 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl glass-panel relative min-h-[500px]">
          
          <AnimatePresence mode="wait">
            {/* TAB 1: NEW PETITION WIZARD */}
            {activeTab === "new-petition" && (
              <motion.div
                key="new-petition-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                
                {/* Wizard Steps Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-black/5 dark:border-white/5 pb-5 gap-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Filing New Petition Wizard</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Let AI guide you to classify your claim and identify correct paperwork.</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.div
                        key={s}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => {
                          if (s < wizardStep) setWizardStep(s);
                        }}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer transition-all border ${
                          s === wizardStep
                            ? "bg-yellow-500 border-yellow-400 text-slate-950 font-extrabold shadow-md"
                            : s < wizardStep
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-black/5 dark:bg-white/5 border-transparent text-slate-405 dark:text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        Step 0{s}
                      </motion.div>
                    ))}
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {/* STEP 1: COLLECT PERSONAL DETAILS */}
                  {wizardStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Step 1: Litigant Personal Information</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                          { key: "name", label: "Full Legal Name", type: "text" },
                          { key: "age", label: "Age", type: "text" },
                          { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
                          { key: "phone", label: "Phone Number", type: "text" },
                          { key: "email", label: "Email", type: "email" },
                          { key: "occupation", label: "Occupation", type: "text" },
                          { key: "address", label: "Full Residential Address", type: "text", span: true },
                          { key: "district", label: "District", type: "text" },
                          { key: "state", label: "State", type: "text" },
                          { key: "pincode", label: "Pincode", type: "text" },
                          { key: "language", label: "Preferred Language", type: "text" },
                          { key: "idProof", label: "Identity Proof Type", type: "text" },
                          { key: "aadhaar", label: "Aadhaar (Optional/Secure)", type: "text", placeholder: "XXXX-XXXX-XXXX" }
                        ].map((field) => (
                          <div key={field.key} className={`space-y-1.5 ${field.span ? "sm:col-span-3" : ""}`}>
                            <label className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">{field.label}</label>
                            {field.type === "select" ? (
                              <select
                                value={(personalInfo as any)[field.key]}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, [field.key]: e.target.value })}
                                className="w-full bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-yellow-500/60 transition-colors shadow-inner text-xs"
                              >
                                {field.options?.map(o => <option key={o} value={o}>{o}</option>)}
                              </select>
                            ) : (
                              <input
                                type={field.type}
                                value={(personalInfo as any)[field.key]}
                                onChange={(e) => setPersonalInfo({ ...personalInfo, [field.key]: e.target.value })}
                                placeholder={field.placeholder}
                                className="w-full bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-yellow-500/60 transition-colors shadow-inner text-xs"
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end pt-5 border-t border-black/5 dark:border-white/5">
                        <RippleWrapper>
                          <button
                            onClick={() => setWizardStep(2)}
                            className="px-5 py-2.5 rounded-xl bg-yellow-500 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            Next: Describe Dispute <ChevronRight className="w-4 h-4" />
                          </button>
                        </RippleWrapper>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: DESCRIBE DISPUTE */}
                  {wizardStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          Step 2: Describe your Dispute
                        </h3>
                        
                        <div className="flex items-center gap-3 flex-wrap">
                          {isRecording && <WaveformVisualizer active={isRecording} />}
                          <RippleWrapper>
                            <button
                              onClick={triggerVoiceSimulation}
                              className={`px-3 py-2 rounded-xl border font-bold flex items-center gap-1.5 text-xs transition-colors cursor-pointer ${
                                isRecording
                                  ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse"
                                  : "bg-white dark:bg-slate-955 border-black/10 dark:border-white/5 text-yellow-600 dark:text-yellow-500"
                              }`}
                            >
                              <Volume2 className="w-4 h-4" />
                              {isRecording ? "Listening to Voice..." : "Dictate in Any Language"}
                            </button>
                          </RippleWrapper>
                        </div>
                      </div>

                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        Explain what happened in detail. You can dictate or type in Hindi, Marathi, Tamil, Bengali, Telugu, Kannada, English, or any local Indian language.
                      </p>

                      <textarea
                        rows={6}
                        value={problemDescription}
                        onChange={(e) => setProblemDescription(e.target.value)}
                        placeholder="Type the details of your complaint here..."
                        className="w-full bg-white/60 dark:bg-slate-955/60 border border-black/5 dark:border-white/5 rounded-2xl p-4 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-yellow-500/50 text-xs transition-colors shadow-inner"
                      />

                      <div className="flex justify-between items-center pt-2">
                        <RippleWrapper>
                          <button
                            onClick={() => setWizardStep(1)}
                            className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl font-bold hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                          >
                            Back
                          </button>
                        </RippleWrapper>

                        <RippleWrapper>
                          <button
                            disabled={!problemDescription || analyzingCase}
                            onClick={runCaseClassification}
                            className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            {analyzingCase ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Dispute...
                              </>
                            ) : (
                              <>AI Case Categorization Audit</>
                            )}
                          </button>
                        </RippleWrapper>
                      </div>

                      {/* Skeleton loader wrapper during case analysis */}
                      {analyzingCase && (
                        <div className="border border-black/5 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 rounded-3xl p-5 space-y-4 shadow-xl">
                          <div className="flex justify-between items-center flex-wrap gap-2">
                            <div className="space-y-2 flex-1">
                              <div className="h-3 w-1/4 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
                              <div className="h-5 w-1/2 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
                            </div>
                            <div className="h-6 w-20 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
                          </div>
                          <div className="h-16 w-full rounded-xl bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-10 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
                            <div className="h-10 rounded bg-slate-200 dark:bg-slate-800 skeleton-shimmer" />
                          </div>
                        </div>
                      )}

                      <AnimatePresence>
                        {classificationResult && !analyzingCase && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 15 }}
                            className="border border-black/5 dark:border-white/5 bg-white/40 dark:bg-slate-950/40 rounded-3xl p-5 space-y-4 shadow-xl text-xs sm:text-sm"
                          >
                            <div className="flex justify-between items-start flex-wrap gap-2">
                              <div>
                                <span className="text-[10px] font-bold text-yellow-600 dark:text-yellow-500 tracking-wider uppercase">
                                  Gemini Advisory Breakdown
                                </span>
                                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                                  {classificationResult.category}
                                </h4>
                              </div>
                              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-450 text-[10px] font-bold">
                                AI Confidence: {classificationResult.confidence}
                              </span>
                            </div>

                            {/* Brief explanation */}
                            <div className="text-slate-600 dark:text-slate-305 bg-white/60 dark:bg-slate-955/60 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                              <p className="font-bold text-slate-700 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
                                <AlertCircle className="w-4 h-4 text-yellow-500" />
                                Simplified Case Summary
                              </p>
                              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                                {classificationResult.simpleExplanation}
                              </p>
                            </div>

                            {/* Legal info */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                              <div className="space-y-1.5">
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Suggested Statutes / Acts:</p>
                                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-350 text-[11px]">
                                  {classificationResult.acts.map((act: string) => (
                                    <li key={act}>{act}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="space-y-1.5">
                                <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Suggested Court & Location:</p>
                                <p className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 text-xs sm:text-sm">
                                  <MapPin className="w-4 h-4 text-yellow-500" />
                                  {classificationResult.suggestedCourt}
                                </p>
                                <p className="text-[10px] text-slate-505 dark:text-slate-500 mt-1">
                                  <strong>Estimated Timeline:</strong> {classificationResult.timeline}
                                </p>
                              </div>
                            </div>

                            {/* Required Docs list */}
                            <div className="space-y-2">
                              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Required Filing Documents Checklist:</p>
                              <div className="flex flex-wrap gap-2">
                                {classificationResult.documents.map((doc: string) => (
                                  <span
                                    key={doc}
                                    className="px-3 py-1.5 rounded-lg bg-black/5 dark:bg-slate-900/60 border border-black/5 dark:border-white/5 text-[10px] text-slate-600 dark:text-slate-300 font-medium"
                                  >
                                    {doc}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Proceed to next step */}
                            <div className="flex justify-end pt-3 border-t border-black/5 dark:border-white/5">
                              <RippleWrapper>
                                <button
                                  onClick={() => setWizardStep(3)}
                                  className="px-5 py-2.5 rounded-xl bg-yellow-500 text-slate-950 font-extrabold flex items-center gap-1 cursor-pointer"
                                >
                                  Next: Select Advocate <ChevronRight className="w-4 h-4" />
                                </button>
                              </RippleWrapper>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* STEP 3: ADVOCATE SELECTION */}
                  {wizardStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Step 3: Advocate (Lawyer) Selection</h3>
                      
                      <div className="space-y-3">
                        <p className="text-slate-500 dark:text-slate-400 font-semibold">Do you already have a legal advocate representing you?</p>
                        <div className="flex gap-4">
                          <RippleWrapper className="flex-1">
                            <button
                              onClick={() => setHasAdvocate("yes")}
                              className={`w-full px-5 py-3 rounded-2xl border font-bold transition-all text-sm cursor-pointer ${
                                hasAdvocate === "yes"
                                  ? "bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-550"
                                  : "bg-white/40 dark:bg-slate-950/40 border-black/10 dark:border-white/5 text-slate-500 dark:text-slate-405 hover:bg-black/5 dark:hover:bg-white/5"
                              }`}
                            >
                              YES, I have my own advocate
                            </button>
                          </RippleWrapper>
                          <RippleWrapper className="flex-1">
                            <button
                              onClick={() => setHasAdvocate("no")}
                              className={`w-full px-5 py-3 rounded-2xl border font-bold transition-all text-sm cursor-pointer ${
                                hasAdvocate === "no"
                                  ? "bg-yellow-500/10 border-yellow-500 text-yellow-600 dark:text-yellow-550"
                                  : "bg-white/40 dark:bg-slate-950/40 border-black/10 dark:border-white/5 text-slate-500 dark:text-slate-405 hover:bg-black/5 dark:hover:bg-white/5"
                              }`}
                            >
                              NO, show AI matching recommendations
                            </button>
                          </RippleWrapper>
                        </div>
                      </div>

                      {/* Case 1: Has Advocate */}
                      <AnimatePresence>
                        {hasAdvocate === "yes" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 border border-black/5 dark:border-white/5 bg-white/20 dark:bg-slate-950/20 p-5 rounded-2xl overflow-hidden"
                          >
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">Enter Advocate Legal Credentials</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-slate-500 dark:text-slate-405 font-medium">Advocate Name</label>
                                <input
                                  type="text"
                                  value={advocateDetails.name}
                                  onChange={(e) => setAdvocateDetails({ ...advocateDetails, name: e.target.value })}
                                  placeholder="e.g., Adv. Rajesh Kumar"
                                  className="w-full bg-white/60 dark:bg-slate-955/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-805 dark:text-slate-200 focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-slate-500 dark:text-slate-455 font-medium">Bar Council Registration No</label>
                                <input
                                  type="text"
                                  value={advocateDetails.barNo}
                                  onChange={(e) => setAdvocateDetails({ ...advocateDetails, barNo: e.target.value })}
                                  placeholder="e.g., BCI/MAH/8921/2012"
                                  className="w-full bg-white/60 dark:bg-slate-955/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-805 dark:text-slate-200 focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <label className="text-slate-500 dark:text-slate-455 font-medium">Phone Code / Email</label>
                                <input
                                  type="text"
                                  value={advocateDetails.phone}
                                  onChange={(e) => setAdvocateDetails({ ...advocateDetails, phone: e.target.value })}
                                  placeholder="e.g., +91 99112 23344"
                                  className="w-full bg-white/60 dark:bg-slate-955/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-805 dark:text-slate-200 focus:outline-none"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Case 2: Wants AI Recommendations */}
                      <AnimatePresence>
                        {hasAdvocate === "no" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-4 overflow-hidden"
                          >
                            <div className="flex justify-between items-center flex-wrap gap-2">
                              <h4 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                                <UserCheck className="w-4 h-4 text-emerald-500" />
                                NyayaFlow AI Advocate Advisor
                              </h4>
                              <span className="text-[10px] text-yellow-600 dark:text-yellow-500 bg-yellow-500/5 px-2.5 py-0.5 rounded-lg border border-yellow-500/10 font-bold">
                                ⚠️ Advice Only: Litigants make the final selection
                              </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              {advocates.map((lawyer) => {
                                const isSelected = selectedRecommendedLawyer === lawyer.id;
                                return (
                                  <TiltCard key={lawyer.id}>
                                    <div
                                      className={`p-5 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                                        isSelected
                                          ? "bg-white dark:bg-slate-900 border-yellow-500/60 shadow-[0_0_20px_rgba(245,158,11,0.06)]"
                                          : "bg-white/40 dark:bg-slate-950/30 border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10"
                                      }`}
                                      onClick={() => setSelectedRecommendedLawyer(lawyer.id)}
                                    >
                                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="space-y-1">
                                          <div className="flex items-center gap-2">
                                            <h5 className="font-bold text-slate-805 dark:text-slate-100 text-sm">{lawyer.full_name || lawyer.name}</h5>
                                            <span className="px-2 py-0.5 rounded-full text-[9px] bg-black/5 dark:bg-slate-800 border border-black/5 dark:border-white/5 text-slate-500 dark:text-slate-400 font-bold">
                                              {lawyer.experience_years ? `${lawyer.experience_years} Yrs` : lawyer.experience} Exp
                                            </span>
                                          </div>
                                          <p className="text-[10px] text-slate-505 dark:text-slate-400">
                                            <strong>Languages:</strong> {lawyer.languages} | <strong>Specialty:</strong> {lawyer.specialization}
                                          </p>
                                        </div>
                                        <div className="text-right sm:text-right shrink-0">
                                          <p className="font-extrabold text-yellow-600 dark:text-yellow-500">{lawyer.fee_estimate || lawyer.feeEstimate}</p>
                                          <p className="text-[9px] text-slate-500 italic mt-0.5">{lawyer.availability}</p>
                                        </div>
                                      </div>

                                      {/* AI recommendation reasoning */}
                                      <div className="mt-3 p-3 bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl text-[10px] sm:text-xs text-slate-505 dark:text-slate-400">
                                        <strong className="text-emerald-500">Why matched:</strong> {lawyer.reason || "Matched profile constraints."}
                                      </div>

                                      {/* Click Select Action */}
                                      <div className="mt-3 flex justify-end">
                                        <span
                                          className={`px-3 py-1.5 text-[10px] rounded-lg font-extrabold transition-all border ${
                                            isSelected
                                              ? "bg-emerald-600 border-emerald-500 text-white"
                                              : "bg-white dark:bg-slate-950 hover:bg-black/5 dark:hover:bg-slate-900 border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-300"
                                          }`}
                                        >
                                          {isSelected ? "Selected Advocate Match" : "Select this Lawyer"}
                                        </span>
                                      </div>
                                    </div>
                                  </TiltCard>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5">
                        <RippleWrapper>
                          <button
                            onClick={() => setWizardStep(2)}
                            className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl font-bold hover:bg-black/10 dark:hover:bg-white/10"
                          >
                            Back
                          </button>
                        </RippleWrapper>

                        <RippleWrapper>
                          <button
                            disabled={
                              !hasAdvocate ||
                              (hasAdvocate === "yes" && (!advocateDetails.name || !advocateDetails.barNo)) ||
                              (hasAdvocate === "no" && !selectedRecommendedLawyer)
                            }
                            onClick={() => setWizardStep(4)}
                            className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-extrabold flex items-center gap-1 cursor-pointer"
                          >
                            Next: Templates <ChevronRight className="w-4 h-4" />
                          </button>
                        </RippleWrapper>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: DOWNLOAD TEMPLATES */}
                  {wizardStep === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Step 4: Official Petition Form Templates</h3>

                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        Based on your dispute category (<strong className="text-yellow-600 dark:text-yellow-500">Property dispute</strong>), download the official format templates authorized by subordinate Indian civil registries.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Template Card 1 */}
                        <TiltCard>
                          <div className="bg-white/40 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-2xl p-5 flex flex-col justify-between h-full">
                            <div>
                              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Official Land Encroachment Petition</h4>
                              <p className="text-[10px] text-slate-500 mt-1">Authorized civil suit format under CPC Section 6.</p>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <RippleWrapper>
                                <button
                                  type="button"
                                  className="px-3 py-2 rounded-lg bg-black/5 dark:bg-slate-900 border border-black/5 dark:border-white/5 hover:border-yellow-500/20 text-yellow-600 dark:text-yellow-500 flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" /> PDF Format
                                </button>
                              </RippleWrapper>
                              <RippleWrapper>
                                <button
                                  type="button"
                                  className="px-3 py-2 rounded-lg bg-black/5 dark:bg-slate-900 border border-black/5 dark:border-white/5 hover:border-yellow-500/20 text-yellow-600 dark:text-yellow-500 flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" /> DOCX Format
                                </button>
                              </RippleWrapper>
                            </div>
                          </div>
                        </TiltCard>

                        {/* Template Card 2 */}
                        <TiltCard>
                          <div className="bg-white/40 dark:bg-slate-955/40 border border-black/5 dark:border-white/5 rounded-2xl p-5 flex flex-col justify-between h-full">
                            <div>
                              <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm">Verification Affidavit of Boundary Claims</h4>
                              <p className="text-[10px] text-slate-500 mt-1">Official declaration template for boundaries confirmation.</p>
                            </div>
                            <div className="flex gap-2 mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                              <RippleWrapper>
                                <button
                                  type="button"
                                  className="px-3 py-2 rounded-lg bg-black/5 dark:bg-slate-900 border border-black/5 dark:border-white/5 hover:border-yellow-500/20 text-yellow-600 dark:text-yellow-500 flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" /> PDF Format
                                </button>
                              </RippleWrapper>
                              <RippleWrapper>
                                <button
                                  type="button"
                                  className="px-3 py-2 rounded-lg bg-black/5 dark:bg-slate-900 border border-black/5 dark:border-white/5 hover:border-yellow-500/20 text-yellow-600 dark:text-yellow-500 flex items-center gap-1 font-bold text-[10px] cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" /> DOCX Format
                                </button>
                              </RippleWrapper>
                            </div>
                          </div>
                        </TiltCard>
                      </div>

                      <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl space-y-2 text-left">
                        <p className="font-bold text-yellow-650 dark:text-yellow-500 text-xs flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4" />
                          AI Instructions for Filling
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          1. Fill in your details matching your Aadhaar card exactly.<br />
                          2. Attach the 7/12 Land Mutation Record as 'Schedule A' on the third page.<br />
                          3. Sign in the presence of an authorized notary advocate. Leave the CNR number blank—the court registrar will update it later.
                        </p>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-black/5 dark:border-white/5">
                        <RippleWrapper>
                          <button
                            onClick={() => setWizardStep(3)}
                            className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl font-bold hover:bg-black/10"
                          >
                            Back
                          </button>
                        </RippleWrapper>

                        <RippleWrapper>
                          <button
                            onClick={() => setWizardStep(5)}
                            className="px-5 py-2.5 rounded-xl bg-yellow-500 text-slate-950 font-extrabold flex items-center gap-1 cursor-pointer"
                          >
                            Next: Upload & Validate <ChevronRight className="w-4 h-4" />
                          </button>
                        </RippleWrapper>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 5: UPLOAD & AUDIT HEALTH SCORE */}
                  {wizardStep === 5 && (
                    <motion.div
                      key="step5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Step 5: Upload Files & AI Document Health Check</h3>

                      <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">
                        Upload your filled petition templates and supporting evidence (PDF / Images / Docs). NyayaFlow AI will run scans to verify that all fields, files, and scanning qualities satisfy the registry's filing criteria.
                      </p>

                      {/* Drag & Drop Zone showing visual scanning beam during uploads */}
                      <div className="border-2 border-dashed border-black/10 dark:border-white/5 hover:border-yellow-500/30 rounded-2xl p-8 text-center bg-white/40 dark:bg-slate-950/40 relative overflow-hidden group transition-all duration-300">
                        {uploadingFiles && (
                          <motion.div 
                            className="absolute left-0 right-0 h-1 bg-yellow-500/40 shadow-[0_0_10px_#eab308]"
                            animate={{ top: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        )}
                        <Upload className="w-8 h-8 text-slate-455 group-hover:text-yellow-550 mx-auto transition-colors" />
                        <p className="font-bold text-slate-650 dark:text-slate-350 mt-3">Select files to upload or Drag & Drop</p>
                        <p className="text-[10px] text-slate-405 dark:text-slate-500 mt-1">Supported formats: PDF, PNG, JPG, DOCX (Max 25MB total)</p>
                      </div>

                      {/* Radar loader element when scanning with progress bar */}
                      <AnimatePresence>
                        {uploadingFiles && (
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center p-8 space-y-4"
                          >
                            <div className="relative w-24 h-24 rounded-full border border-emerald-500/20 flex items-center justify-center overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/0 via-emerald-500/0 to-emerald-500/30 animate-radar" />
                              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                              <div className="absolute inset-2 border border-emerald-500/10 rounded-full animate-ping" />
                              <div className="absolute inset-6 border border-emerald-500/5 rounded-full" />
                            </div>
                            <div className="w-full max-w-xs space-y-1">
                              <div className="flex justify-between text-[10px] text-slate-455 font-bold uppercase tracking-wider">
                                <span>Scanning Documents</span>
                                <span>{uploadPercent}%</span>
                              </div>
                              <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <motion.div 
                                  className="h-full bg-emerald-500" 
                                  style={{ width: `${uploadPercent}%` }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex justify-between items-center pt-2">
                        <RippleWrapper>
                          <button
                            onClick={() => setWizardStep(4)}
                            className="px-4 py-2.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-xl font-bold hover:bg-black/10"
                          >
                            Back
                          </button>
                        </RippleWrapper>

                        {!uploadingFiles && (
                          <RippleWrapper>
                            <button
                              onClick={runDocAudit}
                              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              Scan and Analyze Documents
                            </button>
                          </RippleWrapper>
                        )}
                      </div>

                      {/* Document health audit output */}
                      <AnimatePresence>
                        {healthCheckRun && !uploadingFiles && (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border border-black/5 dark:border-white/5 bg-white/40 dark:bg-slate-955/40 rounded-3xl p-6 space-y-4 shadow-xl text-xs sm:text-sm text-left"
                          >
                            <div className="flex justify-between items-center flex-wrap gap-3">
                              <div>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                                  AI Audit Complete
                                </span>
                                <h4 className="text-md font-bold text-slate-800 dark:text-slate-100">Document Health Report</h4>
                              </div>

                              {/* Circular/Text score badge */}
                              <div className="flex items-center gap-3">
                                <span className="text-2xl font-black text-yellow-600 dark:text-yellow-500">{healthScore}%</span>
                                <span className="text-[9px] px-2 py-0.5 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-405 border border-yellow-500/20 font-bold uppercase">
                                  Passable (Safety Target 85%)
                                </span>
                              </div>
                            </div>

                            {/* List of audit warnings */}
                            <div className="space-y-2">
                              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Identified Issues Checklist ({healthIssues.length})</p>
                              <div className="space-y-2">
                                {healthIssues.map((issue, idx) => (
                                  <div
                                    key={idx}
                                    className="flex gap-2.5 p-3 rounded-xl bg-slate-900/5 dark:bg-slate-900 border border-black/5 dark:border-white/5 text-slate-600 dark:text-slate-350"
                                  >
                                    <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                                    <span>{issue}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Send to Registry validation gate */}
                            <div className="pt-4 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                              <p className="text-[10px] text-slate-500 max-w-sm text-center sm:text-left leading-normal">
                                Score complies with court requirements (88% &gt; 85%). You may send this digitized packet to the Subordinate Court Registry.
                              </p>

                              {!registrySent ? (
                                <RippleWrapper>
                                  <button
                                    onClick={handleSendToRegistry}
                                    className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition-all text-xs cursor-pointer shadow-lg animate-pulse"
                                  >
                                    Send Digitized Petition to Court Registry
                                  </button>
                                </RippleWrapper>
                              ) : (
                                <div className="flex gap-2.5 items-center text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                                  {/* Animated Success Checkmark Drawing */}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 52 52"
                                    className="w-5 h-5 stroke-emerald-500 stroke-[3] fill-none"
                                  >
                                    <circle
                                      cx="26"
                                      cy="26"
                                      r="25"
                                      stroke="rgba(16, 185, 129, 0.2)"
                                      strokeWidth="2"
                                    />
                                    <motion.path
                                      d="M14 27 l8 8 l16 -16"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </svg>
                                  <span>Filing Sent to Court Registry</span>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {registrySent && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-5 bg-slate-900/5 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left"
                          >
                            <div className="space-y-1">
                              <p className="font-bold text-slate-805 dark:text-slate-200">What's Next?</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                                Submit your physical copies of 'Boundary Partition Deed' at the court registry within 7 business days for registrar verification.
                              </p>
                            </div>
                            <RippleWrapper>
                              <button
                                onClick={resetPetitionWizard}
                                className="px-4 py-2 rounded-xl bg-yellow-500 text-slate-950 font-bold text-xs cursor-pointer shadow-md"
                              >
                                Reset filing form
                              </button>
                            </RippleWrapper>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* TAB 2: CASE TRACKING */}
            {activeTab === "track-case" && (
              <motion.div
                key="track-case-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                {(() => {
                  const citizenPetitions = petitions.filter(p => p.citizen_id === user?.id || p.citizen_name === user?.full_name);
                  const activeTrackedPetition = citizenPetitions[0] || petitions[0] || MOCK_PETITIONS[0];
                  
                  const isScrutinyPending = activeTrackedPetition.status === "Scrutiny Pending";
                  const isAudited = activeTrackedPetition.status === "Registry Audited";
                  const isCnrIssued = activeTrackedPetition.status === "CNR Issued";
                  const isHearingsActive = activeTrackedPetition.status === "Hearings Active";
                  const isDisposed = activeTrackedPetition.status === "Disposed";
                  
                  const dynamicSteps = [
                    { label: "Application Submitted", status: "completed", date: "Jul 10, 2026" },
                    { label: "Registry Review", status: !isScrutinyPending ? "completed" : "active", date: !isScrutinyPending ? "Jul 12, 2026" : "" },
                    { label: "Hard Copy Submitted", status: (isAudited || isCnrIssued || isHearingsActive || isDisposed) ? "completed" : (!isScrutinyPending ? "active" : "pending"), date: (isAudited || isCnrIssued || isHearingsActive || isDisposed) ? "Jul 14, 2026" : "" },
                    { label: "Court Registered", status: (isCnrIssued || isHearingsActive || isDisposed) ? "completed" : (isAudited ? "active" : "pending"), date: (isCnrIssued || isHearingsActive || isDisposed) ? "Jul 15, 2026" : "" },
                    { label: "Official CNR Received", status: (isHearingsActive || isDisposed) ? "completed" : (isCnrIssued ? "active" : "pending"), date: (isHearingsActive || isDisposed) ? "Jul 16, 2026" : "" },
                    { label: "Judge Assigned", status: (isHearingsActive || isDisposed) ? "completed" : "pending", date: (isHearingsActive || isDisposed) ? "Jul 18, 2026" : "" },
                    { label: "Hearings", status: isDisposed ? "completed" : (isHearingsActive ? "active" : "pending"), date: isDisposed ? "Jul 19, 2026" : "" },
                    { label: "Judgment Issued", status: isDisposed ? "completed" : "pending", date: isDisposed ? "Jul 20, 2026" : "" },
                  ];

                  return (
                    <div className="space-y-6">
                      <div className="border-b border-black/5 dark:border-white/5 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">Live Case Tracking Timeline</h2>
                          <p className="text-slate-500 dark:text-slate-400 text-xs">Verify current status and dates of hearing.</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs font-bold text-yellow-500">CNR: {activeTrackedPetition.cnr_number || "Registry Processing"}</p>
                          <p className="text-[10px] text-slate-500">Official registry status: {activeTrackedPetition.status}</p>
                        </div>
                      </div>

                      {/* Litigant overview cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <TiltCard>
                          <div className="p-4 bg-slate-900/5 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-2xl shadow-sm h-full">
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Case Category</p>
                            <p className="text-slate-705 dark:text-slate-200 font-bold mt-1 text-sm">{activeTrackedPetition.category}</p>
                          </div>
                        </TiltCard>
                        <TiltCard>
                          <div className="p-4 bg-slate-900/5 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-2xl shadow-sm h-full">
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Assigned Judge</p>
                            <p className="text-slate-705 dark:text-slate-200 font-bold mt-1 text-sm">
                              {isHearingsActive || isDisposed ? "Hon. Judge Patil, Court Room 4" : "Under Registry Review"}
                            </p>
                          </div>
                        </TiltCard>
                        <TiltCard>
                          <div className="p-4 bg-slate-900/5 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-2xl shadow-sm h-full">
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Next Hearing</p>
                            <p className="text-slate-705 dark:text-slate-200 font-bold mt-1 text-sm">
                              {isHearingsActive ? "Tomorrow at 10:30 AM" : (isDisposed ? "Decree Passed / Disposed" : "Admissibility Pending")}
                            </p>
                          </div>
                        </TiltCard>
                      </div>

                      {/* Case Tracking timeline */}
                      <div className="space-y-6 pt-4">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Filing Pipeline Status</h3>
                        
                        {/* Horizontal flow line for larger screens */}
                        <div className="hidden md:flex justify-between relative pt-8 pb-4">
                          {/* Animated background line fill */}
                          <div className="absolute top-[41px] left-[5%] right-[5%] h-1 bg-slate-200 dark:bg-slate-800 z-0 rounded-full" />
                          <motion.div 
                            className="absolute top-[41px] left-[5%] h-1 bg-emerald-500 z-0 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ 
                              width: `${(dynamicSteps.filter(s => s.status === "completed").length / (dynamicSteps.length - 1)) * 90}%`
                            }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                          />
                          
                          {dynamicSteps.map((step, idx) => {
                            const isCompleted = step.status === "completed";
                            const isActive = step.status === "active";
                            return (
                              <div key={idx} className="flex flex-col items-center text-center w-28 relative z-10">
                                {/* Dot indicator */}
                                <motion.div
                                  whileHover={{ scale: 1.15 }}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                                    isCompleted
                                      ? "bg-emerald-500 border-emerald-400 text-slate-950"
                                      : isActive
                                      ? "bg-yellow-500 border-yellow-400 text-slate-950 animate-pulse-gold scale-110"
                                      : "bg-white dark:bg-slate-950 border-black/5 dark:border-white/5 text-slate-500 dark:text-slate-650"
                                  }`}
                                >
                                  {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                                </motion.div>
                                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200 mt-2.5 leading-tight">
                                  {step.label}
                                </span>
                                {step.date && (
                                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5 font-semibold">
                                    {step.date}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Vertical timeline stack for mobile screens */}
                        <div className="flex md:hidden flex-col gap-5 pl-4 border-l border-slate-200 dark:border-slate-800 relative">
                          {dynamicSteps.map((step, idx) => {
                            const isCompleted = step.status === "completed";
                            const isActive = step.status === "active";
                            return (
                              <div key={idx} className="flex gap-4 items-start relative">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border shrink-0 mt-0.5 ${
                                    isCompleted
                                      ? "bg-emerald-500 border-emerald-400 text-white"
                                      : isActive
                                      ? "bg-yellow-500 border-yellow-400 text-slate-950 animate-pulse font-bold"
                                      : "bg-white dark:bg-slate-950 border-black/5 dark:border-white/5 text-slate-505 dark:text-slate-600"
                                  }`}
                                >
                                  {isCompleted ? "✓" : idx + 1}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">{step.label}</p>
                                  {step.date && <p className="text-[9px] text-slate-500 mt-0.5">{step.date}</p>}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* TAB 3: APPEAL ASSISTANT */}
            {activeTab === "appeal-assistant" && (
              <motion.div
                key="appeal-assistant-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                <div className="border-b border-black/5 dark:border-white/5 pb-4">
                  <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">AI Appeal Evaluation Guidance</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Determine if a judgement qualifies for an appeal, estimate limitations, and download templates.</p>
                </div>

                <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl text-xs text-slate-500 dark:text-slate-400 leading-normal">
                  <strong className="text-yellow-605 dark:text-yellow-500">Legal Warning Notice:</strong> The Appeal Assistant computes limitation periods based on standard Limitation Act schedules. It will not write legal briefs or simulate fake testimonies. Always verify filing schedules with your matching advocate.
                </div>

                <form onSubmit={checkAppealAdvice} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-slate-550 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Date of Judgement Decree</label>
                      <input
                        type="date"
                        required
                        className="w-full bg-white/60 dark:bg-slate-950/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-805 dark:text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-slate-550 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Court which issued Decree</label>
                      <input
                        type="text"
                        placeholder="e.g., Civil Court Pune Junior Division"
                        required
                        value={appealQuery}
                        onChange={(e) => setAppealQuery(e.target.value)}
                        className="w-full bg-white/60 dark:bg-slate-955/60 border border-black/5 dark:border-white/5 rounded-xl px-3 py-2.5 text-slate-805 dark:text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <RippleWrapper>
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-extrabold transition-all text-xs cursor-pointer shadow-md"
                    >
                      Analyze Appeal Limitations
                    </button>
                  </RippleWrapper>
                </form>

                {/* Appeal Advice output card */}
                <AnimatePresence>
                  {appealResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="border border-black/5 dark:border-white/5 bg-white/40 dark:bg-slate-955/40 rounded-3xl p-5 space-y-4 text-xs sm:text-sm"
                    >
                      <div className="flex justify-between items-center flex-wrap gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-yellow-605 dark:text-yellow-500 uppercase tracking-wide">
                            Guidance Overview
                          </span>
                          <h4 className="text-md font-bold text-slate-800 dark:text-slate-100 mt-1.5">
                            Appeal Qualification Analysis
                          </h4>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-405 font-bold text-[10px]">
                          {appealResult.available}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Limitation Period (Deadline):</p>
                          <p className="text-slate-808 dark:text-slate-200 font-bold flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-yellow-500" />
                            {appealResult.timeline}
                          </p>
                          <p className="text-[10px] text-slate-505 dark:text-slate-500">
                            Governed by: {appealResult.statute}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Recommended Appellate Court:</p>
                          <p className="text-slate-808 dark:text-slate-200 font-bold flex items-center gap-1.5">
                            <MapPin className="w-4 h-4 text-yellow-500" />
                            {appealResult.court}
                          </p>
                        </div>
                      </div>

                      <p className="text-slate-600 dark:text-slate-350 text-xs leading-relaxed bg-white/60 dark:bg-slate-950/40 p-4 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner">
                        <strong>AI Explainer:</strong> {appealResult.notes}
                      </p>

                      {/* Download appeal templates */}
                      <div className="space-y-3 pt-3 border-t border-black/5 dark:border-white/5">
                        <p className="text-slate-505 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">Download Appeal Memorandums Templates:</p>
                        {appealResult.templates.map((tmpl: string) => (
                          <div key={tmpl} className="flex justify-between items-center p-3 bg-white/40 dark:bg-slate-900/50 border border-black/5 dark:border-white/5 rounded-xl">
                            <span className="font-bold text-slate-700 dark:text-slate-300 text-xs">{tmpl}</span>
                            <RippleWrapper>
                              <button
                                type="button"
                                className="px-3 py-1.5 bg-black/5 dark:bg-slate-950 hover:bg-black/10 dark:hover:bg-white/5 border border-black/5 dark:border-white/5 text-yellow-600 dark:text-yellow-500 rounded-lg flex items-center gap-1.5 text-[10px] cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" /> Download Memo
                              </button>
                            </RippleWrapper>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* TAB 4: NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 text-left"
              >
                <div className="border-b border-black/5 dark:border-white/5 pb-4">
                  <h2 className="text-xl font-bold text-slate-805 dark:text-slate-100">Registry Notifications Feed</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">Recent SMS/email transmissions sent to your registered number.</p>
                </div>

                <div className="space-y-4">
                  <motion.div 
                    whileHover={{ scale: 1.005 }}
                    className="p-5 bg-white/40 dark:bg-slate-950/40 border border-black/5 dark:border-white/5 rounded-2xl flex gap-4 items-start shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex gap-2 items-center flex-wrap">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">CNR Number Confirmed by Registrar</h4>
                        <span className="text-[9px] text-slate-500">Jul 16, 2026 at 2:30 PM</span>
                      </div>
                      <p className="text-xs text-slate-505 dark:text-slate-400 mt-1 leading-relaxed">
                        Your partition claim has been validated. Registry has issued CNR number <strong className="text-yellow-600 dark:text-yellow-500">MHPU02-89210-2026</strong>.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.005 }}
                    className="p-5 bg-white/40 dark:bg-slate-955/40 border border-black/5 dark:border-white/5 rounded-2xl flex gap-4 items-start shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex gap-2 items-center flex-wrap">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Hearing Scheduled (Hon. Judge Deshpande)</h4>
                        <span className="text-[9px] text-slate-500">Jul 15, 2026 at 11:15 AM</span>
                      </div>
                      <p className="text-xs text-slate-505 dark:text-slate-400 mt-1 leading-relaxed">
                        First cause hearing schedule verified by Clerk. Courtroom No 4, Subordinate Civil Court Pune on Aug 14, 2026 at 10:30 AM.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
