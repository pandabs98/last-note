import mongoose, { Document, Schema, model, models } from "mongoose";

export interface INote extends Document {
  userId: string;  
  title: string;
  content: string;
  status: "active" | "draft" | "sent";
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const noteSchema = new Schema<INote>(
  {
    userId: {
      type: String,
      // ref: "Profile",  // Should match your Profile model name
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "draft", "sent"],
      default: "active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Note = models.Note || model<INote>("Note", noteSchema);
export default Note;
