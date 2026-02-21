import { getToken } from "@/lib/session";
import { Question } from "@/types/Course";

const baseURL = process.env.NEXT_PUBLIC_BE_BASE_API;

export async function getQuizzesByCourseId(course_id: any) {
  const token = await getToken();
  const url = `${baseURL}/courses/${course_id}/quizzes`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Fail to get quizzes");
    }
    console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in getQuizzesByCourseId:", error.message);
    throw error;
  }
}

export async function getQuizByQuizId(quiz_id: any) {
  const token = await getToken();
  const url = `${baseURL}/quizzes/${quiz_id}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Fail to get quiz ${quiz_id}`);
    }
    console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in getQuizByQuizId:", error.message);
    throw error;
  }
}

export async function updateCourseQuizById(quiz_id: any, questions: Question[]) {
  const token = await getToken();
  const url = `${baseURL}/quizzes/${quiz_id}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questions: questions
      }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Fail to get quiz ${quiz_id}`);
    }
    console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in getQuizByQuizId:", error.message);
    throw error;
  }
}
