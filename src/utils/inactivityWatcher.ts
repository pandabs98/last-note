import cron from "node-cron";
import { getUsersWithNotes } from "@/lib/db"; // New DB function to fetch users + their notes
import sendMail from "@/lib/mail"; // Nodemailer function

const inactivityDurations: Record<string, number> = {
  "1d": 1,
  "3d": 3,
  "7d": 7,
  "30d": 30,
};

export function startInactivityWatcher() {
  // Runs every day at 2am
  cron.schedule("0 2 * * *", async () => {
    const users = await getUsersWithNotes(); // Fetch users along with notes
    const now = new Date();

    for (const user of users) {
      const daysInactive = Math.floor(
        (now.getTime() - new Date(user.lastLoginAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      const preferenceKey = user.inactivityPreference || "7d";
      const threshold = inactivityDurations[preferenceKey];

      if (daysInactive >= threshold) {
        for (const note of user.notes) {
          if (note.recipientEmail) {
            await sendMail({
              to: note.recipientEmail,
              subject: `A message from ${user.name}`,
              text: note.message || "This is a scheduled message.",
            });

            console.log(
              `Sent note "${note.title}" to ${note.recipientEmail} from inactive user ${user.email}`
            );
          }
        }
      }
    }
  });
}
