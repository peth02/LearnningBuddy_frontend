'use client'
import Link from "next/link";
import { loginAction, logoutAction } from "@/lib/action";
import { getUser } from "@/lib/session";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function HomeNavbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

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
    location.reload();
  }
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
            { user ? (
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
            )
            }
        </div>
      </div>
    </nav>
  );
}
