// api/auth/notes/[id]/delete/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Note from "@/models/note";
import Profile from "@/models/user";
import bcrypt from "bcryptjs";
import mongoose from "mongoose"; 

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    const userProfile = await Profile.findOne({ clerkUserId: userId }); 

    if (!userProfile?.secureDeletePassword) {
      return NextResponse.json(
        { error: "Secure delete password not set. Please set it in your profile." },
        { status: 400 }
      );
    }

    const isMatch = await bcrypt.compare(password, userProfile.secureDeletePassword);
    if (!isMatch) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    let noteId;
    try {
      noteId = new mongoose.Types.ObjectId(params.id);
    } catch (err) {
      console.error("Invalid Note ID format:", params.id, err);
      return NextResponse.json({ error: "Invalid Note ID" }, { status: 400 });
    }

    const deleted = await Note.findOneAndDelete({ _id: noteId, userId }); 

    if (!deleted) {
      return NextResponse.json({ error: "Note not found or not authorized to delete" }, { status: 404 });
    }

    return NextResponse.json({ message: "Note deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Note Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
