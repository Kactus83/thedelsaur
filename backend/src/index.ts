import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { DinosaursModule } from './modules/dinosaurs/dinosaurs.module';
import * as Sentry from '@sentry/node';

dotenv.config();

Sentry.init({
  dsn: "https://0bbb1c60a514242516015fdab9c2e06f@o4508363323211776.ingest.de.sentry.io/4508363546099792",
  environment: "development",
  tracesSampleRate: 1.0,
});

process.on('unhandledRejection', (reason) => {
  Sentry.captureException(reason);
});

process.on('uncaughtException', (error) => {
  Sentry.captureException(error);
});



const app: Application = express();
const PORT = process.env.PORT || 3000;

// The error handler must be registered before any other error middleware and after all controllers
Sentry.setupExpressErrorHandler(app);
// Middleware
app.use(cors());
app.use(express.json());

// Modules
const usersModule = new UsersModule();
const authModule = new AuthModule();
const adminModule = new AdminModule();
const dinosaursModule = new DinosaursModule();

// Routes
app.use('/auth', authModule.router);
app.use('/users', usersModule.router);
app.use('/admin', adminModule.router);
app.use('/dinosaurs', dinosaursModule.router);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});


// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});

