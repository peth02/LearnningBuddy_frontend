"use client";

import Link from "next/link";
import { loginAction } from "@/lib/action";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="flex rounded-lg w-full max-w-3xl flex-col items-center p-16 bg-white items-start">
        <div>
          <Link href="/home">home</Link>
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
            Login Page
          </h1>
        </div>
        <form action={loginAction}>
          <div className="flex flex-col">
            <label>Name</label>
            <input
              name="name"
              type="text"
              aria-label="name"
              placeholder="Name"
              maxLength={50}
              required
              className=""
            />
            <label>Password</label>
            <input
              name="password"
              type="text"
              aria-label="password"
              placeholder="Password"
              required
              className=""
            />
            <div>
              <Link href="/register">Already have an account</Link>
            </div>
            <button>submit</button>
          </div>
        </form>
      </main>
    </div>
  );
}