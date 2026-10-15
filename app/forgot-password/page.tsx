"use client";

import React, { useState } from "react";
import { useSignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-hot-toast";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  KeyRound,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ForgotPassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [code, setCode] = useState("");
  const [codesent, setCodesent] = useState(false);
  const { signIn, fetchStatus, errors } = useSignIn();

  // Existing password-reset logic preserved.
  const sendResetCode = async (formData: FormData) => {
    const emailAddress = formData.get("email") as string;
    const { error: createError } = await signIn.create({
      identifier: emailAddress,
    });

    if (createError) {
      console.log(createError);
      toast.error("Email is not registered");
      return;
    }

    const { error: sendCodeError } =
      await signIn.resetPasswordEmailCode.sendCode();

    console.log(sendCodeError);
    if (sendCodeError) {
      console.error(JSON.stringify(sendCodeError, null, 2));
      toast.error("Code not sent");
      return;
    }
    setCodesent(true);
  };

  const verifyCode = async function (formData: FormData) {
    const code = formData.get("code") as string;
    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    console.log(error);

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      toast.error("Invalid code");
      return;
    }
    console.log(signIn.status);
  };

  const submitNewPassword = async function (formData: FormData) {
    const password = formData.get("newPassword") as string;
    const { error } = await signIn.resetPasswordEmailCode.submitPassword({
      password,
    });
    console.log(error);

    if (error) {
      console.error(JSON.stringify(error, null, 2));
      toast.error("Password is not reset");
      return;
    }

    toast.success("Password reset successfully");
    console.log(signIn.status);
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl, session }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }
          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url);
          }
        },
      });
    }
  };

  const inputClass =
    "h-14 rounded-xl border border-white/10 bg-[#303030] pl-12 text-white placeholder:text-white/30 focus-visible:ring-2 focus-visible:ring-[#e49385] focus-visible:ring-offset-0";
  const labelClass =
    "mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-white/60";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#171717] text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(#555 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-24 h-72 w-72 rounded-full bg-[#e49385]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#a2d7cb]/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 md:px-10 lg:px-14">
        <motion.nav
          initial={{ y: -18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#292929] px-5 py-4 shadow-lg sm:px-7"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e49385] text-[#171717]">
              <Sparkles size={21} strokeWidth={2.5} />
            </div>
            <span className="font-bold tracking-tight">
              TODO<span className="text-[#e49385]">.</span>STUDIO
            </span>
          </div>
          <div className="hidden items-center gap-2 text-xs font-medium text-white/50 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#a2d7cb]" />
            ACCOUNT RECOVERY
          </div>
          <span className="rounded-full border border-white/10 bg-[#202020] px-4 py-2 text-xs font-semibold text-white/70">
            ACCOUNT
          </span>
        </motion.nav>

        <div className="flex flex-1 items-center justify-center py-12 md:py-16">
          <div className="grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.section
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e49385]/25 bg-[#e49385]/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#e49385]">
                <ShieldCheck size={15} />
                Account recovery
              </div>
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                Personal productivity / 2026
              </p>
              <h1 className="font-semibold leading-[0.88] tracking-[-0.07em]">
                <span className="block text-[17vw] sm:text-[100px] lg:text-[118px]">
                  FORGOT
                </span>
                <span className="block text-[17vw] sm:text-[100px] lg:text-[118px]">
                  YOUR
                </span>
                <span className="mt-2 inline-block rounded-xl bg-[#e49385] px-3 py-1 text-[17vw] text-[#171717] sm:text-[100px] lg:text-[118px]">
                  KEY?
                </span>
              </h1>
              <div className="mt-8 flex max-w-md items-start gap-4">
                <div className="h-14 w-1.5 shrink-0 rounded-full bg-[#a2d7cb]" />
                <p className="leading-7 text-white/60">
                  No worries. We’ll send you a code, verify your identity, and
                  help you get back to your tasks.
                </p>
              </div>
              <div className="mt-8 hidden items-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/45 md:flex">
                <ArrowUpRight size={18} />
                Recover. Reset. Return.
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="relative"
            >
              <div className="rounded-[28px] border border-white/[0.07] bg-[#222222] p-6 shadow-2xl shadow-black/30 sm:p-9">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e49385] text-[#171717]">
                    {!codesent ? (
                      <Mail size={26} />
                    ) : signIn.status === "needs_new_password" ? (
                      <KeyRound size={26} />
                    ) : (
                      <ShieldCheck size={26} />
                    )}
                  </div>
                  <span className="text-5xl font-semibold text-white/[0.08]">
                    {!codesent
                      ? "01"
                      : signIn.status === "needs_new_password"
                        ? "03"
                        : "02"}
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {!codesent && (
                    <motion.div
                      key="email"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e49385]">
                        Step 01 / Identify
                      </p>
                      <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        RESET <span className="text-[#e49385]">ACCESS.</span>
                      </h2>
                      <p className="mb-7 mt-4 text-sm leading-6 text-white/55">
                        Enter your account email and we’ll send you a password
                        reset code.
                      </p>
                      <form action={sendResetCode} className="space-y-5">
                        <div>
                          <label htmlFor="email" className={labelClass}>
                            Email address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={19} />
                            <Input
                              id="email"
                              type="email"
                              value={emailAddress}
                              name="email"
                              required
                              onChange={(e) => setEmailAddress(e.target.value)}
                              placeholder="you@example.com"
                              className={inputClass}
                            />
                          </div>
                        </div>
                        {errors?.global?.[0]?.message && (
                          <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">
                            {errors.global[0].message}
                          </div>
                        )}
                        <Button
                          type="submit"
                          disabled={fetchStatus === "fetching"}
                          className="h-14 w-full rounded-xl bg-[#e49385] text-base font-semibold text-[#171717] transition hover:bg-[#f0a497]"
                        >
                          {fetchStatus === "fetching" ? "SENDING..." : "SEND RESET CODE"}
                          <ArrowRight size={20} className="ml-2" />
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {codesent && signIn.status !== "needs_new_password" && (
                    <motion.div
                      key="verify"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e49385]">
                        Step 02 / Verify
                      </p>
                      <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        CHECK <span className="text-[#e49385]">CODE.</span>
                      </h2>
                      <p className="mb-7 mt-4 text-sm leading-6 text-white/55">
                        Check your inbox and enter the verification code we sent.
                      </p>
                      <form action={verifyCode} className="space-y-5">
                        <div>
                          <label htmlFor="code" className={labelClass}>
                            Verification code
                          </label>
                          <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={19} />
                            <Input
                              id="code"
                              type="text"
                              value={code}
                              name="code"
                              required
                              onChange={(e) => setCode(e.target.value)}
                              placeholder="Enter code"
                              autoComplete="one-time-code"
                              className={`${inputClass} tracking-[0.2em]`}
                            />
                          </div>
                        </div>
                        {errors?.global?.[0]?.message && (
                          <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">
                            {errors.global[0].message}
                          </div>
                        )}
                        <Button
                          type="submit"
                          disabled={fetchStatus === "fetching"}
                          className="h-14 w-full rounded-xl bg-[#e49385] text-base font-semibold text-[#171717] transition hover:bg-[#f0a497]"
                        >
                          {fetchStatus === "fetching" ? "VERIFYING..." : "VERIFY CODE"}
                          <ArrowRight size={20} className="ml-2" />
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {codesent && signIn.status === "needs_new_password" && (
                    <motion.div
                      key="password"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#e49385]">
                        Step 03 / Finish
                      </p>
                      <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                        NEW <span className="text-[#e49385]">PASSWORD.</span>
                      </h2>
                      <p className="mb-7 mt-4 text-sm leading-6 text-white/55">
                        Almost there. Create a new password and get back to work.
                      </p>
                      <form action={submitNewPassword} className="space-y-5">
                        <div>
                          <label htmlFor="newPassword" className={labelClass}>
                            New password
                          </label>
                          <div className="relative">
                            <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={19} />
                            <Input
                              id="newPassword"
                              value={password}
                              type="password"
                              name="newPassword"
                              required
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="New password"
                              className={inputClass}
                            />
                          </div>
                        </div>
                        {errors?.global?.[0]?.message && (
                          <div className="rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">
                            {errors.global[0].message}
                          </div>
                        )}
                        <Button
                          type="submit"
                          disabled={fetchStatus === "fetching"}
                          className="h-14 w-full rounded-xl bg-[#e49385] text-base font-semibold text-[#171717] transition hover:bg-[#f0a497]"
                        >
                          {fetchStatus === "fetching" ? "UPDATING..." : "SET NEW PASSWORD"}
                          <Check size={20} className="ml-2" />
                        </Button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="mt-7 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  <span className="flex items-center gap-2">
                    <Check size={14} className="text-[#a2d7cb]" />
                    Secure recovery
                  </span>
                  <span>
                    {codesent
                      ? signIn.status === "needs_new_password"
                        ? "AUTH / 03"
                        : "AUTH / 02"
                      : "AUTH / 01"}
                  </span>
                </div>
              </div>
              <div className="mt-5 flex justify-between px-1 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                <span>TODO.STUDIO</span>
                <span className="flex items-center gap-1">
                  PASSWORD RECOVERY <ArrowUpRight size={13} />
                </span>
              </div>
            </motion.section>
          </div>
        </div>

        <footer className="flex flex-col justify-between gap-3 border-t border-white/10 py-6 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35 sm:flex-row">
          <span>© TODO.STUDIO 2026</span>
          <span>Recover / Reset / Return</span>
          <span>Built for doers.</span>
        </footer>
      </div>
    </main>
  );
};

export default ForgotPassword;
