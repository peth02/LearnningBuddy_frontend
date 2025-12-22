'use client'
import Link from "next/link";
import { loginAction, logoutAction } from "@/lib/action";

export function HomeNavbar() {
  return (
    <nav className="min-w-[250px] w-auto h-screen bg-gray-200 px-4 py-10 sticky top-0">
      <div className="flex flex-col h-full">
        <div>
          <p>Myapp Learning Platform</p>
          <hr className="my-6" />
        </div>
        <ul>
            <li><Link href={"/home"} className="">Explore</Link></li>
            <li><Link href={"/home"} className="">My Learning</Link></li>
            <li><Link href={"/home"} className="">My Created Courses</Link></li>
        </ul>
        <div className="flex flex-col mt-auto">
            <hr className="my-4" />
            <Link href={"/login"}>Login</Link>
            <Link href={"/login"}>Login</Link>
            <button onClick={loginAction}>login</button>
            <button onClick={logoutAction}>logout</button>
        </div>
      </div>
    </nav>
  );
}
