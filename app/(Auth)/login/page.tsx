"use client";

import Link from "next/link";

export default function Login() {

  const handleLogin = () => {

  }
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="flex rounded-lg w-full max-w-3xl flex-col items-center p-16 bg-white items-start">
        <div>
          <Link href="/home">home</Link>
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black">
            Login Page
          </h1>
        </div>
        <form onSubmit={() => console.log("hello")}>
          <div className="flex flex-col">
            <label>name</label>
            <input
              type="text"
              aria-label="name"
              placeholder="Name"
              maxLength={50}
              required
              className=""
            />
            <label>email</label>
            <input
              type="email"
              aria-label="email"
              placeholder="Email"
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