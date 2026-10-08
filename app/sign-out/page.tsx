"use client";

import { SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function SignOutPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <LogOut className="h-7 w-7 text-red-500" />
        </div>

        <h1 className="text-2xl font-bold">Sign out</h1>

        <p className="mt-2 text-sm text-gray-400">
          Are you sure you want to sign out of your account?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => window.history.back()}
            className="flex-1 rounded-lg border border-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/10"
          >
            Cancel
          </button>

          <SignOutButton redirectUrl="/sign-in">
            <button className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-600">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}