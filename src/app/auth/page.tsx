"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      if (!name.trim()) { setError("ERROR: Name is required"); setLoading(false); return; }
      const ok = await signUp(name.trim(), email.trim(), password);
      if (!ok) { setError("ERROR: Email already registered"); setLoading(false); return; }
    } else {
      const ok = await signIn(email.trim(), password);
      if (!ok) { setError("ERROR: Invalid credentials"); setLoading(false); return; }
    }

    router.push("/curriculum");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in-up">
        {/* Logo */}
        <div className="mb-10 flex flex-col items-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center bg-[#FFC517] text-lg font-black text-[#0A0A0F]">
            F
          </div>
          <h1 className="text-[18px] font-bold text-[#E8E8ED]">FHEVM.bootcamp</h1>
          <p className="mt-2 text-[12px] text-[#3A3D47]">
            {mode === "signin" ? "// authenticate to continue" : "// create new account"}
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex border border-[#1A1D27]">
          <button
            onClick={() => { setMode("signin"); setError(""); }}
            className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition ${
              mode === "signin"
                ? "bg-[#FFC517]/10 text-[#FFC517] border-b-2 border-[#FFC517]"
                : "text-[#3A3D47] hover:text-[#5A5F73]"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode("signup"); setError(""); }}
            className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-widest transition ${
              mode === "signup"
                ? "bg-[#FFC517]/10 text-[#FFC517] border-b-2 border-[#FFC517]"
                : "text-[#3A3D47] hover:text-[#5A5F73]"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-[#3A3D47]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="your_name"
                className="w-full border border-[#1A1D27] bg-[#0F1117] px-4 py-3 text-[13px] text-[#B8BCC8] placeholder-[#2A2D37] outline-none transition focus:border-[#FFC517]/40 focus:shadow-[0_0_0_1px_rgba(255,197,23,0.1)]"
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-[#3A3D47]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="w-full border border-[#1A1D27] bg-[#0F1117] px-4 py-3 text-[13px] text-[#B8BCC8] placeholder-[#2A2D37] outline-none transition focus:border-[#FFC517]/40 focus:shadow-[0_0_0_1px_rgba(255,197,23,0.1)]"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[10px] uppercase tracking-widest text-[#3A3D47]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="min 6 chars"
              required
              minLength={6}
              className="w-full border border-[#1A1D27] bg-[#0F1117] px-4 py-3 text-[13px] text-[#B8BCC8] placeholder-[#2A2D37] outline-none transition focus:border-[#FFC517]/40 focus:shadow-[0_0_0_1px_rgba(255,197,23,0.1)]"
            />
          </div>

          {error && (
            <div className="border border-[#FF4444]/20 bg-[#FF4444]/5 px-4 py-2.5 text-[12px] text-[#FF4444]">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group w-full flex items-center justify-center gap-2 bg-[#FFC517] py-3 text-[12px] font-bold uppercase tracking-widest text-[#0A0A0F] transition hover:bg-white hover:shadow-[0_0_20px_rgba(255,197,23,0.15)] disabled:opacity-50"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin border-2 border-[#0A0A0F]/30 border-t-[#0A0A0F]" />
            ) : (
              <>
                {mode === "signin" ? "> AUTHENTICATE" : "> CREATE_ACCOUNT"}
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[12px] text-[#3A3D47]">
          {mode === "signin" ? "No account?" : "Already registered?"}{" "}
          <button
            onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); }}
            className="text-[#5A5F73] transition hover:text-[#FFC517]"
          >
            [{mode === "signin" ? "sign_up" : "sign_in"}]
          </button>
        </p>

        <div className="mt-6 text-center text-[10px] text-[#2A2D37] uppercase tracking-widest">
          Encrypted with FHE — your data stays private
        </div>
      </div>
    </div>
  );
}
