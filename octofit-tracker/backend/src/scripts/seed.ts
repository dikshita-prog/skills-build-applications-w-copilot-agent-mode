import mongoose from 'mongoose';
import Activity from '../models/Activity.js';
import Leaderboard from '../models/Leaderboard.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import Workout from '../models/Workout.js';
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      User.deleteMany({}),
      Team.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const teams = await Team.insertMany([
      { name: 'Octocats', description: 'Consistent movement, one workout at a time.' },
      { name: 'Code Crushers', description: 'Building strength together.' },
    ]);

    const users = await User.insertMany([
      {
        username: 'monalisa',
        name: 'Mona Lisa',
        email: 'mona@example.com',
        team: teams[0]._id,
        points: 240,
      },
      {
        username: 'octoathlete',
        name: 'Octo Athlete',
        email: 'athlete@example.com',
        team: teams[0]._id,
        points: 195,
      },
      {
        username: 'fitcoder',
        name: 'Fit Coder',
        email: 'coder@example.com',
        team: teams[1]._id,
        points: 210,
      },
    ]);

    await Promise.all([
      Team.updateOne(
        { _id: teams[0]._id },
        { $set: { members: [users[0]._id, users[1]._id], points: 435 } },
      ),
      Team.updateOne(
        { _id: teams[1]._id },
        { $set: { members: [users[2]._id], points: 210 } },
      ),
    ]);

    await Activity.insertMany([
      { user: users[0]._id, type: 'Running', durationMinutes: 35, calories: 310 },
      { user: users[0]._id, type: 'Strength training', durationMinutes: 40, calories: 260 },
      { user: users[1]._id, type: 'Cycling', durationMinutes: 45, calories: 380 },
      { user: users[2]._id, type: 'Yoga', durationMinutes: 30, calories: 140 },
    ]);

    await Leaderboard.insertMany([
      { user: users[0]._id, team: teams[0]._id, points: 240, rank: 1 },
      { user: users[2]._id, team: teams[1]._id, points: 210, rank: 2 },
      { user: users[1]._id, team: teams[0]._id, points: 195, rank: 3 },
    ]);

    await Workout.insertMany([
      {
        title: 'Easy Start Run',
        description: 'A comfortable run to build aerobic endurance.',
        target: 'Cardio',
        durationMinutes: 25,
        difficulty: 'beginner',
      },
      {
        title: 'Full-body Strength',
        description: 'A balanced circuit of bodyweight strength exercises.',
        target: 'Strength',
        durationMinutes: 35,
        difficulty: 'intermediate',
      },
      {
        title: 'Recovery Flow',
        description: 'A gentle mobility and stretching session.',
        target: 'Flexibility',
        durationMinutes: 20,
        difficulty: 'beginner',
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
