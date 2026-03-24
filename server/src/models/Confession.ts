import mongoose, { Document, Schema } from 'mongoose';

export interface IReactions {
  support: string[];
  relate: string[];
  shock: string[];
}

export interface IConfession extends Document {
  content: string;
  tags: string[];
  anonymousId: string;
  reactions: IReactions;
  commentCount: number;
  reportCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ConfessionSchema = new Schema<IConfession>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    tags: {
      type: [String],
      default: [],
      validate: [(val: string[]) => val.length <= 5, 'Max 5 tags'],
    },
    anonymousId: {
      type: String,
      required: true,
      index: true,
    },
    reactions: {
      support: { type: [String], default: [] },
      relate: { type: [String], default: [] },
      shock: { type: [String], default: [] },
    },
    commentCount: { type: Number, default: 0 },
    reportCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index for efficient tag filtering and sorting
ConfessionSchema.index({ createdAt: -1 });
ConfessionSchema.index({ tags: 1 });

const Confession = mongoose.model<IConfession>('Confession', ConfessionSchema);
export default Confession;
