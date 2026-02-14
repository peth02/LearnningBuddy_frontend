import { getToken } from "@/lib/session";
import { Course } from "@/types/Course";

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

export async function createCourse(course: any) {
  console.log("Ready to send to API:", course);
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

export async function delTopic(topic_id: any) {
  const token = await getToken();
  const url = `${baseURL}/courses/${topic_id}/enroll`;
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
