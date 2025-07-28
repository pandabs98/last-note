"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Contact() {
  const [details, setDetails] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      const res = await axios.post("/api/auth/contact", details, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setSuccess("Message submitted successfully!");
      setDetails({ name: "", email: "", message: "" });
    } catch (err: any) {
      const msg =
        err.response?.data?.error || err.message || "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Contact Us</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl sm:min-h-[500px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            Contact Final Note
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            If anything feels unclear or problematic, please don’t hesitate to
            contact us.
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

          {error && (
            <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm text-center -mt-2">{success}</p>
          )}

          <div className="text-center">
            <Button 
            type="submit" 
            disabled={loading} 
            className="px-8">
              {loading ? "Submitting..." : "Submit"}
            </Button>

          </div>
        </form>

        <DialogFooter className="mt-6 sm:justify-center">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
