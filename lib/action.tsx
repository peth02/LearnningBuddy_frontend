"use server";

import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

const baseURL = process.env.NEXT_PUBLIC_BE_BASE_API;

export async function loginAction(formData: FormData) {
  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const url = `${baseURL}/auth/login`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        password: password,
      }),
    });

    const data = await res.json();
    if (res.ok && name) {
      await createSession(name, data.token);
      return { 
        success: true, 
        message: "Login successful! Welcome back." 
      };
    } else {
      return { 
        success: false, 
        message: "Invalid username or password." 
      };
    }
  } catch (error) {
    console.error("login error :", error);
    return {
      success: false,
      message: "Network error. Please try again later.",
    };
  }
}

export async function registerAction(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirm_password = formData.get("confirm_password") as string;
  const url = `${baseURL}/auth/register`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: name,
        email: email,
        password: password,
        confirm_password: confirm_password,
      }),
    });

    const data = await res.json();

    // 2. จัดรูปแบบการ Return ให้ UI นำไปใช้กับ Alert ได้ง่าย
    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Registration failed. Please try again.",
      };
    }

    return {
      success: true,
      message: "Account created successfully!",
      data: data,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      message: "Could not connect to the server.",
    };
  }
}

export async function logoutAction() {
  await deleteSession();
}
