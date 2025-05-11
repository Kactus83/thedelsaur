import 'reflect-metadata';
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: "https://71c19a9dfe6a45c5a8f3dabc043ae535@o4508799823314944.ingest.de.sentry.io/4508799849594960",
  integrations: [],
  environment: "development",
  tracesSampleRate: 1.0,
});

import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { DinosaursModule } from './modules/dinosaurs/dinosaurs.module';
import { GameAssetsModule } from './modules/game-assets/game-assets.module';
import { errorHandlerMiddleware } from './common/middlewares/errorHandler';
import pool from './common/database/db';
import { FakesModule } from './modules/fakes/fakes.module';
import { initDbSchema } from './common/database/init-db';  
import { morganMiddleware } from './common/middlewares/morganMiddleware';

dotenv.config();

process.on('unhandledRejection', (reason) => {
  Sentry.captureException(reason);
});

process.on('uncaughtException', (error) => {
  Sentry.captureException(error);
});

const app: Application = express();
const PORT = process.env.PORT || 3000;

Sentry.setupExpressErrorHandler(app);

app.use(morganMiddleware());
app.use(cors());
app.use(express.json());

// Instanciation des modules
const usersModule = new UsersModule();
const authModule = new AuthModule();
const adminModule = new AdminModule();
const dinosaursModule = new DinosaursModule();
const gameAssetsModule = new GameAssetsModule(dinosaursModule.getDinosaurMiddleware());
const fakesModule = new FakesModule();

// Routes
app.use('/auth', authModule.router);
app.use('/users', usersModule.router);
app.use('/admin', adminModule.router);
app.use('/dinosaurs', dinosaursModule.router);
app.use('/game-assets', gameAssetsModule.router);

// Exemple de route pour tester Sentry
app.get("/debug-sentry", function mainHandler(req, res) {
  const err = new Error("My first Sentry error!");
  Sentry.captureException(err);
  throw err;
});

app.use(errorHandlerMiddleware);

/**
 * Attendre que la base de données soit prête.
 */
async function waitForDatabaseReady(
  maxRetries = 10,
  delayMs = 2000,
  initialDelay = 5000
): Promise<void> {
  let retries = 0;

  // On attend un peu avant de commencer les tentatives
  await new Promise(res => setTimeout(res, initialDelay));
  
  while (retries < maxRetries) {
    try {
      await pool.query('SELECT 1');
      console.log("Database is ready.");
      return;
    } catch (error) {
      console.log(`Database not ready, retrying in ${delayMs} ms... (${retries + 1}/${maxRetries})`);
      await new Promise(res => setTimeout(res, delayMs));
      retries++;
    }
  }
  throw new Error("Database not ready after maximum retries.");
}

// Démarrage du serveur
(async () => {
  try {
    await waitForDatabaseReady();
    await initDbSchema();                       // ← ajouté

    // → Vos seeds métier :
    await authModule.populateDefaultAdmins();
    await gameAssetsModule.seedGameAssets();
    await dinosaursModule.seedDinosaurs();
    await fakesModule.seedFakes();

    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error('❌ Erreur au démarrage:', err);
    process.exit(1);
  }
})();
