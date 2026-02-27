import { getToken } from "@/lib/session";
import { Question, QuizMetaData } from "@/types/Course";

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
  // get quiz detail for edit
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
export async function createQuizPreview(quizConfig: any, course_id: any) {
  const token = await getToken();
  const url = `${baseURL}/quizzes/preview/jobs`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        course_id: course_id,
        quiz_topics: quizConfig,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Fail to create preview quiz`);
    }
    console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in createQuizPreview:", error.message);
    throw error;
  }
}
export async function getQuizPreviewByJobId(job_id: any) {
  const token = await getToken();
  const url = `${baseURL}/quizzes/preview/jobs/${job_id}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Fail to get quiz by job id");
    }
    console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in getQuizPreviewByJobId:", error.message);
    throw error;
  }
}
export async function createQuizFromPreview(
  course_id: any,
  quizMetaData: QuizMetaData,
  questions: Question[],
) {
  const url = `${baseURL}/courses/${course_id}/quizzes`;
  const token = await getToken();
  try {
    // create form data
    if (quizMetaData && questions) {
      const sendData = {
        title: quizMetaData.title,
        solution_visibility: quizMetaData.solution_visibility,
        is_published: quizMetaData.is_published,
        questions: questions,
      };
      if (!token) {
        console.warn("Login is required");
        return [];
      }
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sendData),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Fail to create quiz`);
      }
      console.log(res);
      return await res.json();
    }
  } catch (error: any) {
    console.error("Error in createQuizFromPreview:", error.message);
    throw error;
  }
}

export async function updateCourseQuizById(
  quiz_id: any,
  questions: Question[],
) {
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
        questions: questions,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Fail to update quiz ${quiz_id}`);
    }
    console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in updateCourseQuizById:", error.message);
    throw error;
  }
}

export async function getStartQuizById(quiz_id: any) {
  // get quiz without answer
  const token = await getToken();
  const url = `${baseURL}/quizzes/${quiz_id}/attempt`;
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

export async function submitQuizAttempt(
  quiz_id: any,
  answer: { question_id: string; choice_id: string }[],
) {
  // submit quiz to get feedback
  const token = await getToken();
  const url = `${baseURL}/quizzes/${quiz_id}/attempt`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answers: answer,
      }),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Fail to submit quiz ${quiz_id} attempt`,
      );
    }
    console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in submitQuizAttempt:", error.message);
    throw error;
  }
}
