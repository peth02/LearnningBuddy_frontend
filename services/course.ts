import { getToken } from "@/lib/session";

const baseURL = process.env.NEXT_PUBLIC_BE_BASE_API;

export async function getCourses() {
    const token = await getToken();
    const url = `${baseURL}/courses`
    const request = new Request(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const res = await fetch(request);
    if (!res.ok) {
        throw new Error("Fail to fetch");
    }
    console.log(res)
    return await res.json();
}