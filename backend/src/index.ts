import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { DinosaursModule } from './modules/dinosaurs/dinosaurs.module';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

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

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});