"use client";

import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import { LogOut, ArrowLeft, Check, ListTodo, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function SignOutPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#171717] px-4 py-10 text-white sm:px-6">
      {/* Subtle dotted background matching the Todo dashboard */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(#555 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl">
        {/* Navbar */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-10 flex items-center justify-between rounded-2xl border border-white/5 bg-[#292929] px-5 py-4 shadow-lg sm:px-7"
        >
          <Link href="/" className="group flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e49385] text-[#171717] transition-transform group-hover:-rotate-6">
              <ListTodo size={22} strokeWidth={2.5} />
            </span>
            <span className="text-lg font-bold tracking-tight sm:text-xl">
              TODO<span className="text-[#e49385]">.</span>STUDIO
            </span>
          </Link>
          <span className="hidden items-center gap-2 text-xs font-medium text-white/50 sm:flex">
            <span className="h-2 w-2 rounded-full bg-[#a2d7cb]" />
            YOUR SPACE. YOUR RULES.
          </span>
        </motion.nav>

        {/* Confirmation card */}
        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-xl rounded-[28px] border border-white/[0.07] bg-[#222222] p-6 shadow-2xl shadow-black/30 sm:p-10"
        >
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e49385]/25 bg-[#e49385]/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#e49385]">
                <ShieldCheck size={14} />
                Account
              </p>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                Sign out<span className="text-[#e49385]">.</span>
              </h1>
            </div>
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#e49385] text-[#171717] sm:h-16 sm:w-16">
              <LogOut className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
          </div>

          <p className="max-w-md text-sm leading-7 text-white/60 sm:text-base">
            Ready to wrap things up? Are you sure you want to sign out of your
            account?
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 bg-[#303030] px-5 py-3 text-sm font-semibold text-white/80 transition hover:border-white/20 hover:bg-[#393939] hover:text-white"
            >
              <ArrowLeft size={17} />
              Cancel
            </button>

            <SignOutButton redirectUrl="/sign-in">
              <button
                type="button"
                className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#e49385] px-5 py-3 text-sm font-semibold text-[#171717] transition hover:bg-[#f0a497] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e49385] focus-visible:ring-offset-2 focus-visible:ring-offset-[#222222]"
              >
                <LogOut size={17} />
                Sign Out
              </button>
            </SignOutButton>
          </div>

          <div className="mt-7 flex items-start gap-3 rounded-xl border border-white/[0.06] bg-[#1b1b1b] p-4">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#a2d7cb]/15 text-[#a2d7cb]">
              <Check size={15} strokeWidth={2.5} />
            </span>
            <p className="text-xs leading-6 text-white/50">
              Your tasks are here when you return. You can safely sign out and
              come back whenever you’re ready.
            </p>
          </div>
        </motion.section>

        <footer className="mt-7 flex flex-wrap items-center justify-between gap-3 px-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/35 sm:text-xs">
          <span>© TODO.STUDIO 2026</span>
          <span>One task at a time.</span>
        </footer>
      </div>
    </main>
  );
}
