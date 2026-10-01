"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      });

      if (!res?.error) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass p-8 rounded-2xl w-full border-t border-l border-white/20 shadow-2xl animate-fade-in relative z-10">
      <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
      <p className="text-gray-400 mb-8 text-sm">Enter your credentials to access your account</p>
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all" placeholder="you@example.com" required />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:bg-white/10 transition-all" placeholder="••••••••" required />
          </div>
        </div>
        <button type="submit" disabled={loading} className="w-full py-3 mt-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 transition-all disabled:opacity-70">
          {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} /></>}
        </button>
      </form>
      <p className="mt-8 text-center text-sm text-gray-400">
        Don't have an account? <Link href={`/register?callbackUrl=${encodeURIComponent(callbackUrl)}`} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Create one</Link>
      </p>
      <div className="mt-8 pt-6 border-t border-white/10 text-xs text-gray-500 space-y-1">
        <p>Demo Admin: admin@store.com / Admin@123456</p>
        <p>Demo User: user@store.com / User@123456</p>
      </div>
    </div>
  );
}