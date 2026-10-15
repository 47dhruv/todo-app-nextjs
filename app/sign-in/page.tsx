"use client";

import { useSignIn } from "@clerk/nextjs";  
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Check,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
export default function SignInPage() {
  const router = useRouter();

  const { signIn, errors, fetchStatus } = useSignIn();


  // =========================================================
  // YOUR ORIGINAL LOGIC — NOT CHANGED
  // =========================================================

  const handleSubmit = async (formData: FormData) => {
    const emailAddress = formData.get("email") as string;
    const password = formData.get("password") as string;

    const { error } = await signIn.password({
      emailAddress,
      password,
    });

    if (signIn.status === "needs_client_trust") {
      const response = await signIn.mfa.sendEmailCode();
      console.log(response);
    }

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ decorateUrl, session }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            toast.success("Signed in successfully")
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

    console.log(error);
    if (error) {
      toast.error("Invalid credentials")
    }
    console.log(signIn.status);
  };

  const handleVerify = async (formData: FormData) => {
    const code = formData.get("code") as string;

    const result = await signIn.mfa.verifyEmailCode({ code });

    console.log(result);
    console.log(signIn.status);

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session.currentTask);
            toast.success("Signed in successfully")
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
  // MFA / EMAIL VERIFICATION UI
  // =========================================================

  if (signIn.status === "needs_client_trust") {
    return (
      <main className="min-h-screen overflow-hidden bg-[#f1eee5] text-[#111]">
        {/* Background */}
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute -right-20 top-20 h-64 w-64 rotate-6 bg-[#c8ff00]" />

          <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-[#ff5a52]" />

          <div className="absolute right-10 top-24 h-40 w-40 opacity-30 [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:10px_10px]" />

          <div className="absolute left-10 top-1/2 h-32 w-32 opacity-20 [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:8px_8px]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 md:px-10 lg:px-14">

          {/* NAVBAR */}
          <motion.nav
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between border-b-2 border-black pb-5"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-black bg-[#c8ff00] shadow-[4px_4px_0_#111]">
                <Sparkles size={21} strokeWidth={3} />
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
              SECURE
            </div>
          </motion.nav>

          {/* VERIFICATION */}
          <div className="flex flex-1 items-center justify-center py-16">

            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 220,
                damping: 18,
              }}
              className="relative w-full max-w-xl"
            >

              {/* Sticker */}
              <motion.div
                initial={{ scale: 0, rotate: 15 }}
                animate={{ scale: 1, rotate: 8 }}
                transition={{ delay: 0.3 }}
                className="absolute -right-4 -top-8 z-20 border-2 border-black bg-[#ff5a52] px-4 py-3 text-xs font-black uppercase shadow-[5px_5px_0_#111] md:-right-8"
              >
                CHECK
                <br />
                YOUR MAIL
              </motion.div>

              {/* Card */}
              <div className="border-2 border-black bg-white p-6 shadow-[10px_10px_0_#111] md:p-10">

                {/* Icon */}
                <div className="mb-8 flex items-center justify-between">

                  <div className="flex h-16 w-16 items-center justify-center border-2 border-black bg-[#c8ff00] shadow-[5px_5px_0_#111]">
                    <ShieldCheck
                      size={32}
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-[70px] font-black leading-none opacity-10">
                    02
                  </span>

                </div>

                <p className="mb-3 text-xs font-black uppercase tracking-[0.3em]">
                  Security check / 02
                </p>

                <h1 className="text-6xl font-black uppercase leading-[0.8] tracking-[-0.06em] md:text-7xl">
                  VERIFY
                  <span className="block text-[#ff5a52]">
                    ACCESS.
                  </span>
                </h1>

                <div className="my-8 h-1 w-24 bg-black" />

                <p className="mb-8 max-w-md font-bold leading-6">
                  We sent a verification code to your email.
                  Enter the code below to continue.
                </p>

                <form
                  action={handleVerify}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="code"
                      className="mb-2 block text-xs font-black uppercase tracking-widest"
                    >
                      Verification code
                    </label>

                    <Input
                      id="code"
                      name="code"
                      type="text"
                      placeholder="ENTER CODE"
                      autoComplete="one-time-code"
                      className="h-16 rounded-none border-2 border-black bg-[#f1eee5] text-xl font-black tracking-[0.25em] placeholder:text-black/25 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-16 w-full rounded-none border-2 border-black bg-black text-lg font-black text-white shadow-[5px_5px_0_#c8ff00] transition-all hover:bg-[#c8ff00] hover:text-black"
                  >
                    VERIFY CODE
                    <ArrowRight
                      size={22}
                      strokeWidth={3}
                    />
                  </Button>

                  <Button
                    type="button"
                    onClick={() =>
                      signIn.mfa.sendEmailCode()
                    }
                    className="h-14 w-full rounded-none border-2 border-black bg-white font-black text-black shadow-[4px_4px_0_#111] hover:bg-[#ff5a52]"
                  >
                    SEND NEW CODE
                  </Button>
                </form>

              </div>

              <div className="mt-6 flex justify-between text-xs font-black uppercase">
                <span>TODO.STUDIO</span>
                <span>AUTH / MFA</span>
              </div>

            </motion.div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // SIGN IN UI
  // =========================================================

  return (
    <main className="min-h-screen overflow-hidden bg-[#f1eee5] text-[#111]">

      {/* ================= BACKGROUND ================= */}

      <div className="pointer-events-none fixed inset-0">

        {/* lime shape */}
        <motion.div
          animate={{
            rotate: [8, -4, 8],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-16 top-24 h-64 w-64 bg-[#c8ff00]"
        />

        {/* red shape */}
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

        {/* dot pattern */}
        <div className="absolute right-10 top-20 h-40 w-40 opacity-30 [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:10px_10px]" />

        <div className="absolute bottom-20 left-10 h-32 w-32 opacity-20 [background-image:radial-gradient(#111_1px,transparent_1px)] [background-size:8px_8px]" />

      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-5 py-6 md:px-10 lg:px-14">

        {/* ================= NAVBAR ================= */}

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
            SIGN IN
          </div>

        </motion.nav>

        {/* ================= MAIN ================= */}

        <div className="flex flex-1 items-center justify-center py-16">

          <div className="grid w-full max-w-6xl items-center gap-16 lg:grid-cols-2">

            {/* ================= LEFT ================= */}

            <motion.section
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >

              <div className="mb-6 inline-block rotate-[-2deg] border-2 border-black bg-[#c8ff00] px-4 py-2 text-xs font-black uppercase shadow-[4px_4px_0_#111]">
                Welcome back →
              </div>

              <p className="mb-5 text-xs font-black uppercase tracking-[0.3em]">
                Personal productivity / 2026
              </p>

              <h1 className="font-black uppercase leading-[0.78] tracking-[-0.07em]">

                <span className="block text-[18vw] sm:text-[110px] lg:text-[130px]">
                  GET
                </span>

                <span className="block text-[18vw] sm:text-[110px] lg:text-[130px]">
                  BACK
                </span>

                <span className="inline-block bg-[#ff5a52] px-3 text-[18vw] sm:text-[110px] lg:text-[130px]">
                  TO IT.
                </span>

              </h1>

              <div className="mt-10 flex max-w-md items-start gap-4">

                <div className="h-14 w-2 bg-black" />

                <p className="font-bold leading-6">
                  Your tasks are waiting.
                  Sign in and continue where
                  you left off.
                </p>

              </div>

              <div className="mt-8 hidden items-center gap-3 text-xs font-black uppercase md:flex">
                <ArrowUpRight size={20} strokeWidth={3} />
                Focus. Execute. Repeat.
              </div>

            </motion.section>

            {/* ================= LOGIN CARD ================= */}

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
                transition={{ delay: 0.5 }}
                className="absolute left-1/2 top-[-18px] z-20 h-10 w-32 -translate-x-1/2 rotate-[-3deg] border border-black/20 bg-[#d9d3b8]/90"
              />

              <div className="border-2 border-black bg-white p-6 shadow-[10px_10px_0_#111] md:p-10">

                {/* CARD HEADER */}

                <div className="mb-8 flex items-center justify-between">

                  <div className="flex h-14 w-14 items-center justify-center border-2 border-black bg-[#f1eee5] shadow-[4px_4px_0_#111]">
                    <LockKeyhole
                      size={27}
                      strokeWidth={3}
                    />
                  </div>

                  <span className="text-6xl font-black leading-none opacity-10">
                    01
                  </span>

                </div>

                <p className="mb-2 text-xs font-black uppercase tracking-[0.3em]">
                  Member access
                </p>

                <h2 className="text-5xl font-black uppercase leading-[0.85] tracking-[-0.05em]">
                  SIGN
                  <span className="block text-[#ff5a52]">
                    IN.
                  </span>
                </h2>

                <div className="my-7 h-1 w-20 bg-black" />

                {/* ================= FORM ================= */}

                <form
                  action={handleSubmit}
                  className="space-y-5"
                >

                  {/* EMAIL */}

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
                        name="email"
                        placeholder="YOU@EXAMPLE.COM"
                        className="h-16 rounded-none border-2 border-black bg-[#f1eee5] pl-12 font-black placeholder:text-black/25 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />

                    </div>

                  </div>

                  {/* PASSWORD */}

                  <div>

                    <label
                      htmlFor="password"
                      className="mb-2 block text-xs font-black uppercase tracking-widest"
                    >
                      Password
                    </label>

                    <div className="relative">

                      <LockKeyhole
                        size={20}
                        strokeWidth={3}
                        className="absolute left-4 top-1/2 -translate-y-1/2"
                      />

                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="••••••••••"
                        className="h-16 rounded-none border-2 border-black bg-[#f1eee5] pl-12 font-black placeholder:text-black/25 focus-visible:ring-0 focus-visible:ring-offset-0"
                      />

                    </div>

                  </div>

                  {/* ERRORS */}

                  {errors?.global?.[0]?.message && (
                    <div className="border-2 border-black bg-[#ff5a52] p-4 text-sm font-black">
                      {errors.global[0].message}
                    </div>
                  )}

                  

                  {/* SUBMIT */}

                  <Button
                    type="submit"
                    disabled={fetchStatus === "fetching"}
                    className="h-16 w-full rounded-none border-2 border-black bg-black text-lg font-black text-white shadow-[5px_5px_0_#c8ff00] transition-all hover:bg-[#c8ff00] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {fetchStatus === "fetching"
                      ? "CHECKING..."
                      : "CONTINUE"}

                    <ArrowRight
                      size={23}
                      strokeWidth={3}
                    />
                  </Button>

                </form>

                {/* CARD FOOTER */}

                <div className="mt-7 flex items-center justify-between border-t-2 border-black pt-5 text-[10px] font-black uppercase tracking-widest">

                  <span className="flex items-center gap-2">
                    <Check size={14} strokeWidth={4} />
                    Secure access
                  </span>

                  <span>AUTH / 01</span>

                </div>

              </div>

              {/* Bottom label */}

              <div className="mt-6 flex justify-between text-xs font-black uppercase">
                <span>TODO.STUDIO</span>

                <span className="flex items-center gap-1">
                  MEMBER LOGIN
                  <ArrowUpRight size={14} />
                </span>
              </div>

            </motion.section>

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <footer className="flex flex-col justify-between gap-4 border-t-2 border-black py-6 text-xs font-black uppercase md:flex-row">

          <span>© TODO.STUDIO 2026</span>

          <span>FOCUS / EXECUTE / REPEAT</span>

          <span>BUILT FOR DOERS.</span>

        </footer>

      </div>
    </main>
  );
}