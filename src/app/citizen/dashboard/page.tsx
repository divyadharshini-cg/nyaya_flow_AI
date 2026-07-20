"use client";

import { useState, useEffect } from "react";
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

// Timeline steps for Case Tracking
const trackingSteps = [
  { label: "Application Submitted", status: "completed", date: "Jul 10, 2026" },
  { label: "Registry Review", status: "completed", date: "Jul 12, 2026" },
  { label: "Hard Copy Submitted", status: "completed", date: "Jul 14, 2026" },
  { label: "Court Registered", status: "completed", date: "Jul 15, 2026" },
  { label: "Official CNR Received", status: "active", date: "Jul 16, 2026" },
  { label: "Judge Assigned", status: "pending", date: "" },
  { label: "Hearings", status: "pending", date: "" },
  { label: "Judgment Issued", status: "pending", date: "" },
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
    }, 1500);
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

  // Run OCR Document audit
  const runDocAudit = async () => {
    setUploadingFiles(true);
    try {
      const res = await apiAuditDocument(
        classificationResult?.id || null,
        "Litigant Petition Memo.pdf",
        problemDescription,
        classificationResult?.category || "Petition"
      );
      if (res.success) {
        setHealthScore(res.healthScore);
        setHealthIssues(res.issues);
        setHealthCheckRun(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
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
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 text-xs sm:text-sm">
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 p-4">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 pb-4 border-b border-slate-800/80">
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-yellow-600 to-emerald-600 flex items-center justify-center font-bold text-white text-xs">
              NF
            </div>
            <span className="font-bold tracking-wider text-slate-100">
              NYAYA<span className="text-yellow-500">FLOW</span>
            </span>
          </div>

          {/* User profile capsule */}
          <div className="flex gap-3 items-center p-2.5 bg-slate-950/40 rounded-xl border border-slate-850">
            <div className="w-9 h-9 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center font-bold text-yellow-500">
              AP
            </div>
            <div>
              <p className="font-bold text-slate-200">Aditya Patil</p>
              <p className="text-[10px] text-slate-500">Citizen litigant</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("new-petition")}
              className={`w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold transition-all text-left ${
                activeTab === "new-petition"
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <FileText className="w-4 h-4" />
              New Petition Wizard
            </button>

            <button
              onClick={() => setActiveTab("track-case")}
              className={`w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold transition-all text-left ${
                activeTab === "track-case"
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <Scale className="w-4 h-4" />
              Track Active Case
            </button>

            <button
              onClick={() => setActiveTab("appeal-assistant")}
              className={`w-full p-2.5 rounded-lg flex items-center gap-3 font-semibold transition-all text-left ${
                activeTab === "appeal-assistant"
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Appeal Assistant
            </button>

            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full p-2.5 rounded-lg flex items-center justify-between font-semibold transition-all text-left ${
                activeTab === "notifications"
                  ? "bg-yellow-500 text-slate-950"
                  : "text-slate-400 hover:bg-slate-850 hover:text-slate-200"
              }`}
            >
              <span className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                Notifications
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-red-500 text-white font-bold">
                2
              </span>
            </button>
          </nav>
        </div>

        {/* Logout block */}
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
      <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-5xl mx-auto w-full space-y-6">
        
        {/* Banner Safety Warnings */}
        <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-[11px] text-emerald-400 font-medium">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span><strong>Human in Command:</strong> NyayaFlow AI will never auto-submit applications, select advocates, or reject your submissions. You retain complete agency over your petition files.</span>
        </div>

        {/* TABS CONTAINER */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl glass-panel relative min-h-[500px]">
          
          {/* TAB 1: NEW PETITION WIZARD */}
          {activeTab === "new-petition" && (
            <div className="space-y-6">
              
              {/* Wizard Steps Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-100">Filing New Petition Wizard</h2>
                  <p className="text-slate-400 text-xs mt-0.5">Let AI guide you to classify your claim and identify correct paperwork.</p>
                </div>
                <div className="flex gap-1 text-[10px] font-semibold">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      onClick={() => {
                        // Allow navigation if step is completed
                        if (s < wizardStep) setWizardStep(s);
                      }}
                      className={`px-2.5 py-1 rounded cursor-pointer transition-all ${
                        s === wizardStep
                          ? "bg-yellow-500 text-slate-950 font-bold"
                          : s < wizardStep
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-850 text-slate-500 border border-transparent"
                      }`}
                    >
                      Step 0{s}
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 1: COLLECT PERSONAL DETAILS */}
              {wizardStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-slate-200">Step 1: Litigant Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Full Legal Name</label>
                      <input
                        type="text"
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Age</label>
                      <input
                        type="text"
                        value={personalInfo.age}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, age: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Gender</label>
                      <select
                        value={personalInfo.gender}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, gender: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      >
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Phone Number</label>
                      <input
                        type="text"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Email</label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Occupation</label>
                      <input
                        type="text"
                        value={personalInfo.occupation}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, occupation: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-3">
                      <label className="text-slate-400 font-semibold">Full Residential Address</label>
                      <input
                        type="text"
                        value={personalInfo.address}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">District</label>
                      <input
                        type="text"
                        value={personalInfo.district}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, district: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">State</label>
                      <input
                        type="text"
                        value={personalInfo.state}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, state: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Pincode</label>
                      <input
                        type="text"
                        value={personalInfo.pincode}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, pincode: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Preferred Language</label>
                      <input
                        type="text"
                        value={personalInfo.language}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, language: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Identity Proof Type</label>
                      <input
                        type="text"
                        value={personalInfo.idProof}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, idProof: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-semibold">Aadhaar (Optional/Secure)</label>
                      <input
                        type="text"
                        value={personalInfo.aadhaar}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, aadhaar: e.target.value })}
                        placeholder="XXXX-XXXX-XXXX"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="px-5 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold flex items-center gap-1.5"
                    >
                      Next: Describe Dispute <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: DESCRIBE DISPUTE IN ANY LANGUAGE */}
              {wizardStep === 2 && (
                <div className="space-y-5">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      Step 2: Describe your Dispute
                    </h3>
                    <button
                      onClick={triggerVoiceSimulation}
                      className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 text-xs transition-colors ${
                        isRecording
                          ? "bg-red-500/20 border-red-500/50 text-red-400 animate-pulse"
                          : "bg-slate-950 hover:bg-slate-850 border-slate-800 hover:border-yellow-500/40 text-yellow-500"
                      }`}
                    >
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      {isRecording ? "Listening to Voice..." : "Dictate in Any Language"}
                    </button>
                  </div>

                  <p className="text-slate-400 text-xs leading-normal">
                    Explain what happened in detail. You can dictate or type in Hindi, Marathi, Tamil, Bengali, Telugu, Kannada, English, or any local Indian language.
                  </p>

                  <textarea
                    rows={6}
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Type the details of your complaint here..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:outline-none focus:border-yellow-500/50 text-xs sm:text-sm"
                  />

                  {/* Submit to AI evaluation */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg font-semibold hover:bg-slate-800"
                    >
                      Back
                    </button>

                    <button
                      disabled={!problemDescription || analyzingCase}
                      onClick={runCaseClassification}
                      className="px-5 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {analyzingCase ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Analyzing Dispute...
                        </>
                      ) : (
                        <>AI Case Categorization Audit</>
                      )}
                    </button>
                  </div>

                  {/* AI Classification response block */}
                  <AnimatePresence>
                    {classificationResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="border border-yellow-500/20 bg-slate-950/80 rounded-2xl p-5 space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-yellow-500 tracking-wider uppercase">
                              Gemini Advisory Breakdown
                            </span>
                            <h4 className="text-md font-bold text-slate-100">
                              {classificationResult.category}
                            </h4>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                            AI Confidence: {classificationResult.confidence}
                          </span>
                        </div>

                        {/* Brief explanation */}
                        <div className="text-slate-300 bg-slate-900/60 p-3.5 rounded-xl border border-slate-850">
                          <p className="font-bold text-slate-200 mb-1 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 text-yellow-500" />
                            Simplified Case Summary
                          </p>
                          <p className="text-[11px] leading-relaxed text-slate-400">
                            {classificationResult.simpleExplanation}
                          </p>
                        </div>

                        {/* Legal info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-slate-400 font-semibold">Suggested Statutes / Acts:</p>
                            <ul className="list-disc pl-4 space-y-1 text-slate-300 text-[11px]">
                              {classificationResult.acts.map((act: string) => (
                                <li key={act}>{act}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="space-y-1">
                            <p className="text-slate-400 font-semibold">Suggested Court & Location:</p>
                            <p className="text-slate-200 font-medium flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                              {classificationResult.suggestedCourt}
                            </p>
                            <p className="text-[10px] text-slate-500 mt-1">
                              <strong>Estimated Timeline:</strong> {classificationResult.timeline}
                            </p>
                          </div>
                        </div>

                        {/* Required Docs list */}
                        <div className="space-y-2">
                          <p className="text-slate-400 font-semibold">Required Filing Documents Checklist:</p>
                          <div className="flex flex-wrap gap-2">
                            {classificationResult.documents.map((doc: string) => (
                              <span
                                key={doc}
                                className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
                              >
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Proceed to next step */}
                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => setWizardStep(3)}
                            className="px-5 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold flex items-center gap-1"
                          >
                            Next: Select Advocate <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* STEP 3: ADVOCATE SELECTION */}
              {wizardStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-200">Step 3: Advocate (Lawyer) Selection</h3>
                  
                  <div className="space-y-3">
                    <p className="text-slate-400 font-medium">Do you already have a legal advocate representing you?</p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setHasAdvocate("yes")}
                        className={`px-5 py-3 rounded-xl border font-bold transition-all text-sm flex-1 ${
                          hasAdvocate === "yes"
                            ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        YES, I have my own advocate
                      </button>
                      <button
                        onClick={() => setHasAdvocate("no")}
                        className={`px-5 py-3 rounded-xl border font-bold transition-all text-sm flex-1 ${
                          hasAdvocate === "no"
                            ? "bg-yellow-500/10 border-yellow-500 text-yellow-500"
                            : "bg-slate-950 border-slate-800 text-slate-400"
                        }`}
                      >
                        NO, show AI matching recommendations
                      </button>
                    </div>
                  </div>

                  {/* Case 1: Has Advocate */}
                  {hasAdvocate === "yes" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="space-y-4 border border-slate-800 bg-slate-950/20 p-5 rounded-2xl"
                    >
                      <h4 className="font-bold text-slate-200">Enter Advocate Legal Credentials</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-1">
                          <label className="text-slate-400">Advocate Name</label>
                          <input
                            type="text"
                            value={advocateDetails.name}
                            onChange={(e) => setAdvocateDetails({ ...advocateDetails, name: e.target.value })}
                            placeholder="e.g., Adv. Rajesh Kumar"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Bar Council Registration No</label>
                          <input
                            type="text"
                            value={advocateDetails.barNo}
                            onChange={(e) => setAdvocateDetails({ ...advocateDetails, barNo: e.target.value })}
                            placeholder="e.g., BCI/MAH/8921/2012"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-slate-400">Phone Code / Email</label>
                          <input
                            type="text"
                            value={advocateDetails.phone}
                            onChange={(e) => setAdvocateDetails({ ...advocateDetails, phone: e.target.value })}
                            placeholder="e.g., +91 99112 23344"
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Case 2: Wants AI Recommendations */}
                  {hasAdvocate === "no" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
                          <UserCheck className="w-4 h-4 text-emerald-400" />
                          NyayaFlow AI Advocate Advisor
                        </h4>
                        <span className="text-[10px] text-yellow-500 bg-yellow-500/5 px-2 py-0.5 rounded border border-yellow-500/10">
                          ⚠️ Advice Only: Litigants make the final selection
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        {advocates.map((lawyer) => {
                          const isSelected = selectedRecommendedLawyer === lawyer.id;
                          return (
                            <div
                              key={lawyer.id}
                              className={`p-4 rounded-2xl border transition-all duration-300 text-left cursor-pointer ${
                                isSelected
                                  ? "bg-slate-900 border-yellow-500/60 shadow-lg"
                                  : "bg-slate-950/40 border-slate-850 hover:border-slate-800"
                              }`}
                              onClick={() => setSelectedRecommendedLawyer(lawyer.id)}
                            >
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h5 className="font-bold text-slate-100 text-sm">{lawyer.full_name || lawyer.name}</h5>
                                    <span className="px-2 py-0.5 rounded-full text-[9px] bg-slate-800 text-slate-400">
                                      {lawyer.experience_years ? `${lawyer.experience_years} Yrs` : lawyer.experience} Exp
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-500">
                                    <strong>Languages:</strong> {lawyer.languages} | <strong>Specialty:</strong> {lawyer.specialization}
                                  </p>
                                </div>
                                <div className="text-right sm:text-right shrink-0">
                                  <p className="font-bold text-yellow-500">{lawyer.fee_estimate || lawyer.feeEstimate}</p>
                                  <p className="text-[9px] text-slate-500 italic">{lawyer.availability}</p>
                                </div>
                              </div>

                              {/* AI recommendation reasoning */}
                              <div className="mt-3 p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-[10px] sm:text-xs text-slate-400">
                                <strong className="text-emerald-400">Why matched:</strong> {lawyer.reason || "Matched profile constraints."}
                              </div>

                              {/* Click Select Action */}
                              <div className="mt-3 flex justify-end">
                                <button
                                  type="button"
                                  className={`px-3 py-1 text-[10px] rounded font-bold transition-all ${
                                    isSelected
                                      ? "bg-emerald-500 text-slate-950"
                                      : "bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800"
                                  }`}
                                >
                                  {isSelected ? "Selected Advocate Match" : "Select this Lawyer"}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg font-semibold hover:bg-slate-800"
                    >
                      Back
                    </button>

                    <button
                      disabled={
                        !hasAdvocate ||
                        (hasAdvocate === "yes" && (!advocateDetails.name || !advocateDetails.barNo)) ||
                        (hasAdvocate === "no" && !selectedRecommendedLawyer)
                      }
                      onClick={() => setWizardStep(4)}
                      className="px-5 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1"
                    >
                      Next: Templates <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: DOWNLOAD TEMPLATES & EXPLANATIONS */}
              {wizardStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-200">Step 4: Official Petition Form Templates</h3>

                  <p className="text-slate-400 text-xs leading-normal">
                    Based on your dispute category (<strong className="text-yellow-500">Property dispute</strong>), download the official format templates authorized by subordinate Indian civil registries.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Template Card 1 */}
                    <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">Official Land Encroachment Petition</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Authorized civil suit format under CPC Section 6.</p>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-850/60">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-yellow-500/30 text-yellow-500 flex items-center gap-1 font-semibold text-[10px]"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF Format
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-yellow-500/30 text-yellow-500 flex items-center gap-1 font-semibold text-[10px]"
                        >
                          <Download className="w-3.5 h-3.5" /> DOCX Format
                        </button>
                      </div>
                    </div>

                    {/* Template Card 2 */}
                    <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-slate-200 text-sm">Verification Affidavit of Boundary Claims</h4>
                        <p className="text-[10px] text-slate-500 mt-1">Official declaration template for boundaries confirmation.</p>
                      </div>
                      <div className="flex gap-2 mt-4 pt-4 border-t border-slate-850/60">
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-yellow-500/30 text-yellow-500 flex items-center gap-1 font-semibold text-[10px]"
                        >
                          <Download className="w-3.5 h-3.5" /> PDF Format
                        </button>
                        <button
                          type="button"
                          className="px-3 py-1.5 rounded bg-slate-900 border border-slate-800 hover:border-yellow-500/30 text-yellow-500 flex items-center gap-1 font-semibold text-[10px]"
                        >
                          <Download className="w-3.5 h-3.5" /> DOCX Format
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/25 rounded-2xl space-y-2">
                    <p className="font-bold text-yellow-500 text-xs flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" />
                      AI Instructions for Filling
                    </p>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      1. Fill in your details matching your Aadhaar card exactly.<br />
                      2. Attach the 7/12 Land Mutation Record as 'Schedule A' on the third page.<br />
                      3. Sign in the presence of an authorized notary advocate. Leave the CNR number blank—the court registrar will update it later.
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setWizardStep(3)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg font-semibold hover:bg-slate-800"
                    >
                      Back
                    </button>

                    <button
                      onClick={() => setWizardStep(5)}
                      className="px-5 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold flex items-center gap-1"
                    >
                      Next: Upload & Validate <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: UPLOAD & AUDIT HEALTH SCORE */}
              {wizardStep === 5 && (
                <div className="space-y-6">
                  <h3 className="text-sm font-bold text-slate-200">Step 5: Upload Files & AI Document Health Check</h3>

                  <p className="text-slate-400 text-xs leading-normal">
                    Upload your filled petition templates and supporting evidence (PDF / Images / Docs). NyayaFlow AI will run scans to verify that all fields, files, and scanning qualities satisfy the registry's filing criteria.
                  </p>

                  <div className="border-2 border-dashed border-slate-850 hover:border-yellow-500/30 rounded-2xl p-8 text-center bg-slate-950/40 relative cursor-pointer group transition-all duration-300">
                    <Upload className="w-8 h-8 text-slate-500 group-hover:text-yellow-500 mx-auto transition-colors" />
                    <p className="font-bold text-slate-300 mt-3">Select files to upload or Drag & Drop</p>
                    <p className="text-[10px] text-slate-500 mt-1">Supported formats: PDF, PNG, JPG, DOCX (Max 25MB total)</p>
                  </div>

                  {/* Simulate Upload progress */}
                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setWizardStep(4)}
                      className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg font-semibold hover:bg-slate-800"
                    >
                      Back
                    </button>

                    <button
                      disabled={uploadingFiles}
                      onClick={runDocAudit}
                      className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {uploadingFiles ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Performing OCR Scan...
                        </>
                      ) : (
                        <>Scan and Analyze Documents</>
                      )}
                    </button>
                  </div>

                  {/* Document health audit output */}
                  <AnimatePresence>
                    {healthCheckRun && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-slate-800 bg-slate-950/60 rounded-2xl p-5 space-y-4"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
                              AI Audit Complete
                            </span>
                            <h4 className="text-md font-bold text-slate-100">Document Health Report</h4>
                          </div>

                          {/* Circular/Text score badge */}
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-black text-yellow-500">{healthScore}%</span>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-bold uppercase">
                              Passable (Safety Target 85%)
                            </span>
                          </div>
                        </div>

                        {/* List of audit warnings */}
                        <div className="space-y-2">
                          <p className="text-slate-400 font-semibold">Identified Issues Checklist ({healthIssues.length})</p>
                          <div className="space-y-2 text-[10px] sm:text-xs">
                            {healthIssues.map((issue, idx) => (
                              <div
                                key={idx}
                                className="flex gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-850 text-slate-300"
                              >
                                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                                <span>{issue}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Send to Registry validation gate */}
                        <div className="pt-4 border-t border-slate-850 flex justify-between items-center gap-4">
                          <p className="text-[10px] text-slate-500 max-w-sm">
                            Score complies with court requirements (88% &gt; 85%). You may send this digitized packet to the Subordinate Court Registry.
                          </p>

                          {!registrySent ? (
                            <button
                              onClick={handleSendToRegistry}
                              className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all text-xs cursor-pointer shadow-lg animate-pulse"
                            >
                              Send Digitized Petition to Court Registry
                            </button>
                          ) : (
                            <div className="flex gap-2 items-center text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-lg">
                              <CheckCircle className="w-4 h-4" />
                              Filing Sent to Sub-Divisional Court Registry
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {registrySent && (
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="space-y-1 text-center sm:text-left">
                        <p className="font-bold text-slate-200">What's Next?</p>
                        <p className="text-xs text-slate-400">
                          Submit your physical copies of 'Boundary Partition Deed' at the court registry within 7 business days for registrar verification.
                        </p>
                      </div>
                      <button
                        onClick={resetPetitionWizard}
                        className="px-4 py-2 rounded bg-yellow-500 text-slate-950 font-bold text-xs"
                      >
                        Reset filing form
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CASE TRACKING */}
          {activeTab === "track-case" && (() => {
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
                <div className="border-b border-slate-800 pb-4 flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">Live Case Tracking Timeline</h2>
                    <p className="text-slate-400 text-xs">Verify current status and dates of hearing.</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-yellow-500">CNR: {activeTrackedPetition.cnr_number || "Registry Processing"}</p>
                    <p className="text-[10px] text-slate-500">Official registry status: {activeTrackedPetition.status}</p>
                  </div>
                </div>

                {/* Litigant overview cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                    <p className="text-slate-500 font-medium">Case Category</p>
                    <p className="text-slate-200 font-bold mt-0.5">{activeTrackedPetition.category}</p>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                    <p className="text-slate-500 font-medium">Assigned Judge</p>
                    <p className="text-slate-200 font-bold mt-0.5">
                      {isHearingsActive || isDisposed ? "Hon. Judge Patil, Court Room 4" : "Under Registry Review"}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950/40 border border-slate-850 rounded-xl">
                    <p className="text-slate-500 font-medium">Next Hearing</p>
                    <p className="text-slate-200 font-bold mt-0.5">
                      {isHearingsActive ? "Tomorrow at 10:30 AM" : (isDisposed ? "Decree Passed / Disposed" : "Admissibility Pending")}
                    </p>
                  </div>
                </div>

                {/* Case Tracking timeline (Amazon style) */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-sm font-bold text-slate-200">Filing Pipeline Status</h3>
                  
                  {/* Horizontal flow line for larger screens */}
                  <div className="hidden md:flex justify-between relative pt-8 pb-4">
                    {/* Background link line */}
                    <div className="absolute top-[41px] left-[5%] right-[5%] h-1 bg-slate-800 z-0" />
                    
                    {dynamicSteps.map((step, idx) => {
                      const isCompleted = step.status === "completed";
                      const isActive = step.status === "active";
                      return (
                        <div key={idx} className="flex flex-col items-center text-center w-28 relative z-10">
                          {/* Dot indicator */}
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted
                                ? "bg-emerald-500 border-emerald-400 text-white"
                                : isActive
                                ? "bg-yellow-500 border-yellow-400 text-slate-950 animate-pulse scale-110"
                                : "bg-slate-950 border-slate-850 text-slate-700"
                            }`}
                          >
                            {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                          </div>
                          <span className="text-[10px] font-bold text-slate-200 mt-2 leading-tight">
                            {step.label}
                          </span>
                          {step.date && (
                            <span className="text-[9px] text-slate-500 mt-0.5">
                              {step.date}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Vertical timeline stack for mobile screens */}
                  <div className="flex md:hidden flex-col gap-4 pl-4 border-l border-slate-800">
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
                                : "bg-slate-950 border-slate-850 text-slate-600"
                            }`}
                          >
                            {isCompleted ? "✓" : idx + 1}
                          </div>
                          <div>
                            <p className="font-bold text-slate-200 text-xs">{step.label}</p>
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

          {/* TAB 3: APPEAL ASSISTANT */}
          {activeTab === "appeal-assistant" && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-slate-100">AI Appeal Evaluation Guidance</h2>
                <p className="text-slate-400 text-xs">Determine if a judgement qualifies for an appeal, estimate limitations, and download templates.</p>
              </div>

              <div className="p-4 bg-yellow-500/5 border border-yellow-500/25 rounded-2xl text-xs text-slate-400 leading-normal">
                <strong className="text-yellow-500">Legal Warning Notice:</strong> The Appeal Assistant computes limitation periods based on standard Limitation Act schedules. It will not write legal briefs or simulate fake testimonies. Always verify filing schedules with your matching advocate.
              </div>

              <form onSubmit={checkAppealAdvice} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold">Date of Judgement Decree</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-slate-400 font-semibold">Court which issued Decree</label>
                    <input
                      type="text"
                      placeholder="e.g., Civil Court Pune Junior Division"
                      required
                      value={appealQuery}
                      onChange={(e) => setAppealQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold transition-all text-xs"
                >
                  Analyze Appeal Limitations
                </button>
              </form>

              {/* Appeal Advice output card */}
              <AnimatePresence>
                {appealResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-slate-800 bg-slate-950/60 rounded-xl p-5 space-y-4 text-xs sm:text-sm"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-bold text-yellow-500 uppercase tracking-wide">
                          Guidance Overview
                        </span>
                        <h4 className="text-md font-bold text-slate-100">Appeal Qualification Analysis</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold text-[10px]">
                        {appealResult.available}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-400 font-semibold">Limitation Period (Deadline):</p>
                        <p className="text-slate-200 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-yellow-500" />
                          {appealResult.timeline}
                        </p>
                        <p className="text-[10px] text-slate-500 mt-1">
                          Governed by: {appealResult.statute}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-semibold">Recommended Appellate Court:</p>
                        <p className="text-slate-200 font-bold flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-yellow-500" />
                          {appealResult.court}
                        </p>
                      </div>
                    </div>

                    <p className="text-slate-400 text-xs leading-normal">
                      <strong>AI Explainer:</strong> {appealResult.notes}
                    </p>

                    {/* Download appeal templates */}
                    <div className="space-y-2 pt-2 border-t border-slate-850/60">
                      <p className="text-slate-500 font-semibold">Download Appeal Memorandums Templates:</p>
                      {appealResult.templates.map((tmpl: string) => (
                        <div key={tmpl} className="flex justify-between items-center p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                          <span className="font-bold text-slate-300">{tmpl}</span>
                          <button
                            type="button"
                            className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-yellow-500 rounded flex items-center gap-1 text-[10px]"
                          >
                            <Download className="w-3 h-3" /> Download Memo
                          </button>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-lg font-bold text-slate-100">Registry Notifications Feed</h2>
                <p className="text-slate-400 text-xs">Recent SMS/email transmissions sent to your registered number.</p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <h4 className="font-bold text-slate-200">CNR Number Confirmed by Registrar</h4>
                      <span className="text-[9px] text-slate-500">Jul 16, 2026 at 2:30 PM</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      Your partition claim has been validated. Registry has issued CNR number <strong className="text-yellow-500">MHPU02-89210-2026</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-xl flex gap-3.5 items-start">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-500 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex gap-2 items-center">
                      <h4 className="font-bold text-slate-200">Hearing Scheduled (Hon. Judge Deshpande)</h4>
                      <span className="text-[9px] text-slate-500">Jul 15, 2026 at 11:15 AM</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 leading-normal">
                      First cause hearing schedule verified by Clerk. Courtroom No 4, Subordinate Civil Court Pune on Aug 14, 2026 at 10:30 AM.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
