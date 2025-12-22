// app/actions.ts (or wherever you prefer)
"use server"

import { createSession, deleteSession, getUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function loginAction() {
  await createSession("1", "peth");
  
  // Optional: Check if it worked (Logs appear in VS Code Terminal)
  const user = await getUser();
  console.log("User logged in:", user);
  
  // Refresh the page so the UI updates to show "Logout" instead of "Login"
  revalidatePath("/home"); 
}

export async function logoutAction() {
  await deleteSession();
  revalidatePath("/home");
}