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
import axios from "axios";
import { Input } from "@/components/ui/input";

const DeleteNoteDialog = ({
  id,
  onSuccess,
}: {
  id: string;
  onSuccess: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const handleDelete = async () => {
  setLoading(true);
  try {
    const res = await axios.post(`/api/auth/notes/${id}/delete`, {
      password: password, 
    });

    toast.success(res.data.message || "Note deleted successfully");
    onSuccess();
    setOpen(false);
    setPassword("");
  } catch (error: any) {
    if (error.response?.data?.error) {
      toast.error(error.response.data.error);
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
