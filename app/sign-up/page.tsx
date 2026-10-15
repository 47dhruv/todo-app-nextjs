"use client";

import { useSignUp } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  KeyRound,
  Mail,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Page = () => {
  const router = useRouter();
  const { signUp, errors, fetchStatus } = useSignUp();

  // Existing signup and verification logic is intentionally unchanged.
  const handelSubmit = async function (formdata: FormData) {
    const email = formdata.get("email") as string;
    const password = formdata.get("password") as string;

    const { error } = await signUp?.password({
      emailAddress: email,
      password: password,
    });

    if (error) {
      console.log(JSON.stringify(error, null, 2));
      toast.error("signup failed");
      return;
    }

    if (!error) {
      const result = await signUp?.verifications.sendEmailCode();

      console.log(signUp.status);
      console.log(result);

      if (result.error) {
        console.log(result.error.message);
        toast.error("try again later");
      } else {
        toast.success("code send succesfully");
      }
    }
  };

  const handelVerify = async function (formdata: FormData) {
    const code = formdata.get("code") as string;

    const { error } = await signUp?.verifications.verifyEmailCode({ code });

    console.log(error);

    if (error) {
      toast.error("the code is incorrect");
      return;
    }

    console.log(signUp?.status);

    if (signUp?.status === "complete") {
      await signUp.finalize({
        navigate: ({ decorateUrl, session }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            return;
          }

          const url = decorateUrl("/");

          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            toast.success("Signed in successfully");
            router.push(url);
          }
        },
      });
    }
  };

  const isVerifying =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#171717] text-[#f5f5f5]">
      {/* Same charcoal canvas and subtle dotted texture as the dashboard */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(#555 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div aria-hidden="true" className="pointer-events-none fixed -right-24 top-32 h-72 w-72 rounded-full bg-[#e49385]/10 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none fixed -bottom-28 -left-24 h-80 w-80 rounded-full bg-[#a0d8ce]/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] flex-col px-4 py-4 sm:px-7 lg:px-10">
        {/* Dashboard-style rounded navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative z-10 flex items-center justify-between gap-4 rounded-[24px] border border-white/5 bg-[#292929] px-4 py-3 sm:px-6"
        >
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e49385] text-[#202020] transition-transform group-hover:rotate-[-5deg]">
              <Check size={23} strokeWidth={2.8} />
            </div>
            <div>
              <span className="block text-lg font-bold tracking-tight sm:text-xl">
                TODO<span className="text-[#e49385]">.</span>STUDIO
              </span>
              <span className="hidden text-[10px] font-medium tracking-[0.18em] text-white/45 sm:block">
                PLAN YOUR DAY
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-white/50 md:inline">Already have an account?</span>
            <Link
              href="/sign-in"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#3b3b3b] px-3 text-sm font-medium transition-colors hover:bg-[#e49385] hover:text-[#202020] sm:px-4"
            >
              Sign in <ArrowUpRight size={16} />
            </Link>
          </div>
        </motion.nav>

        <section className="relative z-10 mx-auto grid w-full max-w-6xl flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_0.88fr] lg:gap-16 lg:py-14">
          {/* Intro panel */}
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="relative px-1 sm:px-3"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e49385]/30 bg-[#e49385]/10 px-4 py-2 text-xs font-semibold tracking-wide text-[#f0b1a5] sm:text-sm">
              <Sparkles size={15} />
              A calmer way to get things done
            </div>

            <h1 className="max-w-2xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-7xl lg:text-[88px]">
              Make room
              <br />
              for <span className="text-[#e49385]">what</span>
              <br />
              matters<span className="text-[#a0d8ce]">.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
              Bring your plans, routines, and everyday tasks into one focused space. Create your account and make progress one task at a time.
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#242424] p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#a0d8ce]/15 text-[#a0d8ce]"><Check size={19} /></span>
                <div>
                  <p className="text-sm font-semibold">Stay organized</p>
                  <p className="mt-1 text-xs text-white/40">One clear list</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#242424] p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e49385]/15 text-[#e49385]"><Sparkles size={19} /></span>
                <div>
                  <p className="text-sm font-semibold">Build momentum</p>
                  <p className="mt-1 text-xs text-white/40">Small daily wins</p>
                </div>
              </div>
            </div>

            <div className="mt-9 flex items-center gap-3 text-xs font-medium tracking-wide text-white/35">
              <span className="h-px w-10 bg-[#e49385]/70" />
              LESS CHAOS. MORE DOING.
            </div>
          </motion.div>

          {/* Signup / email verification card */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="mx-auto w-full max-w-[500px]"
          >
            <div className="overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#242424] shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5 sm:px-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a0d8ce]">
                    {isVerifying ? "Step 02 / 02" : "Step 01 / 02"}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                    {isVerifying ? "Check your email" : "Create account"}
                    <span className="text-[#e49385]">.</span>
                  </h2>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isVerifying ? "bg-[#e49385]/15 text-[#e49385]" : "bg-[#a0d8ce]/15 text-[#a0d8ce]"}`}>
                  {isVerifying ? <Mail size={23} /> : <KeyRound size={23} />}
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <AnimatePresence mode="wait">
                  {isVerifying ? (
                    <motion.div
                      key="verify"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="mb-6 text-sm leading-6 text-white/50">
                        We sent a verification code to your email. Enter it below to finish creating your account.
                      </p>

                      <form action={handelVerify} className="space-y-5">
                        <div className="space-y-2">
                          <label htmlFor="code" className="block text-sm font-medium text-white/75">Verification code</label>
                          <Input
                            id="code"
                            name="code"
                            type="text"
                            placeholder="Enter your code"
                            required
                            autoComplete="one-time-code"
                            className="h-12 rounded-xl border border-white/10 bg-[#303030] px-4 text-base tracking-[0.18em] text-white placeholder:tracking-normal placeholder:text-white/25 focus-visible:border-[#a0d8ce] focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={fetchStatus === "fetching"}
                          className="h-12 w-full rounded-xl bg-[#e49385] text-sm font-semibold text-[#202020] transition-colors hover:bg-[#efaa9d] disabled:opacity-50"
                        >
                          Verify email <ArrowRight className="ml-2" size={17} />
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={async () => {
                            const result = await signUp?.verifications.sendEmailCode();
                            if (result?.error) {
                              toast.error("try again later");
                            } else {
                              toast.success("Verification code sent");
                            }
                          }}
                          className="h-11 w-full rounded-xl border border-white/10 bg-transparent text-sm font-medium text-white/75 hover:border-white/20 hover:bg-white/5 hover:text-white"
                        >
                          <Mail size={16} className="mr-2" /> Send new code
                        </Button>
                      </form>

                      <div className="mt-6 border-t border-white/[0.07] pt-5 text-center text-sm text-white/45">
                        Wrong email? <Link href="/sign-up" className="font-medium text-[#a0d8ce] hover:text-white">Go back</Link>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="signup"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="mb-6 text-sm leading-6 text-white/50">
                        Set up your account and keep your next steps in one place.
                      </p>

                      {errors?.global?.[0]?.message && (
                        <div role="alert" className="mb-5 rounded-xl border border-[#e49385]/30 bg-[#e49385]/10 p-3 text-sm text-[#f0b1a5]">
                          {errors?.global?.[0]?.message}
                        </div>
                      )}

                      <form action={handelSubmit} className="space-y-5">
                        <div className="space-y-2">
                          <label htmlFor="email" className="block text-sm font-medium text-white/75">Email address</label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            autoComplete="email"
                            className="h-12 rounded-xl border border-white/10 bg-[#303030] px-4 text-sm text-white placeholder:text-white/25 focus-visible:border-[#a0d8ce] focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="password" className="block text-sm font-medium text-white/75">Password</label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a strong password"
                            required
                            autoComplete="new-password"
                            className="h-12 rounded-xl border border-white/10 bg-[#303030] px-4 text-sm text-white placeholder:text-white/25 focus-visible:border-[#a0d8ce] focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={fetchStatus === "fetching"}
                          className="h-12 w-full rounded-xl bg-[#e49385] text-sm font-semibold text-[#202020] transition-colors hover:bg-[#efaa9d] disabled:opacity-50"
                        >
                          {fetchStatus === "fetching" ? "Creating account..." : "Create account"}
                          <ArrowRight className="ml-2" size={17} />
                        </Button>
                      </form>

                      <div className="my-6 flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-xs text-white/35">Already have an account?</span>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>

                      <Link
                        href="/sign-in"
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#303030] text-sm font-medium text-white/75 transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
                      >
                        <ArrowLeft size={16} /> Sign in to your account
                      </Link>

                      <div className="mt-5 flex items-start gap-3 rounded-xl border border-white/[0.07] bg-[#202020] p-3.5">
                        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[#a0d8ce]" />
                        <p className="text-xs leading-5 text-white/45">
                          Your account is protected by email verification. Keep your password private and secure.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Clerk CAPTCHA mount point */}
                <div id="clerk-captcha" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between px-1 text-[10px] font-medium uppercase tracking-[0.16em] text-white/30 sm:text-xs">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#a0d8ce]" /> Your space. Your rules.</span>
              <span>Est. 2026</span>
            </div>
          </motion.div>
        </section>

        <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] py-5 text-[10px] font-medium uppercase tracking-[0.14em] text-white/30 sm:text-xs">
          <span>© TODO.STUDIO 2026</span>
          <span>Built for better days.</span>
        </footer>
      </div>
    </main>
  );
};

export default Page;
