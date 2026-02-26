import { getToken } from "@/lib/session";
import { Course, Topic2 } from "@/types/Course";
import { UpdateCourseTopicsProps } from "@/types/Form"

const baseURL = process.env.NEXT_PUBLIC_BE_BASE_API;

export async function getCourses(params?: any) {
  const token = await getToken();
  const url = `${baseURL}/courses${params}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  const request = new Request(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await fetch(request);
  if (!res.ok) {
    throw new Error("Fail to fetch");
  }
  console.log(res);
  return await res.json();
}

export async function getMyCreatedCourses(params?: any) {
  const token = await getToken();
  const url = `${baseURL}/courses/my${params}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  const request = new Request(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await fetch(request);
  if (!res.ok) {
    throw new Error("Fail to fetch");
  }
  console.log(res);
  return await res.json();
}

export async function getMyEnrolledCourses(params?: any) {
  const token = await getToken();
  const url = `${baseURL}/courses/enrolled${params}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  const request = new Request(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await fetch(request);
  if (!res.ok) {
    throw new Error("Fail to fetch");
  }
  console.log(res);
  return await res.json();
}

export async function getCourseByID(course_id: any) {
  const token = await getToken();
  const url = `${baseURL}/courses/${course_id}`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  const request = new Request(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await fetch(request);
  if (!res.ok) {
    throw new Error("Fail to fetch");
  }
  console.log(res);
  return await res.json();
}

export async function getCourseTopics(course_id: any) {
  const token = await getToken();
  const url = `${baseURL}/courses/${course_id}/content`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  const request = new Request(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await fetch(request);
  if (!res.ok) {
    throw new Error("Fail to fetch");
  }
  console.log(res);
  return await res.json();
}

export async function createCourse(course: any) {
  const url = `${baseURL}/courses`;
  const token = await getToken();
  try {
    // create form data
    if (course) {
      const sendData = {
        title: course.title,
        description: course.description,
        is_published: true,
        topics: course.topics, // ส่งเป็น Array ได้เลยไม่ต้อง stringify
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
        const errorData = await res.json();
        console.error("Error:", errorData);
        return null;
      }
      return await res.json();
    }
  } catch (error) {
    alert("An unexpected error occurred");
    return [];
  }
}
export async function enrollCourse(course_id: any) {
  const token = await getToken();
  const url = `${baseURL}/courses/${course_id}/enroll`;
  if (!token) {
    console.warn("Login is required");
    return [];
  }
  const request = new Request(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const res = await fetch(request);
  if (!res.ok) {
    throw new Error("Fail to enroll");
  }
  console.log(res);
  return await res.json();
}

export async function updateCourseTopic(course_id: any, topic: Topic2[] | UpdateCourseTopicsProps[]) {
  const token = await getToken();
  const url = `${baseURL}/courses/${course_id}/content`;
  const sendData = {
    course_id: course_id,
    topics: topic,
  };

  if (!token) {
    console.warn("Login is required");
    return null;
  }

  try {
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sendData),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Fail to update course's topic");
    }

    console.log("Update success:", res.status);
    return await res.json();

  } catch (error: any) {
    console.error("Error in updateCourseTopic:", error.message);
    throw error; 
  }
}

export async function getQuizJobs(course_id: any) {
    // get quiz jobs in course
  const token = await getToken();
  const url = `${baseURL}/courses/${course_id}/quiz-jobs`;
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
      throw new Error(errorData.message || `Fail to get quiz jobs in course ${course_id}`);
    }
    console.log(res);
    return await res.json();
  } catch (error: any) {
    console.error("Error in getQuizJobs:", error.message);
    throw error;
  }
}