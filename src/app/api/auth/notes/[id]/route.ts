import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Note from "@/models/note";
import mongoose from "mongoose";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const noteId = params.id;
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
      return NextResponse.json({ error: "Invalid note ID" }, { status: 400 });
    }

    const body = await req.json();
    const { title, content, status } = body;

    if (!title || !content || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const note = await Note.findOneAndUpdate(
      { _id: noteId, userId }, // Make sure the note belongs to the user
      { title, content, status },
      { new: true }
    );

    if (!note) {
      return NextResponse.json({ error: "Note not found or not authorized" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note updated", note }, { status: 200 });
  } catch (error) {
    console.error("Update note error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
