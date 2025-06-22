import { RegisterForm } from "@/components/auth/register-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function RegisterPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <main className="w-full h-screen">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
