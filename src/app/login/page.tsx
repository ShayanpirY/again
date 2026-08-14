"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Status = { type: "error" | "success"; message: string } | null;

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [loading, setLoading] = useState<"google" | "send" | "verify" | null>(null);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading("send");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "error", message: data?.error ?? "ارسال کد ناموفق بود." });
        return;
      }
      setStep("code");
      setStatus({ type: "success", message: "کد تأیید به ایمیل شما ارسال شد." });
    } catch {
      setStatus({ type: "error", message: "خطا در برقراری ارتباط. دوباره تلاش کنید." });
    } finally {
      setLoading(null);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    setLoading("verify");
    try {
      const result = await signIn("otp", {
        email,
        code,
        redirect: false,
        callbackUrl: "/account",
      });
      if (result?.error) {
        setStatus({ type: "error", message: "کد اشتباه است یا منقضی شده. دوباره تلاش کنید." });
        return;
      }
      router.push("/account");
      router.refresh();
    } catch {
      setStatus({ type: "error", message: "خطا در ورود. دوباره تلاش کنید." });
    } finally {
      setLoading(null);
    }
  }

  async function loginWithGoogle() {
    setStatus(null);
    setLoading("google");
    await signIn("google", { callbackUrl: "/account" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10" style={{ background: "#faf9f7" }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-8" dir="rtl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-3xl font-black tracking-tighter text-[#d97757]">
              کودک
            </Link>
            <h1 className="mt-4 text-xl font-bold text-gray-900">ورود / ثبت‌نام</h1>
            <p className="mt-1.5 text-sm text-gray-500">برای ادامه وارد شوید یا حساب بسازید</p>
          </div>

          {status && (
            <div
              className={cn(
                "mb-5 rounded-xl px-4 py-3 text-sm font-medium",
                status.type === "error" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"
              )}
            >
              {status.message}
            </div>
          )}

          <Button
            type="button"
            onClick={loginWithGoogle}
            disabled={loading !== null}
            variant="outline"
            size="lg"
            className="w-full h-11 gap-2 rounded-xl text-gray-700 hover:bg-gray-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29A7.1 7.1 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a11.99 11.99 0 0 0 0 10.76l3.98-3.09Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0A11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
              />
            </svg>
            ورود با گوگل
            {loading === "google" && <span className="animate-spin size-4 border-2 border-gray-300 border-t-transparent rounded-full" />}
          </Button>

          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400">یا ورود با کد ایمیل</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {step === "email" ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="otp-email">ایمیل</Label>
                <Input
                  id="otp-email"
                  type="email"
                  dir="ltr"
                  required
                  placeholder="you@example.com"
                  className="h-11 rounded-xl text-left"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={loading !== null}
                className="w-full h-11 rounded-xl bg-[#d97757] hover:bg-[#c96445] text-white"
              >
                دریافت کد تأیید
                {loading === "send" && <span className="animate-spin size-4 border-2 border-white/40 border-t-white rounded-full" />}
              </Button>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="otp-code">کد تأیید</Label>
                <Input
                  id="otp-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  maxLength={6}
                  dir="ltr"
                  placeholder="••••••"
                  className="h-11 rounded-xl text-left text-lg tracking-[0.5em]"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                />
                <p className="text-xs text-gray-400">
                  کد ۶ رقمی به <span dir="ltr">{email}</span> ارسال شد.
                </p>
              </div>
              <Button
                type="submit"
                disabled={loading !== null || code.length !== 6}
                className="w-full h-11 rounded-xl bg-[#d97757] hover:bg-[#c96445] text-white"
              >
                ورود
                {loading === "verify" && <span className="animate-spin size-4 border-2 border-white/40 border-t-white rounded-full" />}
              </Button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-center text-xs text-gray-500 hover:text-[#d97757] transition-colors"
              >
                تغییر ایمیل
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs text-gray-400">
            با ورود به فروشگاه، قوانین و حریم خصوصی را می‌پذیرید.
          </p>
        </div>
      </div>
    </div>
  );
}
