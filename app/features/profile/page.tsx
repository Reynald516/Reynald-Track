"use client";

import { User } from "lucide-react";
import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  return (
    <div className="max-w-xl mx-auto px-4 pt-12 pb-24 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Profile</h1>
      </div>

      {/* Content */}
      <ProfileForm />
    </div>
  );
}
