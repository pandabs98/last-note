import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/db";
import Profile from "@/models/user";

export async function GET(req: NextRequest) {
  await dbConnect();
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await Profile.findOne({ clerkUserId });

  return NextResponse.json({
    recipients: profile?.recipients || [],
    inactivityTriggers: profile?.inactivityTriggers || {
      "1day": false,
      "3day": false,
      "1week": false,
      "1month": false,
    },
    hasPassword: !!profile?.secureDeletePassword,
  });
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { recipients, inactivityTriggers } = await req.json();

  const updatedProfile = await Profile.findOneAndUpdate(
    { clerkUserId },
    {
      recipients,
      inactivityTriggers,
      lastActiveAt: new Date(), // optional: useful if you want to track login activity
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, profile: updatedProfile });
}

export async function PUT(req: NextRequest) {
  await dbConnect();
  const { userId: clerkUserId } = await auth();

  if (!clerkUserId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { password } = await req.json();

  if (!password || password.length < 4) {
    return NextResponse.json(
      { error: "Password must be at least 4 characters" },
      { status: 400 }
    );
  }

  const updated = await Profile.findOneAndUpdate(
    { clerkUserId },
    { secureDeletePassword: password },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, profile: updated });
}
