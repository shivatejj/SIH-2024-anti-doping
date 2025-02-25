import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  name: string;
  email: string;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);