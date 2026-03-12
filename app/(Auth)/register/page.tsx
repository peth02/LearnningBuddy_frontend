"use client";

import Link from "next/link";
import { registerAction } from "@/lib/action";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@/components/Aleart";

export default function Register() {
  const router = useRouter();
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await registerAction(formData);

      if (res.success) {
        setAlert({ message: res.message, type: "success" });
        setTimeout(() => router.push("/login"), 10000);
      } else {
        setAlert({
          message: res.message || "Registration failed",
          type: "error",
        });
      }
    } catch (error) {
      setAlert({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      {/* 🔔 Floating Alert System (Style 1) */}
      <div className="fixed top-10 right-10 z-[100] flex flex-col gap-4">
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
      <main className="w-full max-w-[450px] rounded-2xl bg-white p-10 shadow-xl shadow-zinc-200/50 border border-zinc-100">
        <Link
          href="/home"
          className="mb-500 text-sm text-zinc-500 hover:text-zinc-900 hover:underline"
        >
          <span>←</span> Back to home
        </Link>
        <div className="mt-5">
          <h1 className="text-3xl text-center font-semibold text-black">
            REGISTER
          </h1>
          <p className="mt-2 text-center text-sm text-zinc-500">
            Please enter your details to create an account
          </p>
        </div>
        <form onSubmit={handleSubmit}>
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
            <label className="mt-5">Email</label>
            <input
              name="email"
              type="email"
              aria-label="email"
              placeholder="Email"
              maxLength={50}
              required
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <label className="mt-5">Password</label>
            <input
              name="password"
              type="password"
              aria-label="password"
              placeholder="••••••••"
              minLength={8}
              required
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <label className="mt-5">Confirm Password</label>
            <input
              name="confirm_password"
              type="password"
              aria-label="confirm_password"
              placeholder="••••••••"
              minLength={8}
              required
              className="flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <div className="flex mt-10 gap-10">
              <button className="felx flex-1 bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer">
                Register
              </button>
              <Link
                href="/login"
                className="flex flex-1 justify-center rounded-lg border bg-white px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
              >
                Login
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
