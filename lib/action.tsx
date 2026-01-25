"use server";

import { createSession, deleteSession, getUser } from "@/lib/session";
import { redirect } from "next/navigation";

const baseURL = process.env.BE_BASE_API;

export async function loginAction(formData: FormData) {

  const name = formData.get("name");
  const password = formData.get("password");  
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

    if (res.ok) {
      const data = await res.json();
      await createSession("1", "peth", data.token);
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

export async function logoutAction() {
  await deleteSession();
  redirect("/home");
}