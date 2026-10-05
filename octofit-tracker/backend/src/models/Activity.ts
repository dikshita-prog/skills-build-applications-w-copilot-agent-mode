import mongoose, { Schema } from 'mongoose';

const ActivitySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    calories: { type: Number, min: 0 },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

export default mongoose.models.Activity ?? mongoose.model('Activity', ActivitySchema);
