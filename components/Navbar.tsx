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

  function handleLogout() {
    setUser(null);
    logoutAction();
    redirect("/home");
  }

  return (
    <nav className="min-w-[250px] h-screen px-4 py-10 sticky top-0">
      <div className="flex flex-col h-full">
        <div>
          <h1 className="text-xl text-center bold">Learning buddy</h1>
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
          <hr/>
          {!user ? (
            <div className="flex flex-col mt-6 gap-6">
              <Link href={"/login"} className="bg-blue-500 text-white font-bold p-2 rounded-lg text-center">Login</Link>
            </div>
          ) : (
            <div className="flex flex-col mt-6 gap-6">
              <div>Welcome, {user.userName}</div>
              <button onClick={handleLogout} className="bg-red-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-red-600">Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
