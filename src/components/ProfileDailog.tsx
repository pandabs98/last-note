"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function ProfileDialog() {
  const { user } = useUser();

  const [securePassword, setSecurePassword] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [recipients, setRecipients] = useState([
    { name: "", email: "", phoneNo: "", relation: "" },
  ]);
  const [triggers, setTriggers] = useState({
    "1day": false,
    "3day": false,
    "1week": false,
    "1month": false,
  });

  const [open, setOpen] = useState(false);
  const [loadingPwd, setLoadingPwd] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  useEffect(() => {
  if (!open) return;

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/profile");
      if (!res.ok) throw new Error("Failed to load profile");

      const data = await res.json();

      if (data) {
        setRecipients((prev) => data.recipients?.length ? data.recipients : prev);
        setTriggers((prev) => data.inactivityTriggers || prev);
        setHasPassword(!!data.hasPassword);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error loading profile");
    }
  };

  fetchProfile();
}, [open]);




  const handleRecipientChange = (index: number, field: string, value: string) => {
    const updated = [...recipients];
    updated[index][field] = value;
    setRecipients(updated);
  };

  const addRecipient = () => {
    setRecipients([
      ...recipients,
      { name: "", email: "", phoneNo: "", relation: "" },
    ]);
  };

  const saveProfile = async () => {
    try {
      setLoadingProfile(true);

      const res = await fetch("/api/auth/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          inactivityTriggers: triggers,
        }),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      toast.success("Profile updated");
    } catch (err) {
      console.error(err)
      toast.error("Failed to update profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  const savePassword = async () => {
    try {
      if (!securePassword || securePassword.length < 4) {
        return toast.error("Password must be at least 4 characters");
      }

      setLoadingPwd(true);

      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: securePassword }),
      });

      if (!res.ok) throw new Error("Failed to set password");

      toast.success("Secure password saved");
      setSecurePassword("");
    } catch (err) {
      console.error(err)
      toast.error("Failed to save password");
    } finally {
      setLoadingPwd(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Update Your FinalNote Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label>Email: {user?.emailAddresses[0]?.emailAddress}</label>
          </div>

          <div>
            <label className="block mb-1">Secure Delete Password</label>
            {hasPassword && (
              <p className="text-sm text-muted-foreground mb-1">
                A secure password is already set.
              </p>
            )}
            <Input
              type="password"
              value={securePassword}
              onChange={(e) => setSecurePassword(e.target.value)}
              placeholder={hasPassword ? "Enter new password to update" : "Set password"}
            />
            <Button
              variant="secondary"
              className="mt-2"
              onClick={savePassword}
              disabled={loadingPwd || !securePassword}
            >
              {loadingPwd ? "Saving..." : hasPassword ? "Update Password" : "Save Password"}
            </Button>
          </div>

          <div>
            <label className="block font-medium mb-1">Inactivity Triggers</label>
            {Object.keys(triggers).map((key) => (
              <div key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={triggers[key as keyof typeof triggers]}
                  onChange={() =>
                    setTriggers((prev) => ({
                      ...prev,
                      [key]: !prev[key as keyof typeof triggers],
                    }))
                  }
                />
                <label>{key}</label>
              </div>
            ))}
          </div>

          <div>
            <label className="block font-medium mb-2">Recipients</label>
            {recipients.map((recipient, i) => (
              <div key={i} className="grid grid-cols-2 gap-2 mb-4">
                <Input
                  placeholder="Name"
                  value={recipient.name}
                  onChange={(e) =>
                    handleRecipientChange(i, "name", e.target.value)
                  }
                />
                <Input
                  placeholder="Email"
                  value={recipient.email}
                  onChange={(e) =>
                    handleRecipientChange(i, "email", e.target.value)
                  }
                />
                <Input
                  placeholder="Phone No"
                  value={recipient.phoneNo}
                  onChange={(e) =>
                    handleRecipientChange(i, "phoneNo", e.target.value)
                  }
                />
                <Input
                  placeholder="Relation"
                  value={recipient.relation}
                  onChange={(e) =>
                    handleRecipientChange(i, "relation", e.target.value)
                  }
                />
              </div>
            ))}
            <Button variant="outline" onClick={addRecipient}>
              + Add More
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={saveProfile} disabled={loadingProfile}>
            {loadingProfile ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
