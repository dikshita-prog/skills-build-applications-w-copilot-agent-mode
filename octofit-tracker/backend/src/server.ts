import './config/database.js';
import express, { type ErrorRequestHandler, type RequestHandler } from 'express';
import type { Model } from 'mongoose';
import Activity from './models/Activity.js';
import Leaderboard from './models/Leaderboard.js';
import Team from './models/Team.js';
import User from './models/User.js';
import Workout from './models/Workout.js';

const app = express();
const port = Number(process.env.PORT ?? 8000);
const codespaceName = process.env.CODESPACE_NAME;
export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    response.sendStatus(204);
    return;
  }

  next();
});
app.use(express.json());

function collectionHandler<T>(model: Model<T>): RequestHandler {
  return async (_request, response, next) => {
    try {
      response.json(await model.find().lean().exec());
    } catch (error) {
      next(error);
    }
  };
}

app.get('/api/users/', collectionHandler(User));
app.get('/api/teams/', collectionHandler(Team));
app.get('/api/activities/', collectionHandler(Activity));
app.get('/api/leaderboard/', collectionHandler(Leaderboard));
app.get('/api/workouts/', collectionHandler(Workout));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  console.error('API request failed:', error);
  response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

app.listen(port, '0.0.0.0', () => {
  console.log(`OctoFit API listening at ${baseUrl}`);
});