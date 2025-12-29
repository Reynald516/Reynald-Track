"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

export function ProfileForm() {
  // nanti ambil dari supabase user
  const [firstName, setFirstName] = useState("Reynald");
  const [lastName, setLastName] = useState("Track");
  const email = "user@email.com"; // read-only

  return (
    <div className="space-y-6">

      {/* IDENTITY */}
      <div className="space-y-4">
        <div>
          <label className="text-sm">First name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Last name</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm">Email</label>
          <Input value={email} disabled />
        </div>
      </div>

      {/* ACCOUNT STATUS */}
      <div className="rounded-md border p-3 text-sm">
        <p className="font-medium">Account status</p>
        <p className="text-muted-foreground">Pilot user</p>
      </div>

    </div>
  );
}