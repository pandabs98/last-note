// lib/mail.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

export default async function sendMail({ to, subject, text }: MailOptions): Promise<void> {
  const info = await transporter.sendMail({
    from: '"Your App" <no-reply@yourapp.com>',
    to,
    subject,
    text,
  });

  console.log("📬 Message sent: %s", info.messageId);
  console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
}
