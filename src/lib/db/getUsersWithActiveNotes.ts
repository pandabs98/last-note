import Profile from "@/models/user";

export async function getUsersWithNotesAndRecipients() {
  return await Profile.find({
    $or: [
      { "inactivityTriggers.1day": true },
      { "inactivityTriggers.3day": true },
      { "inactivityTriggers.1week": true },
      { "inactivityTriggers.1month": true },
    ],
  })
    .populate("recipients") // ensure recipient details (like email/name) are available
    .lean(); // better performance
}
