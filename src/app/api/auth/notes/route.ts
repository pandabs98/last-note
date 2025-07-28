import dbConnect from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import Note from "@/models/note";

// POST: Create a new note
export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, status } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 } 
      );
    }

    const saveNote = await Note.create({
      userId, 
      title,
      content,
      status, 
    });

    return NextResponse.json(
      { message: "Note created successfully", note: saveNote },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /notes error:", error);
    return NextResponse.json(
      { error: "Internal server error. Try again later." },
      { status: 500 }
    );
  }
}

// GET: Fetch notes of the logged-in user
export async function GET() {
  await dbConnect();

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized user" }, { status: 401 });
    }

    const data = await Note.find({ userId });

    return NextResponse.json(
      { message: "Notes fetched successfully", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}