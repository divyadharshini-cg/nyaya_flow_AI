"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  Briefcase,
  UserCheck,
  Scale,
  Lock,
  ArrowLeft,
  Key,
  Database,
  Building
} from "lucide-react";
import NeuralNetworkCanvas from "@/components/neural-network";
import { apiAuthLogin } from "@/utils/api";

interface RoleConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  borderColor: string;
  dashboardPath: string;
  fieldLabel: string;
  placeholder: string;
  autofillValue: string;
  pinLabel?: string;
  autofillPin?: string;
}

export default function AuthPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<RoleConfig | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [pinValue, setPinValue] = useState("");
  const [loading, setLoading] = useState(false);

  const roles: RoleConfig[] = [
    {
      id: "citizen",
      name: "Citizen / Litigant",
      icon: User,
      color: "bg-emerald-500/10 text-emerald-400",
      borderColor: "border-emerald-500/35",
      dashboardPath: "/citizen/dashboard",
      fieldLabel: "Aadhaar Number / Phone Number",
      placeholder: "e.g., 9988-7766-5544 or +91 9876543210",
      autofillValue: "5544-6677-8899",
      pinLabel: "OTP Code received on Mobile",
      autofillPin: "482091",
    },
    {
      id: "advocate",
      name: "Advocate / Lawyer",
      icon: Scale,
      color: "bg-yellow-500/10 text-yellow-500",
      borderColor: "border-yellow-500/35",
      dashboardPath: "/advocate/dashboard",
      fieldLabel: "Bar Council Registration Number",
      placeholder: "e.g., MAH/19283/2018",
      autofillValue: "BCI/DEL/4921-2015",
      pinLabel: "Advocate Private Key / PIN",
      autofillPin: "772291",
    },
    {
      id: "police",
      name: "Police / Investigating Officer",
      icon: Shield,
      color: "bg-blue-500/10 text-blue-400",
      borderColor: "border-blue-500/35",
      dashboardPath: "/police/dashboard",
      fieldLabel: "Police Officer ID / Badge Number",
      placeholder: "e.g., IO-92831-MUM",
      autofillValue: "IPS-89210-DL",
      pinLabel: "Station Code / Pin",
      autofillPin: "110001",
    },
    {
      id: "registrar",
      name: "Court Registrar / Clerk",
      icon: Building,
      color: "bg-cyan-500/10 text-cyan-400",
      borderColor: "border-cyan-500/35",
      dashboardPath: "/registrar/dashboard",
      fieldLabel: "Registrar ID / Employee Code",
      placeholder: "e.g., REG-82910-SC",
      autofillValue: "REG-44912-DL",
      pinLabel: "Secure Bench PIN",
      autofillPin: "889921",
    },
    {
      id: "judge",
      name: "Judicial Officer / Judge",
      icon: UserCheck,
      color: "bg-purple-500/10 text-purple-400",
      borderColor: "border-purple-500/35",
      dashboardPath: "/judge/dashboard",
      fieldLabel: "Judge Registry PIN / COP Code",
      placeholder: "e.g., JUD-SC-0021",
      autofillValue: "JUD-DL-0049",
      pinLabel: "Secure Bench Code",
      autofillPin: "004922",
    },
    {
      id: "administrator",
      name: "System Administrator",
      icon: Database,
      color: "bg-amber-500/10 text-amber-500",
      borderColor: "border-amber-500/35",
      dashboardPath: "/admin/dashboard",
      fieldLabel: "Admin Access ID",
      placeholder: "e.g., ADMIN-ROOT-01",
      autofillValue: "ADMIN-SYS-99",
      pinLabel: "Sovereign Audit Code",
      autofillPin: "990022",
    },
  ];

  const handleRoleSelect = (role: RoleConfig) => {
    setSelectedRole(role);
    setFieldValue("");
    setPinValue("");
  };

  const handleAutofill = () => {
    if (!selectedRole) return;
    setFieldValue(selectedRole.autofillValue);
    if (selectedRole.autofillPin) {
      setPinValue(selectedRole.autofillPin);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole || !fieldValue) return;

    setLoading(true);
    try {
      const email = `${selectedRole.id}-test@nyayaflow.gov.in`;
      const fullName = selectedRole.id === "citizen" ? "Aditya Patil" : selectedRole.name;
      const phone = selectedRole.id === "citizen" ? "+91 98765 43210" : undefined;
      
      const res = await apiAuthLogin(email, fullName, selectedRole.id, phone);
      if (res.success) {
        localStorage.setItem("user", JSON.stringify(res));
        router.push(selectedRole.dashboardPath);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      {/* Background Neural Node Canvas */}
      <NeuralNetworkCanvas />

      {/* Decorative radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.2),transparent_70%)] pointer-events-none" />

      {/* Auth Card Container */}
      <div className="relative z-10 w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl glass-panel">
        
        {/* Header back link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-yellow-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Landing Page
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {!selectedRole ? (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 text-xs sm:text-sm"
            >
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
                  Select Judicial Role
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Choose your respective dashboard workspace portal to sign in.
                </p>
              </div>

              {/* Roles Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role)}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-4 hover:bg-slate-900/80 transition-all duration-300 ${role.borderColor} hover:scale-102 cursor-pointer bg-slate-950/20`}
                    >
                      <div className={`p-2.5 rounded-xl ${role.color} shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-slate-200 group-hover:text-slate-100">
                          {role.name}
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Access verified platform tools
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-center text-[10px] text-slate-500 pt-4 border-t border-slate-850">
                NyayaFlow AI does not manage official court identities. Simulated credential logs are loaded locally.
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6 text-xs sm:text-sm"
            >
              {/* Back button */}
              <button
                onClick={() => setSelectedRole(null)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-yellow-500"
              >
                ← Back to Roles
              </button>

              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${selectedRole.color}`}>
                  <selectedRole.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Signing in as {selectedRole.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500">
                    Secure Sandbox authentication node.
                  </p>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-400 font-medium">
                      {selectedRole.fieldLabel}
                    </label>
                    <button
                      type="button"
                      onClick={handleAutofill}
                      className="text-[10px] text-yellow-500 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <Key className="w-3 h-3" /> Quick Autofill Test
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={fieldValue}
                    onChange={(e) => setFieldValue(e.target.value)}
                    placeholder={selectedRole.placeholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-yellow-500/80 transition-colors"
                  />
                </div>

                {selectedRole.pinLabel && (
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">
                      {selectedRole.pinLabel}
                    </label>
                    <input
                      type="password"
                      required
                      value={pinValue}
                      onChange={(e) => setPinValue(e.target.value)}
                      placeholder="••••••"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-100 tracking-widest focus:outline-none focus:border-yellow-500/80 transition-colors"
                    />
                  </div>
                )}

                {/* Human in the loop alert note */}
                <div className="p-3.5 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex items-start gap-3">
                  <Lock className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] sm:text-xs text-slate-400 leading-normal">
                    <strong className="text-yellow-500">Security Audit Notice:</strong> NyayaFlow AI acts as advisory layer. Data inputs will not alter official High Court database records without Registrar authorization.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-slate-950 font-bold transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                      Loading Workspace...
                    </>
                  ) : (
                    <>Verify and Open Workspace</>
                  )}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
