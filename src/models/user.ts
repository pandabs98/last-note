import mongoose, { Schema, model, models, Document } from "mongoose";
// import bcrypt from "bcryptjs";

interface Recipient {
  name: string;
  email: string;
  phoneNo: string;
  relation: string;
}

export interface IUser extends Document {
  clerkUserId: string;
  secureDeletePassword: string;
  recipients: Recipient[];
  inactivityTriggers: {
    "1day": boolean;
    "3day": boolean;
    "1week": boolean;
    "1month": boolean;
  };
  lastActiveAt: Date;
}

const userProfileSchema = new Schema<IUser>(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    secureDeletePassword: {
      type: String,
      required: false,
    },
    recipients: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNo: { type: String },
        relation: { type: String },
      },
    ],
    inactivityTriggers: {
      "1day": { type: Boolean, default: false },
      "3day": { type: Boolean, default: false },
      "1week": { type: Boolean, default: false },
      "1month": { type: Boolean, default: false },
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
// userProfileSchema.pre<IUser>("save", async function (next) {
//   if (this.isModified("secureDeletePassword")) {
//     const salt = await bcrypt.genSalt(10);
//     this.secureDeletePassword = await bcrypt.hash(this.secureDeletePassword, salt);
//   }
//   next();
// });

const Profile = models?.Profile || model<IUser>("Profile", userProfileSchema);
export default Profile;
