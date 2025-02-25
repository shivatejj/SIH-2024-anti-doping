import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  name: string;
  email: string;
  loginTime: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    loginTime: { type: Date, default: Date.now() },
  }
);

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);