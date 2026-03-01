"use client";
import Link from "next/link";
import { logoutAction } from "@/lib/action";
import { getUser } from "@/lib/session";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CourseNavItemProps, CourseNavItemProps2 } from "@/types/Props";

export function HomeNavbar() {
  const [user, setUser] = useState<any>(null);
  const path = usePathname();
  const router = useRouter();
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

  async function handleLogout() {
    setUser(null);
    await logoutAction();
    window.location.href = "/home";
  }

  return (
    <nav className="min-w-[280px] h-screen px-4 py-10 sticky top-0 bg-white border-r border-gray-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all">
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
          <hr />
          {!user ? (
            <div className="flex flex-col mt-6 gap-6">
              <Link
                href={"/login"}
                className="bg-blue-500 text-white font-bold p-2 rounded-lg text-center cursor-pointer hover:bg-blue-600"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col mt-6 gap-6">
              <div>Welcome, {user.userName}</div>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white font-bold p-2 rounded-lg cursor-pointer hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export function CourseTopicsNav({
  index,
  label,
  showDelete,
  onDelete,
}: CourseNavItemProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Check if this specific item is the one currently selected in the URL
  const activeTopicIndex = searchParams.get("topic");
  const isActive = activeTopicIndex == index;

  const handleClick = () => {
    // 2. Update the URL. { scroll: false } prevents the page from jumping to the top
    router.push(`?topic=${index}`, { scroll: false });
  };

  return (
    <div className="max-w-[300px] group relative flex items-center my-2">
      <button
        onClick={handleClick}
        className={`w-full flex items-center py-3 px-3 transition-all duration-200 border-2 rounded-xl text-left cursor-pointer
          ${isActive ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"}
        `}
      >
        <span className="font-medium text-sm mr-6 break-all">
          #{index} {label}
        </span>
      </button>

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(parseInt(index) - 1);
          }}
          className="absolute right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Topic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
export function CourseTopicsPreviewNav({
  job_id,
  index,
  label,
  showDelete,
  onDelete,
}: CourseNavItemProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Check if this specific item is the one currently selected in the URL
  const activeTopicIndex = searchParams.get("t");
  const isActive = activeTopicIndex == index;

  const handleClick = () => {
    // 2. Update the URL. { scroll: false } prevents the page from jumping to the top
    router.push(`?job=${job_id}&t=${index}`, { scroll: false });
  };

  return (
    <div className="max-w-[300px] group relative flex items-center my-2">
      <button
        onClick={handleClick}
        className={`w-full flex items-center py-3 px-3 transition-all duration-200 border-2 rounded-xl text-left cursor-pointer
          ${isActive ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"}
        `}
      >
        <span className="font-medium text-sm mr-6 break-all">
          #{index} {label}
        </span>
      </button>

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(parseInt(index) - 1);
          }}
          className="absolute right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Topic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export function CourseQuestionsNav({
  index,
  label,
  showDelete,
  onDelete,
}: CourseNavItemProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Check if this specific item is the one currently selected in the URL
  const activeTopicIndex = searchParams.get("q");
  const isActive = activeTopicIndex == index;

  const handleClick = () => {
    // 2. Update the URL. { scroll: false } prevents the page from jumping to the top
    router.push(`?q=${index}`, { scroll: false });
  };

  return (
    <div className="max-w-[200px] group relative flex items-center my-2">
      <button
        onClick={handleClick}
        className={`w-full flex items-center py-3 px-3 transition-all duration-200 border-2 rounded-xl text-left cursor-pointer
          ${isActive ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"}
        `}
      >
        <span className="font-medium text-sm mr-6 break-all">
          #{index} {label}
        </span>
      </button>

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(parseInt(index) - 1);
          }}
          className="absolute right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Topic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export function CourseQuestionsPreviewNav({
  index,
  label,
  showDelete,
  onDelete,
  jobId
}: CourseNavItemProps2) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Check if this specific item is the one currently selected in the URL
  const activeTopicIndex = searchParams.get("q");
  const isActive = activeTopicIndex == index;

  const handleClick = () => {
    // 2. Update the URL. { scroll: false } prevents the page from jumping to the top
    router.push(`?job=${jobId}&q=${index}`, { scroll: false });
  };

  return (
    <div className="max-w-[200px] group relative flex items-center my-2">
      <button
        onClick={handleClick}
        className={`w-full flex items-center py-3 px-3 transition-all duration-200 border-2 rounded-xl text-left cursor-pointer
          ${isActive ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"}
        `}
      >
        <span className="font-medium text-sm mr-6 break-all">
          #{index} {label}
        </span>
      </button>

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(parseInt(index) - 1);
          }}
          className="absolute right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Topic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export function CourseFlashcardsNav({
  index,
  label,
  showDelete,
  onDelete,
}: CourseNavItemProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Check if this specific item is the one currently selected in the URL
  const activeTopicIndex = searchParams.get("c");
  const isActive = activeTopicIndex == index;

  const handleClick = () => {
    // 2. Update the URL. { scroll: false } prevents the page from jumping to the top
    router.push(`?c=${index}`, { scroll: false });
  };

  return (
    <div className="max-w-[200px] group relative flex items-center my-2">
      <button
        onClick={handleClick}
        className={`w-full flex items-center py-3 px-3 transition-all duration-200 border-2 rounded-xl text-left cursor-pointer
          ${isActive ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"}
        `}
      >
        <span className="font-medium text-sm mr-6 break-all">
          #{index} {label}
        </span>
      </button>

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(parseInt(index) - 1);
          }}
          className="absolute right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Topic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export function CourseFlashcardsPreviewNav({
  index,
  label,
  showDelete,
  onDelete,
  jobId
}: CourseNavItemProps2) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Check if this specific item is the one currently selected in the URL
  const activeTopicIndex = searchParams.get("c");
  const isActive = activeTopicIndex == index;

  const handleClick = () => {
    // 2. Update the URL. { scroll: false } prevents the page from jumping to the top
    router.push(`?job=${jobId}&c=${index}`, { scroll: false });
  };

  return (
    <div className="max-w-[200px] group relative flex items-center my-2">
      <button
        onClick={handleClick}
        className={`w-full flex items-center py-3 px-3 transition-all duration-200 border-2 rounded-xl text-left cursor-pointer
          ${isActive ? "bg-blue-50 border-blue-500 text-blue-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-600 hover:bg-gray-100"}
        `}
      >
        <span className="font-medium text-sm mr-6 break-all">
          #{index} {label}
        </span>
      </button>

      {showDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(parseInt(index) - 1);
          }}
          className="absolute right-3 p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Delete Topic"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
}