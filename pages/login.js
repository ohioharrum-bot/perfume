import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";
import Head from "next/head";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });
        if (error) throw error;
        router.push("/");
      } else {
        if (!form.full_name.trim()) throw new Error("Please enter your name.");
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: { full_name: form.full_name },
          },
        });
        if (error) throw error;
        setSuccess("Account created! Check your email to confirm.");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style>{`
        body { font-family: 'Poppins', sans-serif; }
        .serif { font-family: 'DM Serif Display', serif; }
        .gold { color: var(--color-gold, #b8973a); }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 30px #fafaf9 inset !important;
        }
      `}</style>

      <div className="min-h-screen bg-[#FAFAF9] flex">

        {/* Left Panel — decorative */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#1a1a18] flex-col justify-between p-12 relative overflow-hidden">
          {/* subtle pattern */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                #b8973a 0px,
                #b8973a 1px,
                transparent 1px,
                transparent 12px
              )`,
            }}
          />

          {/* Logo */}
          <div className="relative z-10">
            <Link href="/">
              <span className="serif text-white text-2xl tracking-wide cursor-pointer">
                Scentd
              </span>
            </Link>
          </div>

          {/* Center quote */}
          <div className="relative z-10">
            <div
              className="text-[#b8973a] text-5xl serif leading-none mb-6"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              "Scent is the closest thing to a time machine."
            </div>
            <p className="text-gray-500 text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Buy and sell premium fragrances with confidence.
            </p>
          </div>

          {/* Bottom */}
          <div className="relative z-10 flex gap-6">
            {["10k+ Listings", "Verified Sellers", "Secure Payments"].map((t) => (
              <div key={t}>
                <div className="text-white text-xs font-medium" style={{ fontFamily: "'Poppins', sans-serif" }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel — form */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">

            {/* Mobile logo */}
            <div className="lg:hidden mb-8">
              <Link href="/">
                <span className="serif text-gray-900 text-2xl tracking-wide cursor-pointer" style={{ fontFamily: "'DM Serif Display', serif" }}>
                  Scentd
                </span>
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1
                className="text-3xl font-normal text-gray-900 mb-2"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {isLogin ? "Welcome back" : "Create account"}
              </h1>
              <p className="text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {isLogin
                  ? "Sign in to manage your listings and messages."
                  : "Join thousands of fragrance lovers today."}
              </p>
            </div>

            {/* Toggle */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              {["Sign In", "Sign Up"].map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => { setIsLogin(i === 0); setError(""); setSuccess(""); }}
                  className={`flex-1 py-2 text-sm rounded-lg transition-all ${
                    (i === 0) === isLogin
                      ? "bg-white text-gray-900 shadow-sm font-medium"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full name — signup only */}
              {!isLogin && (
                <div>
                  <label
                    className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wider"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    value={form.full_name}
                    onChange={(e) => set("full_name", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#fafaf9] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  />
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wider"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#fafaf9] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    className="block text-xs font-medium text-gray-600 uppercase tracking-wider"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Password
                  </label>
                  {isLogin && (
                    <Link
                      href="/forgot-password"
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <input
                  type="password"
                  placeholder={isLogin ? "••••••••" : "Min. 6 characters"}
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-[#fafaf9] text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-500"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div
                  className="px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {success}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#1a1a18] text-white text-sm font-medium tracking-wide hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-2"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {loading
                  ? isLogin ? "Signing in..." : "Creating account..."
                  : isLogin ? "Sign In" : "Create Account"}
              </button>

            </form>

            {/* Footer */}
            <p
              className="mt-8 text-center text-xs text-gray-400"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              By continuing you agree to our{" "}
              <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
            </p>
          </div>
        </div>

      </div>
    </>
  );
}