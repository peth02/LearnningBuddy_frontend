"use server";

import { createSession, deleteSession} from "@/lib/session";
import { redirect } from "next/navigation";

const baseURL = process.env.NEXT_PUBLIC_BE_BASE_API;

export async function loginAction(formData: FormData) {

  const name = formData.get("name") as string;
  const password = formData.get("password") as string;
  const url = `${baseURL}/auth/login`;
  let success = false;

  try {
    console.log("User login :", url);
    const  res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username: name,
        password: password
      })
    });

    if (res.ok && name) {
      const data = await res.json();
      await createSession(name, data.token);
      success = true;
    } else {
      console.log("status :", res.status)
    }
  } catch (error) {
    console.log("login error :", error)
  }

  if(success) {
    redirect("/home");
  }
}

export async function registerAction(formData: FormData) {

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirm_password = formData.get("confirm_password") as string;  
  const url = `${baseURL}/auth/register`;
  let success = false;

  try {
    console.log("User register :", url);
    const  res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        username: name,
        email: email,
        password: password,
        confirm_password: confirm_password
      })
    });

    if (res.ok) {
      const data = await res.json();
      console.log("successfully register :", data)
      success = true;
    } else {
      console.log("status :", res.status)
    }
  } catch (error) {
    console.log("login error :", error)
  }

  if(success) {
    redirect("/login");
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect("/home");
}