import mongoose, { Schema, Document } from "mongoose";

export interface IActivity extends Document {
  name: string;
  email: string;
  loginTime: Date;
}

const getISTTime = () => {
  const now = new Date();
  return new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Convert to IST (UTC + 5:30)
};

const ActivitySchema = new Schema<IActivity>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    loginTime: { type: Date, default: getISTTime },
  }
);

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);