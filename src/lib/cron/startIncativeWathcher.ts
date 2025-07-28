// lib/cron/startInactivityWatcher.ts
import cron from "node-cron";
import sendMail from "@/lib/mail";
import { getUsersWithNotesAndRecipients } from "@/lib/db/getUsersWithActiveNotes";
import Note from "@/models/Note";

const triggerMap: Record<string, number> = {
  "1day": 1,
  "3day": 3,
  "1week": 7,
  "1month": 30,
};

export function startInactivityWatcher() {
  // Schedule at 2 AM daily
  cron.schedule("0 2 * * *", async () => {
    const users = await getUsersWithNotesAndRecipients();
    const now = new Date();

    for (const user of users) {
      const lastActiveAt = new Date(user.lastActiveAt);
      const daysInactive = Math.floor((now.getTime() - lastActiveAt.getTime()) / (1000 * 60 * 60 * 24));

      const matchedTriggers = Object.entries(user.inactivityTriggers)
        .filter(([key, val]) => val && daysInactive >= triggerMap[key])
        .map(([key]) => key);

      if (matchedTriggers.length === 0) continue;

      const notes = await Note.find({ userId: user._id, status: "active", isDeleted: false });

      for (const recipient of user.recipients) {
        const content = notes
          .map((note) => `📝 ${note.title}\n${note.content}\n`)
          .join("\n------------------\n");

        if (!content) continue;

        await sendMail({
          to: recipient.email,
          subject: `Notes from ${user.clerkUserId}`,
          text: `Hi ${recipient.name},\n\n${user.clerkUserId} has shared the following notes with you due to inactivity:\n\n${content}`,
        });

        console.log(`✅ Mail sent to ${recipient.email} for user ${user.clerkUserId}`);
      }
    }
  });
}
