import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ProfileForm } from "./profile-form";
import { User } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-xl mx-auto py-12 space-y-6">
      <div className="flex items-center gap-3">
        <User className="h-6 w-6" />
        <h1 className="text-xl font-semibold">Profile</h1>
      </div>

      <ProfileForm
        initialFirstName={profile?.first_name ?? ""}
        initialLastName={profile?.last_name ?? ""}
        email={user.email ?? ""}
      />
    </div>
  );
}