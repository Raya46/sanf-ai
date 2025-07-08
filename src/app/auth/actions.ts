"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(prevState: string | undefined, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return "Could not authenticate user. Please check your credentials.";
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(
  prevState: string | undefined,
  formData: FormData
) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Signup error:", error);
    if (error.message.includes("User already registered")) {
      return "A user with this email already exists.";
    }
    return "Could not create user. Please try again.";
  }

  return redirect("/login?message=Signup successful. Please log in.");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
