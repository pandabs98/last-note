// lib/db/getUsersWithActiveNotes.ts
import Profile from "@/models/Profile";
import Note from "@/models/Note";

export async function getUsersWithNotesAndRecipients() {
  // Get all users who have inactivity triggers enabled
  return await Profile.find({
    $or: [
      { "inactivityTriggers.1day": true },
      { "inactivityTriggers.3day": true },
      { "inactivityTriggers.1week": true },
      { "inactivityTriggers.1month": true },
    ],
  });
}
