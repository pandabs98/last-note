import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";

type DeleteNoteDialogProps = {
  id: string;
  onSuccess: () => void;
};

const DeleteNoteDialog = ({ id, onSuccess }: DeleteNoteDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`/api/auth/notes/${id}/delete`, {
        password,
      });

      toast.success(res.data.message || "Note deleted successfully");
      onSuccess();
      setOpen(false);
      setPassword("");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ error: string }>;
      if (axiosError.response?.data?.error) {
        toast.error(axiosError.response.data.error);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <p className="text-sm mb-2">
          Are you sure you want to delete this note? Enter your secure delete
          password to confirm.
        </p>

        <Input
          type="password"
          placeholder="Secure delete password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button
            onClick={() => {
              setOpen(false);
              setPassword("");
            }}
            variant="outline"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            variant="destructive"
            disabled={loading || !password}
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteNoteDialog;
