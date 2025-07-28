import nodemailer from "nodemailer";
import type { SentMessageInfo } from "nodemailer";

interface MailOptions {
  to: string;
  subject: string;
  text: string;
}

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER!,
    pass: process.env.ETHEREAL_PASS!,
  },
});

export default async function sendMail({
  to,
  subject,
  text,
}: MailOptions): Promise<SentMessageInfo> {
  const info = await transporter.sendMail({
    from: '"Your App" <no-reply@finalnote.com>',
    to,
    subject,
    text,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return info;
}
