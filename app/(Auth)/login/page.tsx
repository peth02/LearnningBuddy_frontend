"use client";

import Link from "next/link";
import { loginAction } from "@/lib/action";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="w-full max-w-[450px] rounded-2xl bg-white p-10 shadow-xl shadow-zinc-200/50 border border-zinc-100">
          <Link
            href="/home"
            className="mb-500 text-sm text-zinc-500 hover:text-zinc-900 hover:underline"
          >
            <span>←</span> Back to home
          </Link>
          <div className="mt-5">
            <h1 className="text-3xl text-center font-semibold text-black">
              WELCOME
            </h1>
            <p className="mt-2 text-center text-sm text-zinc-500">
              Please enter your details to sign in
            </p>
          </div>
        <form action={loginAction}>
          <div className="flex flex-col">
            <label className="mt-10">Name</label>
            <input
              name="name"
              type="text"
              aria-label="name"
              placeholder="Name"
              maxLength={50}
              required
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <label className="mt-10">Password</label>
            <input
              name="password"
              type="password"
              aria-label="password"
              placeholder="••••••••"
              required
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="flex mt-10 gap-10">
              <button className="felx flex-1 bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer">
                Login
              </button>
              <Link
                href="/register"
                className="flex flex-1 justify-center rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Create an account
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
