"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourseJobs, getFlashcardJobs, getQuizJobs } from "@/services/course";

interface QuizJobHistory {
  job_id: string;
  course_id: number;
  course_title: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress_percent: number;
  total_topics: number;
  completed_topics: number;
  created_at: string;
}

export function QuizHistoryModal({
  course_id,
  setStage,
}: {
  course_id: any;
  setStage: () => void;
}) {
  const [jobs, setJobs] = useState<QuizJobHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getQuizJobs(course_id);
        setJobs(res);
      } catch (error) {
        console.error("Failed to fetch quiz history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [course_id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // แสดงผล DD/MM/YYYY
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={setStage} />

      {/* Modal Content - ปรับ max-h-70vh */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-full max-h-[70vh] animate-in fade-in zoom-in duration-300">
        {/* Header - ส่วนนี้จะคงที่อยู่ด้านบนเสมอ */}
        <div className="p-8 border-b flex justify-between items-center bg-gray-50 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Quiz Generation History
            </h2>
            <p className="text-sm text-gray-500">
              View and manage your recent AI quiz generation jobs
            </p>
          </div>
          <button
            onClick={setStage}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Area - ส่วนที่จะเกิด Scroll เมื่อข้อมูลเกิน 70vh */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="min-w-full inline-block align-middle">
              <table className="w-full text-left border-collapse">
                {/* 📌 ทำให้ Header ตารางติดอยู่กับด้านบนเวลา Scroll (Sticky Header) */}
                <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                  <tr className="text-xs uppercase tracking-wider">
                    <th className="pb-4 font-black">Job ID</th>
                    <th className="pb-4 font-black">Course</th>
                    <th className="pb-4 font-black text-center">Status</th>
                    <th className="pb-4 font-black text-center">Progress</th>
                    <th className="pb-4 font-black">Created At</th>
                    <th className="pb-4 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobs.map((job) => (
                    <tr
                      key={job.job_id}
                      className="hover:bg-gray-50/80 transition-colors group text-xs"
                    >
                      <td className="py-5 font-mono">
                        {job.job_id.slice(0, 8)}...
                      </td>
                      <td className="py-5 text-gray-800">{job.course_title}</td>
                      <td className="py-5 text-center">
                        <span className={` uppercase`}>{job.status}</span>
                      </td>
                      <td className="py-5 text-center">
                        <span className="">{job.progress_percent}%</span>
                      </td>
                      <td className="py-5 text-sm">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="py-5 text-right">
                        <button
                          onClick={() => {
                            router.push(
                              `/course/${course_id}/quiz/preview?job=${job.job_id}`,
                            );
                          }}
                          className="bg-white border-2 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          View Result
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jobs.length === 0 && (
                <div className="text-center py-20 text-gray-400 font-medium">
                  No quiz history found for this course.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface FlashcardJobHistory {
  job_id: string;
  course_id: number;
  course_title: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  progress_percent: number;
  total_topics: number;
  completed_topics: number;
  created_at: string;
}

export function FlashcardHistoryModal({
  course_id,
  setStage,
}: {
  course_id: any;
  setStage: () => void;
}) {
  const [jobs, setJobs] = useState<FlashcardJobHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getFlashcardJobs(course_id);
        setJobs(res);
      } catch (error) {
        console.error("Failed to fetch quiz history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [course_id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // แสดงผล DD/MM/YYYY
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={setStage} />

      {/* Modal Content - ปรับ max-h-70vh */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-full max-h-[70vh] animate-in fade-in zoom-in duration-300">
        {/* Header - ส่วนนี้จะคงที่อยู่ด้านบนเสมอ */}
        <div className="p-8 border-b flex justify-between items-center bg-gray-50 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Flashcard Generation History
            </h2>
            <p className="text-sm text-gray-500">
              View and manage your recent AI flashcard generation
            </p>
          </div>
          <button
            onClick={setStage}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Area - ส่วนที่จะเกิด Scroll เมื่อข้อมูลเกิน 70vh */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="min-w-full inline-block align-middle">
              <table className="w-full text-left border-collapse">
                {/* 📌 ทำให้ Header ตารางติดอยู่กับด้านบนเวลา Scroll (Sticky Header) */}
                <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                  <tr className="text-xs uppercase tracking-wider">
                    <th className="pb-4 font-black">Job ID</th>
                    <th className="pb-4 font-black">Course</th>
                    <th className="pb-4 font-black text-center">Status</th>
                    <th className="pb-4 font-black text-center">Progress</th>
                    <th className="pb-4 font-black">Created At</th>
                    <th className="pb-4 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobs.map((job) => (
                    <tr
                      key={job.job_id}
                      className="hover:bg-gray-50/80 transition-colors group text-xs"
                    >
                      <td className="py-5 font-mono">
                        {job.job_id.slice(0, 8)}...
                      </td>
                      <td className="py-5 text-gray-800">{job.course_title}</td>
                      <td className="py-5 text-center">
                        <span className={` uppercase`}>{job.status}</span>
                      </td>
                      <td className="py-5 text-center">
                        <span className="">{job.progress_percent}%</span>
                      </td>
                      <td className="py-5 text-sm">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="py-5 text-right">
                        <button
                          onClick={() => {
                            router.push(`/course/${course_id}/flashcard/preview?job=${job.job_id}`);
                          }}
                          className="bg-white border-2 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          View Result
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jobs.length === 0 && (
                <div className="text-center py-20 text-gray-400 font-medium">
                  No quiz history found for this course.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


interface CourseJobHistory {
  job_id: string;
  title: string;
  description: string;
  status: "QUEUED" | "PROCESSING" | "COMPLETED" | "FAILED";
  created_at: string;
  updated_at: string;
}

export function CourseHistoryModal({
  setStage,
}: {
  setStage: () => void;
}) {
  const [jobs, setJobs] = useState<CourseJobHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getCourseJobs();
        setJobs(res);
      } catch (error) {
        console.error("Failed to fetch course history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // แสดงผล DD/MM/YYYY
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={setStage} />

      {/* Modal Content - ปรับ max-h-70vh */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col h-full max-h-[70vh] animate-in fade-in zoom-in duration-300">
        {/* Header - ส่วนนี้จะคงที่อยู่ด้านบนเสมอ */}
        <div className="p-8 border-b flex justify-between items-center bg-gray-50 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Course Generation History
            </h2>
            <p className="text-sm text-gray-500">
              View and manage your recent AI course generation
            </p>
          </div>
          <button
            onClick={setStage}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Area - ส่วนที่จะเกิด Scroll เมื่อข้อมูลเกิน 70vh */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="min-w-full inline-block align-middle">
              <table className="w-full text-left border-collapse">
                {/* 📌 ทำให้ Header ตารางติดอยู่กับด้านบนเวลา Scroll (Sticky Header) */}
                <thead className="sticky top-0 bg-white z-10 shadow-[0_1px_0_0_rgba(0,0,0,0.05)]">
                  <tr className="text-xs uppercase tracking-wider">
                    <th className="pb-4 font-black">Job ID</th>
                    <th className="pb-4 font-black">Course</th>
                    <th className="pb-4 font-black text-center">Status</th>
                    <th className="pb-4 font-black">Created At</th>
                    <th className="pb-4 font-black text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {jobs.map((job) => (
                    <tr
                      key={job.job_id}
                      className="hover:bg-gray-50/80 transition-colors group text-xs"
                    >
                      <td className="py-5 font-mono">
                        {job.job_id.slice(0, 8)}...
                      </td>
                      <td className="py-5 text-gray-800">{job.title}</td>
                      <td className="py-5 text-center">
                        <span className={` uppercase`}>{job.status}</span>
                      </td>
                      <td className="py-5 text-sm">
                        {formatDate(job.created_at)}
                      </td>
                      <td className="py-5 text-right">
                        <button
                          onClick={() => {
                            // router.push(`/course/${course_id}/quiz/preview?job=${job.job_id}`);
                          }}
                          className="bg-white border-2 border-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          View Result
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {jobs.length === 0 && (
                <div className="text-center py-20 text-gray-400 font-medium">
                  No course is created
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
