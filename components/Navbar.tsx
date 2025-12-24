"use client";
import Link from "next/link";
import { loginAction, logoutAction } from "@/lib/action";
import { getUser } from "@/lib/session";
import { useEffect, useState } from "react";
import { usePathname, redirect } from "next/navigation";

export function HomeNavbar() {
  const [user, setUser] = useState<any>(null);
  const path = usePathname();

  let pages;
  if (user) {
    pages = new Map([
      ["/home", "Explore"],
      ["/my_learning", "My Learning"],
      ["/my_created_courses", "My Created Courses"],
    ]);
  } else {
    pages = new Map([["/home", "Explore"]]);
  }

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      console.log("Current user:", user);
      setUser(user);
    }
    fetchUser();
  }, []);

  function handleLogin() {
    loginAction();
    location.reload();
  }
  function handleLogout() {
    logoutAction();
    setUser(null);
    redirect("/home");
  }

  return (
    <nav className="min-w-[250px] w-auto h-screen px-4 py-10 sticky top-0">
      <div className="flex flex-col h-full">
        <div>
          <p>Myapp Learning Platform</p>
          <hr className="my-6" />
        </div>
        <div className="flex flex-col gap-3">
          {[...pages.entries()].map(([key, value]) => (
            <Link
              key={key}
              href={key}
              className={
                path.includes(key)
                  ? "flex items-center gap-3 px-4 py-3 rounded-lg text-blue-500 bg-blue-100 font-bold"
                  : "flex items-center gap-3 px-4 py-3 rounded-lg hover:text-blue-500 hover:bg-blue-100 hover:font-bold"
              }
            >
              {value}
            </Link>
          ))}
        </div>
        <div className="flex flex-col mt-auto">
          <hr className="my-4" />
          {user ? (
            <>
              <span>Welcome, {user.userName}</span>
              <button onClick={handleLogout}>logout</button>
            </>
          ) : (
            <>
              <Link href={"/login"}>Signin</Link>
              <Link href={"/login"}>Login</Link>
              <button onClick={handleLogin}>login</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
