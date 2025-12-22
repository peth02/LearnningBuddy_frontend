"use server"

import { createSession, deleteSession, getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function loginAction() {
  await createSession("1", "peth");
  const user = await getUser();
  console.log("User logged in:", user);
  
  revalidatePath("/home");
}

export async function logoutAction() {
  await deleteSession();
  revalidatePath("/home");
}