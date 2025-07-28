"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  onSuccess?: () => void;
}

const CreateNoteDialog = ({ onSuccess }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", status: "draft" });
  const [loading, setLoading] = useState(false);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const autosaveTimer = useRef<NodeJS.Timeout | null>(null);

  const reset = () => {
    setForm({ title: "", content: "", status: "draft" });
    setDraftId(null);
    setIsSaved(false);
  };

  const handleSave = async () => {
  if (loading) return;
  setLoading(true);

  try {
    if (!form.title && !form.content) {
      toast.error("Note is empty");
      return;
    }

    let noteId;

    if (draftId) {
      await axios.put(`/api/auth/notes?id=${draftId}`, form);
    } else {
      const res = await axios.post("/api/auth/notes", form);
      noteId = res.data?.note?._id;
      if (form.status === "draft" && noteId) {
        setDraftId(noteId);
      }
    }

    toast.success(`${form.status === "draft" ? "Draft" : "Note"} saved`);

    setIsSaved(true);
    onSuccess?.();
    setOpen(false);    // ❗️Close dialog after saving
    reset();           // ❗️Reset form after closing
    router.refresh();
    
  } catch (error) {
    toast.error("Failed to save note");
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  const autoSaveDraft = async () => {
    if (!form.title && !form.content) return;
    if (form.status === "draft") await handleSave();
  };

  useEffect(() => {
    if (!open) return;

    autosaveTimer.current = setInterval(() => {
      if (!isSaved) {
        autoSaveDraft();
      }
    }, 5000); 

    return () => {
      if (autosaveTimer.current) clearInterval(autosaveTimer.current);
    };
  }, [form, open, isSaved]);

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <Dialog
        open={open}
        onOpenChange={(val) => {
          if (!val && !isSaved && form.status === "draft") autoSaveDraft();
          setOpen(val);
          if (!val) reset();
        }}
      >
        <DialogTrigger asChild>
          <Button>Create Note</Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Note</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Textarea
              placeholder="Write your note..."
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="min-h-[120px]"
            />
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : `Save as ${form.status}`}
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" onClick={reset}>Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateNoteDialog;
