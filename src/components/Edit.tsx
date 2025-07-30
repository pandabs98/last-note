"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditNoteDialogProps {
  note: {
    _id: string;
    title: string;
    content: string;
    status: "draft" | "active";
  };
  onSuccess: () => void;
}

const EditNoteDialog: React.FC<EditNoteDialogProps> = ({ note, onSuccess }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [status, setStatus] = useState<"draft" | "active">(note.status);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!title || !content) return toast.error("Title and content are required");
    setLoading(true);
    try {
      await axios.put(`/api/auth/notes/${note._id}`, {
        title,
        content,
        status,
      });

      toast.success("Note updated");
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error(err)
      toast.error("Failed to update note");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="secondary">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Note</DialogTitle>
        </DialogHeader>

        <Select value={status} onValueChange={(value) => setStatus(value as "draft" | "active")}>
          <SelectTrigger className="w-[180px] mb-4">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
          </SelectContent>
        </Select>

        <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea
          placeholder="Content"
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <DialogFooter className="gap-2 mt-4">
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Note"}
          </Button>
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteDialog;
