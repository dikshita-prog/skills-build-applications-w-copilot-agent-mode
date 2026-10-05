import mongoose, { Schema } from 'mongoose';

const LeaderboardSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team' },
    points: { type: Number, default: 0, min: 0 },
    rank: { type: Number, min: 1 },
  },
  { timestamps: true },
);

export default mongoose.models.Leaderboard ?? mongoose.model('Leaderboard', LeaderboardSchema);
