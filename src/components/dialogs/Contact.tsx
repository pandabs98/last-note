"use client";

import { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface ContactDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Contact({ open, setOpen }: ContactDialogProps) {
  const [details, setDetails] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError("");
    setSuccess("");

    if (!details.name || !details.email || !details.message) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      await axios.post("/api/auth/contact", details, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess("Message submitted successfully!");
      setDetails({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "error" in err.response.data
      ) {
        setError((err.response.data as { error: string }).error);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg bg-white dark:bg-zinc-900 text-black dark:text-white border-2 border-purple-500 rotate-[2deg] scale-95 hover:rotate-0 hover:scale-100 transition-all duration-500">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Contact Final Note
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            If anything feels unclear or problematic, please don’t hesitate to contact us.
          </DialogDescription>
        </DialogHeader>

        <form className="mt-6 space-y-6 text-foreground" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={details.name}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={details.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <textarea
              id="message"
              name="message"
              value={details.message}
              onChange={handleChange}
              rows={4}
              placeholder="Write your message here..."
              className="w-full rounded-md border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center -mt-2">{error}</p>}
          {success && <p className="text-green-600 text-sm text-center -mt-2">{success}</p>}

          <div className="text-center">
            <Button type="submit" disabled={loading} className="px-8">
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>

        <DialogFooter className="mt-6 sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
