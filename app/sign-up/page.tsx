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
    <main className="relative min-h-screen overflow-hidden bg-[#f1eee5] text-[#111]">
      {/* Background decorations */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(#111 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="pointer-events-none absolute -right-20 top-44 h-64 w-64 rotate-12 border-2 border-black bg-[#c8ff00] opacity-70" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full border-2 border-black bg-[#ff5a52] opacity-80" />

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between border-b-2 border-black px-5 py-4 sm:px-10 lg:px-16">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center border-2 border-black bg-[#c8ff00] shadow-[3px_3px_0_#111] transition-transform group-hover:-rotate-6">
            <Check size={24} strokeWidth={3} />
          </div>

          <span className="text-xl font-black uppercase tracking-[-0.07em] sm:text-2xl">
            TODO<span className="text-[#ff5a52]">.</span>STUDIO
          </span>
        </Link>

        <Link
          href="/sign-in"
          className="flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-xs font-black uppercase tracking-wider transition-all hover:bg-[#c8ff00] sm:text-sm"
        >
          Sign In <ArrowUpRight size={16} />
        </Link>
      </nav>

      {/* Main content */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-130px)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-10 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:px-16">
        {/* Left editorial section */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="mb-6 inline-flex -rotate-2 items-center gap-2 border-2 border-black bg-[#ff5a52] px-4 py-2 text-xs font-black uppercase tracking-[0.15em] shadow-[4px_4px_0_#111] sm:text-sm">
            <Sparkles size={16} />
            Your next chapter starts here
          </div>

          <h1 className="text-[18vw] font-black uppercase leading-[0.76] tracking-[-0.09em] sm:text-[110px] lg:text-[125px]">
            JOIN
            <br />
            THE
            <br />
            <span className="relative inline-block">
              DOERS
              <span className="absolute -bottom-1 left-0 -z-10 h-5 w-full -rotate-2 bg-[#c8ff00] sm:h-7" />
            </span>
            <span className="text-[#ff5a52]">.</span>
          </h1>

          <p className="mt-8 max-w-md text-base font-medium leading-relaxed sm:text-lg">
            Big ideas deserve a place to grow. Create your account, organize
            your tasks, and start turning plans into progress.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 border-2 border-black bg-white px-4 py-3 shadow-[4px_4px_0_#111]">
              <Check size={17} strokeWidth={3} />
              <span className="text-xs font-black uppercase sm:text-sm">
                Get organized
              </span>
            </div>

            <div className="flex items-center gap-2 border-2 border-black bg-[#c8ff00] px-4 py-3 shadow-[4px_4px_0_#111]">
              <Sparkles size={17} />
              <span className="text-xs font-black uppercase sm:text-sm">
                Make progress
              </span>
            </div>
          </div>

          <div className="mt-12 hidden items-center gap-4 lg:flex">
            <div className="h-[2px] w-16 bg-black" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              Less chaos. More doing.
            </span>
          </div>

          <div className="absolute -right-2 top-0 hidden rotate-12 border-2 border-black bg-[#c8ff00] p-4 shadow-[4px_4px_0_#111] xl:block">
            <UserPlus size={30} strokeWidth={2.5} />
          </div>
        </motion.div>

        {/* Signup / Verification card */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative mx-auto w-full max-w-lg"
        >
          {/* Tape decoration */}
          <div className="absolute -top-4 left-1/2 z-20 h-8 w-28 -translate-x-1/2 rotate-[-4deg] border-x border-black/10 bg-[#c8ff00]/90 shadow-sm" />

          <div className="border-2 border-black bg-white p-6 shadow-[8px_8px_0_#111] sm:p-9 sm:shadow-[12px_12px_0_#111]">
            <AnimatePresence mode="wait">
              {isVerifying ? (
                <motion.div
                  key="verify"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 border-2 border-black bg-[#c8ff00] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest sm:text-xs">
                        <ShieldCheck size={14} />
                        Step 02 / 02
                      </div>

                      <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.06em] sm:text-5xl">
                        CHECK
                        <br />
                        YOUR MAIL<span className="text-[#ff5a52]">.</span>
                      </h2>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-[#ff5a52] shadow-[3px_3px_0_#111] sm:h-14 sm:w-14">
                      <Mail size={25} />
                    </div>
                  </div>

                  <p className="mb-7 text-sm leading-relaxed text-black/70 sm:text-base">
                    We sent a verification code to your email. Enter it below
                    to finish creating your account.
                  </p>

                  <form action={handelVerify} className="space-y-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="code"
                        className="block text-xs font-black uppercase tracking-widest sm:text-sm"
                      >
                        Verification Code
                      </label>

                      <Input
                        id="code"
                        name="code"
                        type="text"
                        placeholder="ENTER YOUR CODE"
                        required
                        autoComplete="one-time-code"
                        className="h-16 rounded-none border-2 border-black bg-[#f1eee5] px-4 text-lg font-black tracking-[0.2em] placeholder:text-sm placeholder:tracking-normal focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={fetchStatus === "fetching"}
                      className="group h-16 w-full rounded-none border-2 border-black bg-black text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-[#c8ff00] hover:text-black disabled:opacity-50"
                    >
                      Verify Email
                      <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={async () => {
                        const result =
                          await signUp?.verifications.sendEmailCode();

                        if (result?.error) {
                          toast.error("try again later");
                        } else {
                          toast.success("Verification code sent");
                        }
                      }}
                      className="h-12 w-full rounded-none border-2 border-black bg-white text-xs font-black uppercase tracking-widest hover:bg-[#ff5a52] hover:text-black"
                    >
                      <Mail size={16} className="mr-2" />
                      Send New Code
                    </Button>
                  </form>

                  <div className="mt-6 border-t-2 border-dashed border-black/20 pt-5">
                    <p className="text-center text-xs font-medium text-black/60">
                      Wrong email?{" "}
                      <Link
                        href="/sign-up"
                        className="font-black text-black underline decoration-2 underline-offset-4 hover:bg-[#c8ff00]"
                      >
                        Go back
                      </Link>
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="signup"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 border-2 border-black bg-[#c8ff00] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest sm:text-xs">
                        <UserPlus size={14} />
                        Step 01 / 02
                      </div>

                      <h2 className="text-4xl font-black uppercase leading-none tracking-[-0.06em] sm:text-5xl">
                        MAKE
                        <br />
                        IT OFFICIAL<span className="text-[#ff5a52]">.</span>
                      </h2>
                    </div>

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-[#c8ff00] shadow-[3px_3px_0_#111] sm:h-14 sm:w-14">
                      <KeyRound size={25} />
                    </div>
                  </div>

                  <p className="mb-7 text-sm leading-relaxed text-black/70 sm:text-base">
                    Create your account. Your goals aren't going to tackle
                    themselves.
                  </p>

                  {errors?.global?.[0]?.message && (
                    <div
                      role="alert"
                      className="mb-5 border-2 border-black bg-[#ff5a52] p-4 text-sm font-bold"
                    >
                      {errors?.global?.[0]?.message}
                    </div>
                  )}

                  <form action={handelSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="block text-xs font-black uppercase tracking-widest sm:text-sm"
                      >
                        Email Address
                      </label>

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                        className="h-14 rounded-none border-2 border-black bg-[#f1eee5] px-4 font-medium placeholder:text-black/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="password"
                        className="block text-xs font-black uppercase tracking-widest sm:text-sm"
                      >
                        Password
                      </label>

                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="CREATE A STRONG PASSWORD"
                        required
                        autoComplete="new-password"
                        className="h-14 rounded-none border-2 border-black bg-[#f1eee5] px-4 font-medium placeholder:text-xs placeholder:text-black/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={fetchStatus === "fetching"}
                      className="group h-16 w-full rounded-none border-2 border-black bg-black text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-[#c8ff00] hover:text-black disabled:opacity-50"
                    >
                      {fetchStatus === "fetching"
                        ? "Creating Account..."
                        : "Create Account"}
                      <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </form>

                  <div className="my-6 flex items-center gap-3">
                    <div className="h-[2px] flex-1 bg-black/15" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
                      Already one of us?
                    </span>
                    <div className="h-[2px] flex-1 bg-black/15" />
                  </div>

                  <Link
                    href="/sign-in"
                    className="flex h-14 w-full items-center justify-center gap-2 border-2 border-black bg-white text-xs font-black uppercase tracking-widest transition-all hover:bg-[#ff5a52] sm:text-sm"
                  >
                    <ArrowLeft size={16} />
                    Sign In To Your Account
                  </Link>

                  <div className="mt-5 flex items-start gap-3 border-2 border-black/15 bg-[#f1eee5] p-3">
                    <ShieldCheck
                      size={18}
                      className="mt-0.5 shrink-0"
                    />
                    <p className="text-[11px] leading-relaxed text-black/65">
                      Your account is protected by email verification. Keep
                      your password private and secure.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Clerk CAPTCHA mount point */}
            <div id="clerk-captcha" />
          </div>

          <div className="mt-5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest sm:text-xs">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full border border-black bg-[#c8ff00]" />
              YOUR SPACE. YOUR RULES.
            </span>
            <span>EST. 2026</span>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-t-2 border-black px-5 py-5 text-[10px] font-black uppercase tracking-[0.15em] sm:px-10 sm:text-xs lg:px-16">
        <span>© TODO.STUDIO 2026</span>
        <span>BUILT FOR DOERS. NOT DREAMERS.</span>
      </footer>
    </main>
  );
};

export default Page;