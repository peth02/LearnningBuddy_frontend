'use client'
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreviewQuiz() {
  const [quiz, setQuiz] = useState();
  const searchParams = useSearchParams();

  let job_id = searchParams.get("job") || null;

  useEffect(()=> {
    console.log(job_id)
    
  }, [job_id]);
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100 p-10 gap-6">
      show preview
    </div>
  );
}
