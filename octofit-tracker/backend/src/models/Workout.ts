import mongoose, { Schema } from 'mongoose';

const WorkoutSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    target: { type: String, required: true, trim: true },
    durationMinutes: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Workout ?? mongoose.model('Workout', WorkoutSchema);
