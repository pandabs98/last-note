"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import CreateNoteDialog from "@/components/Create";
import EditNoteDialog from "@/components/Edit";
import DeleteNoteDialog from "@/components/DeleteNoteDialog";

interface Note {
  _id: string;
  title: string;
  content: string;
  status: "active" | "draft" | "sent";
}

const DashboardPage = () => {
  const [notes, setNotes] = useState<Note[]>([]);

  const fetchNotes = useCallback(async () => {
    try {
      const res = await axios.get("/api/auth/notes");

      // Deduplicate notes by _id
      const uniqueNotes = Array.from(new Map(res.data.data.map((note: Note) => [note._id, note])).values());
      setNotes(uniqueNotes);
    } catch (err) {
      console.error(err)
      toast.error("Failed to load notes.");
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const renderNoteCard = (note: Note) => {
    const statusColors: Record<Note["status"], string> = {
      active: "bg-green-100 text-green-800 border-green-400",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-400",
      sent: "bg-red-100 text-red-800 border-red-400",
    };

    return (
      <div
        key={note._id}
        className={`p-4 border rounded-xl shadow-sm ${statusColors[note.status]} w-full max-w-md`}
      >
        <h3 className="font-bold text-lg">{note.title}</h3>
        <p className="text-sm">{note.content}</p>
        <div className="mt-2 flex justify-between text-sm">
          <EditNoteDialog note={note} onSuccess={fetchNotes} />
          <DeleteNoteDialog id={note._id} onSuccess={fetchNotes} />
        </div>
      </div>
    );
  };

  const notesByStatus = {
    active: notes.filter((n) => n.status === "active"),
    draft: notes.filter((n) => n.status === "draft"),
    sent: notes.filter((n) => n.status === "sent"),
  };

  return (
    <>
      <Toaster position="bottom-right" richColors />
      <div className="min-h-screen flex flex-col items-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className={`flex flex-col items-center w-full ${notes.length ? "mt-5" : "justify-center flex-1"}`}
        >
          {!notes.length && (
            <p className="text-center text-gray-600 text-sm mb-4">
              Update details to send notes to your loved ones in your absence.
            </p>
          )}
          <CreateNoteDialog onSuccess={fetchNotes} />
        </motion.div>

        <AnimatePresence>
          {["active", "draft", "sent"].map((status) =>
            notesByStatus[status as keyof typeof notesByStatus].length > 0 ? (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="mt-10 w-full max-w-5xl"
              >
                <h2 className="text-xl font-bold mb-4 capitalize text-gray-800">
                  {status} Notes
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {notesByStatus[status as keyof typeof notesByStatus].map(renderNoteCard)}
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default DashboardPage;
