import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  confessionId: mongoose.Types.ObjectId;
  reason: string;
  anonymousId: string;
  resolved: boolean;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    confessionId: {
      type: Schema.Types.ObjectId,
      ref: 'Confession',
      required: true,
      index: true,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    anonymousId: {
      type: String,
      required: true,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Report = mongoose.model<IReport>('Report', ReportSchema);
export default Report;
