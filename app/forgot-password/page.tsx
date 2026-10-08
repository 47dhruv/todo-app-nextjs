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

  // =========================================================
  // YOUR ORIGINAL LOGIC — UNCHANGED
  // =========================================================

  const sendResetCode = async (formData: FormData) => {
    const emailAddress = formData.get("email") as string;

    const { error: createError } = await signIn.create({
      identifier: emailAddress,
    });

    if (createError) {
      console.log(createError);
      toast.error("Email is not registered")
      return;
    }

    const { error: sendCodeError } =
      await signIn.resetPasswordEmailCode.sendCode();

    console.log(sendCodeError);

    if (sendCodeError) {
      console.error(
        JSON.stringify(sendCodeError, null, 2)
      );
      toast.error("Code not sent")
      return;
    }

    setCodesent(true);
  };

  const verifyCode = async function (formData: FormData) {
    const code = formData.get("code") as string;

    const { error } =
      await signIn.resetPasswordEmailCode.verifyCode({
        code: code,
      });

    console.log(error);

    if (error) {
      console.error(
        JSON.stringify(error, null, 2)
      );
      toast.error("Invalid code")
      return;
    }

    console.log(signIn.status);
  };

  const submitNewPassword = async function (
    formData: FormData
  ) {
    const password = formData.get(
      "newPassword"
    ) as string;

    const { error } =
      await signIn.resetPasswordEmailCode.submitPassword({
        password: password,
      });

    console.log(error);
    

    if (error) {
      console.error(
        JSON.stringify(error, null, 2)
      );
      toast.error("Password is not reset")
      return;
    }

    toast.success("Password reset successfully")
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

  // =========================================================
  // UI
  // =========================================================

  return (
    <main className="min-h-screen overflow-hidden bg-[#f1eee5] text-[#111]">

      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0">

        {/* Lime shape */}
        <motion.div
          animate={{
            rotate: [8, -5, 8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-20 top-24 h-64 w-64 bg-[#c8ff00]"
        />

        {/* Coral shape */}
        <motion.div
          animate={{
            rotate: [-8, 5, -8],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#ff5a52]"
        />

        {/* Dot patterns */}
        <div className="absolute right-10 top-20 h-40 w-40 opacity-30 [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:10px_10px]" />

        <div className="absolute bottom-20 left-10 h-32 w-32 opacity-20 [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:8px_8px]" />

      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 md:px-10 lg:px-14">

        {/* =====================================================
            NAVBAR
        ===================================================== */}

        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center justify-between border-b-2 border-black pb-5"
        >

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[#c8ff00] shadow-[4px_4px_0_#111]">
              <Sparkles
                size={21}
                strokeWidth={3}
              />
            </div>

            <span className="font-black tracking-[-0.05em]">
              TODO.STUDIO
            </span>

          </div>

          <div className="hidden gap-8 text-xs font-black uppercase tracking-widest md:flex">
            <span>WORK</span>
            <span>ABOUT</span>
            <span>FOCUS</span>
          </div>

          <div className="border-2 border-black bg-black px-4 py-2 text-xs font-black text-white shadow-[4px_4px_0_#c8ff00]">
            ACCOUNT
          </div>

        </motion.nav>

        {/* =====================================================
            MAIN
        ===================================================== */}

        <div className="flex flex-1 items-center justify-center py-14">

          <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">

            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <motion.section
              initial={{
                opacity: 0,
                x: -60,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                duration: 0.5,
              }}
            >

              <div className="mb-6 inline-block rotate-[-2deg] border-2 border-black bg-[#c8ff00] px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#111]">
                Account recovery →
              </div>

              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em]">
                Personal productivity / 2026
              </p>

              <h1 className="font-black uppercase leading-[0.78] tracking-[-0.07em]">

                <span className="block text-[17vw] sm:text-[110px] lg:text-[125px]">
                  FORGOT
                </span>

                <span className="block text-[17vw] sm:text-[110px] lg:text-[125px]">
                  YOUR
                </span>

                <span className="inline-block bg-[#ff5a52] px-3 text-[17vw] sm:text-[110px] lg:text-[125px]">
                  KEY?
                </span>

              </h1>

              <div className="mt-10 flex max-w-md items-start gap-4">

                <div className="h-14 w-2 bg-black" />

                <p className="font-bold leading-6">
                  No worries. We'll send you a code,
                  verify your identity, and get you
                  back to your tasks.
                </p>

              </div>

              <div className="mt-8 hidden items-center gap-3 text-xs font-black uppercase md:flex">
                <ArrowUpRight
                  size={20}
                  strokeWidth={3}
                />

                Recover. Reset. Return.
              </div>

            </motion.section>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <motion.section
              initial={{
                opacity: 0,
                y: 40,
                rotate: 2,
              }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
                delay: 0.15,
              }}
              className="relative"
            >

              {/* Tape */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: -20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.5,
                }}
                className="absolute left-1/2 top-[-18px] z-20 h-10 w-32 -translate-x-1/2 rotate-[-3deg] border border-black/20 bg-[#d9d3b8]/90"
              />

              <div className="border-2 border-black bg-white p-6 shadow-[10px_10px_0_#111] md:p-10">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="mb-8 flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center border-2 border-black bg-[#f1eee5] shadow-[4px_4px_0_#111]">

                    {!codesent ? (
                      <Mail
                        size={27}
                        strokeWidth={3}
                      />
                    ) : signIn.status ===
                      "needs_new_password" ? (
                      <KeyRound
                        size={27}
                        strokeWidth={3}
                      />
                    ) : (
                      <ShieldCheck
                        size={27}
                        strokeWidth={3}
                      />
                    )}

                  </div>

                  <span className="text-6xl font-black leading-none opacity-10">
                    {!codesent
                      ? "01"
                      : signIn.status ===
                        "needs_new_password"
                      ? "03"
                      : "02"}
                  </span>

                </div>

                {/* =================================================
                    STEP 1 — EMAIL
                ================================================= */}

                <AnimatePresence mode="wait">

                  {!codesent && (
                    <motion.div
                      key="email"
                      initial={{
                        opacity: 0,
                        x: 30,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                      }}
                      exit={{
                        opacity: 0,
                        x: -30,
                      }}
                    >

                      <p className="mb-2 text-xs font-black uppercase tracking-[0.3em]">
                        Step 01 / Identify
                      </p>

                      <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-[-0.05em]">
                        RESET
                        <span className="block text-[#ff5a52]">
                          ACCESS.
                        </span>
                      </h2>

                      <div className="my-7 h-1 w-20 bg-black" />

                      <p className="mb-8 font-bold leading-6">
                        Enter your account email and
                        we'll send you a password reset
                        code.
                      </p>

                      <form
                        action={sendResetCode}
                        className="space-y-5"
                      >

                        <div>

                          <label
                            htmlFor="email"
                            className="mb-2 block text-xs font-black uppercase tracking-widest"
                          >
                            Email address
                          </label>

                          <div className="relative">

                            <Mail
                              size={20}
                              strokeWidth={3}
                              className="absolute left-4 top-1/2 -translate-y-1/2"
                            />

                            <Input
                              id="email"
                              type="email"
                              value={emailAddress}
                              name="email"
                              required
                              onChange={(e) =>
                                setEmailAddress(
                                  e.target.value
                                )
                              }
                              placeholder="YOU@EXAMPLE.COM"
                              className="h-16 rounded-none border-2 border-black bg-[#f1eee5] pl-12 font-black placeholder:text-black/25 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />

                          </div>

                        </div>

                        {/* Error */}

                        {errors?.global?.[0]?.message && (
                          <div className="border-2 border-black bg-[#ff5a52] p-4 text-sm font-black">
                            {errors?.global?.[0]?.message}
                          </div>
                        )}

                        <Button
                          type="submit"
                          disabled={
                            fetchStatus === "fetching"
                          }
                          className="h-16 w-full rounded-none border-2 border-black bg-black text-lg font-black text-white shadow-[5px_5px_0_#c8ff00] hover:bg-[#c8ff00] hover:text-black"
                        >
                          {fetchStatus === "fetching"
                            ? "SENDING..."
                            : "SEND RESET CODE"}

                          <ArrowRight
                            size={23}
                            strokeWidth={3}
                          />
                        </Button>

                      </form>

                    </motion.div>
                  )}

                  {/* =================================================
                      STEP 2 — VERIFY CODE
                  ================================================= */}

                  {codesent &&
                    signIn.status !==
                      "needs_new_password" && (

                      <motion.div
                        key="verify"
                        initial={{
                          opacity: 0,
                          x: 30,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        exit={{
                          opacity: 0,
                          x: -30,
                        }}
                      >

                        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em]">
                          Step 02 / Verify
                        </p>

                        <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-[-0.05em]">
                          CHECK
                          <span className="block text-[#ff5a52]">
                            CODE.
                          </span>
                        </h2>

                        <div className="my-7 h-1 w-20 bg-black" />

                        <p className="mb-8 font-bold leading-6">
                          Check your inbox. Enter the
                          verification code we sent you.
                        </p>

                        <form
                          action={verifyCode}
                          className="space-y-5"
                        >

                          <div>

                            <label
                              htmlFor="code"
                              className="mb-2 block text-xs font-black uppercase tracking-widest"
                            >
                              Verification code
                            </label>

                            <div className="relative">

                              <ShieldCheck
                                size={20}
                                strokeWidth={3}
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                              />

                              <Input
                                id="code"
                                type="text"
                                value={code}
                                name="code"
                                required
                                onChange={(e) =>
                                  setCode(
                                    e.target.value
                                  )
                                }
                                placeholder="ENTER CODE"
                                autoComplete="one-time-code"
                                className="h-16 rounded-none border-2 border-black bg-[#f1eee5] pl-12 font-black tracking-[0.25em] placeholder:text-black/25 focus-visible:ring-0 focus-visible:ring-offset-0"
                              />

                            </div>

                          </div>

                          {errors?.global?.[0]?.message && (
                            <div className="border-2 border-black bg-[#ff5a52] p-4 text-sm font-black">
                              {errors?.global?.[0]?.message}
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={
                              fetchStatus === "fetching"
                            }
                            className="h-16 w-full rounded-none border-2 border-black bg-black text-lg font-black text-white shadow-[5px_5px_0_#c8ff00] hover:bg-[#c8ff00] hover:text-black"
                          >
                            {fetchStatus === "fetching"
                              ? "VERIFYING..."
                              : "VERIFY CODE"}

                            <ArrowRight
                              size={23}
                              strokeWidth={3}
                            />
                          </Button>

                        </form>

                      </motion.div>
                    )}

                  {/* =================================================
                      STEP 3 — NEW PASSWORD
                  ================================================= */}

                  {codesent &&
                    signIn.status ===
                      "needs_new_password" && (

                      <motion.div
                        key="password"
                        initial={{
                          opacity: 0,
                          x: 30,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                      >

                        <p className="mb-2 text-xs font-black uppercase tracking-[0.3em]">
                          Step 03 / Finish
                        </p>

                        <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-[-0.05em]">
                          NEW
                          <span className="block text-[#ff5a52]">
                            PASSWORD.
                          </span>
                        </h2>

                        <div className="my-7 h-1 w-20 bg-black" />

                        <p className="mb-8 font-bold leading-6">
                          Almost there. Create a new
                          password and get back to work.
                        </p>

                        <form
                          action={submitNewPassword}
                          className="space-y-5"
                        >

                          <div>

                            <label
                              htmlFor="newPassword"
                              className="mb-2 block text-xs font-black uppercase tracking-widest"
                            >
                              New password
                            </label>

                            <div className="relative">

                              <LockKeyhole
                                size={20}
                                strokeWidth={3}
                                className="absolute left-4 top-1/2 -translate-y-1/2"
                              />

                              <Input
                                id="newPassword"
                                value={password}
                                type="password"
                                name="newPassword"
                                required
                                onChange={(e) =>
                                  setPassword(
                                    e.target.value
                                  )
                                }
                                placeholder="NEW PASSWORD"
                                className="h-16 rounded-none border-2 border-black bg-[#f1eee5] pl-12 font-black placeholder:text-black/25 focus-visible:ring-0 focus-visible:ring-offset-0"
                              />

                            </div>

                          </div>

                          {errors?.global?.[0]?.message && (
                            <div className="border-2 border-black bg-[#ff5a52] p-4 text-sm font-black">
                              {errors?.global?.[0]?.message}
                            </div>
                          )}

                          <Button
                            type="submit"
                            disabled={
                              fetchStatus === "fetching"
                            }
                            className="h-16 w-full rounded-none border-2 border-black bg-black text-lg font-black text-white shadow-[5px_5px_0_#c8ff00] hover:bg-[#c8ff00] hover:text-black"
                          >
                            {fetchStatus === "fetching"
                              ? "UPDATING..."
                              : "SET NEW PASSWORD"}

                            <Check
                              size={23}
                              strokeWidth={4}
                            />
                          </Button>

                        </form>

                      </motion.div>
                    )}

                </AnimatePresence>

                {/* =================================================
                    CARD FOOTER
                ================================================= */}

                <div className="mt-7 flex items-center justify-between border-t-2 border-black pt-5 text-[10px] font-black uppercase tracking-widest">

                  <span className="flex items-center gap-2">
                    <Check
                      size={14}
                      strokeWidth={4}
                    />
                    Secure recovery
                  </span>

                  <span>
                    {codesent
                      ? signIn.status ===
                        "needs_new_password"
                        ? "AUTH / 03"
                        : "AUTH / 02"
                      : "AUTH / 01"}
                  </span>

                </div>

              </div>

              {/* Bottom label */}

              <div className="mt-6 flex justify-between text-xs font-black uppercase">

                <span>TODO.STUDIO</span>

                <span className="flex items-center gap-1">
                  PASSWORD RECOVERY
                  <ArrowUpRight size={14} />
                </span>

              </div>

            </motion.section>

          </div>

        </div>

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <footer className="flex flex-col justify-between gap-4 border-t-2 border-black py-6 text-xs font-black uppercase md:flex-row">

          <span>© TODO.STUDIO 2026</span>

          <span>
            RECOVER / RESET / RETURN
          </span>

          <span>BUILT FOR DOERS.</span>

        </footer>

      </div>
    </main>
  );
};

export default ForgotPassword;