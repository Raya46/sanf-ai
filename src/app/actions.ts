"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitApplication(applicationData: {
  status: string;
  files: {
    file_type: string;
    file_name: string;
    r2_object_key: string;
    file_size_bytes: number;
  }[];
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: { message: "User not authenticated" } };
  }

  const { data: application, error: applicationError } = await supabase
    .from("credit_applications")
    .insert({
      user_id: user.id,
      status: applicationData.status,
    })
    .select()
    .single();

  if (applicationError) {
    console.error("Error creating application:", applicationError);
    return { error: applicationError };
  }

  const filesToInsert = applicationData.files.map((file) => ({
    ...file,
    application_id: application.id,
  }));

  const { error: filesError } = await supabase
    .from("application_files")
    .insert(filesToInsert);

  if (filesError) {
    console.error("Error inserting files:", filesError);

    return { error: filesError };
  }

  revalidatePath("/application");
  return { success: true, applicationId: application.id };
}
