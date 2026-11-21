"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      // Successful login -> redirect to dashboard
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid username or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        {/* Back link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#785A1D] hover:text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Advaita Tattva</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#E7E0D4] shadow-xl p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle top brass accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B38A38]/30 via-[#B38A38] to-[#B38A38]/30" />

          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-block p-1.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E0D4] shadow-xs mb-3">
              <Image
                src="/brand/advaita-tattva-logo.jpg"
                alt="Advaita Tattva"
                width={64}
                height={64}
                className="h-16 w-16 object-contain rounded-xl"
                priority
              />
            </div>
            <h1 className="font-serif text-2xl font-bold tracking-wider uppercase text-[#1C1917]">
              Admin Portal
            </h1>
            <p className="text-xs text-[#6E655E] mt-1">
              Secure catalog, product & video management system
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <span className="font-semibold text-red-800">Error:</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs font-medium uppercase tracking-wider text-[#44403C] mb-1.5"
              >
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#A8A29E] pointer-events-none">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#D8CCBD] bg-[#FAF8F5]/50 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#B38A38] focus:ring-2 focus:ring-[#B38A38]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-medium uppercase tracking-wider text-[#44403C] mb-1.5"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#A8A29E] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#D8CCBD] bg-[#FAF8F5]/50 text-sm text-[#1C1917] placeholder:text-[#A8A29E] focus:outline-none focus:border-[#B38A38] focus:ring-2 focus:ring-[#B38A38]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#A8A29E] hover:text-[#1C1917] transition-colors cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-[#1C1917] hover:bg-[#B38A38] text-white text-xs font-semibold tracking-widest uppercase transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-[#E7E0D4] text-center">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#785A1D]">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-medium">Authorized Administrator Access Only</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
