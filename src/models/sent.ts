import mongoose, { Document, Schema, model, models } from "mongoose";

export interface ISent extends Document {
  noteId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  sentTo: string;
  sentAt: Date;
  triggerType: string;
}

const sentSchema = new Schema<ISent>(
  {
    noteId: {
      type: Schema.Types.ObjectId,
      ref: "Note",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Profile", // ← FIXED
      required: true,
    },
    sentTo: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      required: true,
    },
    triggerType: {
      type: String,
      enum: ["1day", "3day", "1week", "1month"],
      required: true,
    },
  },
  { timestamps: true }
);

const Sent = models?.Sent || model<ISent>("Sent", sentSchema);
export default Sent;
