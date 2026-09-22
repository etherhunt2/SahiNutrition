import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  blogId: string;
  name: string;
  email: string;
  content: string;
  ipAddress?: string;
  os?: string;
  screenSize?: string;
  location?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
}

const CommentSchema: Schema = new Schema(
  {
    blogId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    content: { type: String, required: true },
    ipAddress: { type: String },
    os: { type: String },
    screenSize: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  { timestamps: true }
);

export const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
