import cron from "node-cron";
import sendMail from "@/lib/mail";
import { getUsersWithNotesAndRecipients } from "@/lib/db/getUsersWithActiveNotes";
import Note from "@/models/note";

const triggerMap: Record<string, number> = {
  "1day": 1,
  "3day": 3,
  "1week": 7,
  "1month": 30,
};

export function startInactivityWatcher() {
  // Run at 2 AM every day
  cron.schedule("0 2 * * *", async () => {
    if (process.env.NODE_ENV !== "production") return;

    console.log("🕑 Running inactivity watcher...");

    const users = await getUsersWithNotesAndRecipients();
    const now = new Date();

    for (const user of users) {
      const lastActiveAt = new Date(user.lastActiveAt);
      const daysInactive = Math.floor(
        (now.getTime() - lastActiveAt.getTime()) / (1000 * 60 * 60 * 24)
      );

      const matchedTriggers = Object.entries(user.inactivityTriggers || {})
        .filter(([key, enabled]) => enabled && daysInactive >= triggerMap[key])
        .map(([key]) => key);

      if (matchedTriggers.length === 0) continue;

      const notes = await Note.find({
        userId: user._id,
        status: "active",
        isDeleted: false,
      }).lean();

      if (!notes.length) continue;

      const noteContent = notes
        .map((note) => `📝 ${note.title}\n${note.content}`)
        .join("\n\n-----------------------------\n\n");

      for (const recipient of user.recipients || []) {
        if (!recipient.email) continue;

        await sendMail({
          to: recipient.email,
          subject: `Last notes from ${user.name || "a loved one"}`,
          text: `Hi ${recipient.name},\n\n${user.name || "A loved one"} has shared their saved notes with you due to prolonged inactivity.\n\n${noteContent}\n\n— LastNote Memory Keeper`,
        });

        console.log(`✅ Email sent to ${recipient.email} for user ${user._id}`);
      }
    }

    console.log("✅ Inactivity watcher completed.");
  });
}
