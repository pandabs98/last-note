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

export function About() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">About</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl sm:min-h-[400px] p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">
            About Final Note
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Learn more about our purpose and features.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-4 text-sm sm:text-base leading-relaxed text-foreground">
          <p>
            Welcome to the <strong>Final Note</strong> platform! We're dedicated to providing you a secure space to save important personal messages and data.
          </p>
          <p>
            If you're ever unable to access your account due to unexpected life circumstances, Final Note ensures your saved messages are safely delivered to your trusted contacts or loved ones.
          </p>
          <p>
            Whether it's private information, last wishes, or important instructions, our system is built to handle your final notes with care and respect.
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
