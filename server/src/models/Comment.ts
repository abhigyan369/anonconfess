import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  confessionId: mongoose.Types.ObjectId;
  content: string;
  anonymousId: string;
  parentId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    confessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Confession',
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 500,
    },
    anonymousId: {
      type: String,
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
      default: null,
    },
  },
  { timestamps: true }
);

CommentSchema.index({ confessionId: 1, createdAt: 1 });

const Comment = mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
