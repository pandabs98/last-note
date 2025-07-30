"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function About() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform duration-300 shadow-xl">
          About
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl sm:min-h-[400px] p-6 border-2 border-purple-500 rotate-[2deg] scale-95 hover:rotate-0 hover:scale-100 transition-all duration-500 perspective-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            About Final Note
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Learn more about our mission and features.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground">
          <p>
            Welcome to <strong>Final Note</strong> — your trusted space to store important personal messages and data securely.
          </p>
          <p>
            If you're ever unable to access your account due to unforeseen life circumstances, Final Note ensures your saved messages are safely delivered to your chosen contacts.
          </p>
          <p>
            Whether it's private information, last wishes, or crucial instructions, our platform is built to handle your final messages with sensitivity and care.
          </p>
        </div>

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
