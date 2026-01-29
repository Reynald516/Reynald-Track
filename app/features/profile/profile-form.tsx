"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateProfile } from "./profile-actions";
import { toast } from "sonner";

export function ProfileForm({
  initialFirstName,
  initialLastName,
  email,
}: {
  initialFirstName: string;
  initialLastName: string;
  email: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);

  const onSave = () => {
    startTransition(async () => {
      try {
        await updateProfile({ firstName, lastName });
        toast.success("Profile updated");
      } catch (e: any) {
        toast.error(e.message || "Failed to update profile");
      }
    });
  };

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

      {/* ACTIONS */}
      <div className="flex gap-3 pt-4 border-t">
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>

        <Button onClick={onSave} disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
}