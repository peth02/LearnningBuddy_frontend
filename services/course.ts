import { getToken } from "@/lib/session";

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

export async function getMyCreatedCourses() {
  const token = await getToken();
  const url = `${baseURL}/courses/my`;
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

export async function getMyEnrolledCourses() {
  const token = await getToken();
  const url = `${baseURL}/courses/enrolled`;
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

export async function getCourseByID(id: any) {
  const token = await getToken();
  const url = `${baseURL}/courses/${id}`;
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
