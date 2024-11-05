import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import pool from '../../../common/database/db';
import { User } from '../../users/models/user.interface';
import { Dinosaur } from '../../dinosaurs/models/dinosaur.interface';
import { BASE_ENERGY, BASE_FOOD, BASE_FOOD_MULTIPLIER_FOR_DIETS, BASE_MAX_HUNGER, MAX_ENERGY, MAX_FOOD } from '../../../common/config/constants';
import { generateRandomName, getRandomDiet, getRandomType } from '../utils/dinosaurs.util';

dotenv.config();

export class AuthService {

  // Méthodes pour interagir avec la base de données directement

  // Créer un nouvel utilisateur
  private async createUser(username: string, email: string, passwordHash: string, isAdmin: boolean = true): Promise<number> {
    try {
      const query = 'INSERT INTO user (username, email, password_hash, isAdmin) VALUES (?, ?, ?, ?)';
      const [result] = await pool.query(query, [username, email, passwordHash, isAdmin]);
      const res = result as any;
      return res.insertId;
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      throw err;
    }
  }

  // Trouver un utilisateur par ID
  private async findUserById(userId: number): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE id = ?', [userId]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par ID:', err);
      throw err;
    }
  }

  // Trouver un utilisateur par email
  private async findUserByEmail(email: string): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
      throw err;
    }
  }

  // Créer un dinosaure
  private async createDinosaur(
    name: string,
    userId: number,
    diet: string,
    type: string,
    energy: number = BASE_ENERGY,
    max_energy: number = MAX_ENERGY,
    food: number = BASE_FOOD,
    max_food: number = MAX_FOOD,
    hunger: number = 0,
    max_hunger: number = BASE_MAX_HUNGER,
    experience: number = 0,
    epoch: string = 'past',
    reborn_amount: number = 0,
    karma: number = 0
  ): Promise<number> {
    try {
      const dinosaurQuery = `INSERT INTO dinosaur (name, user_id, diet, type, energy, max_energy, food, max_food, hunger, max_hunger, experience, epoch, reborn_amount, karma)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [dinosaurResult] = await pool.query(dinosaurQuery, [name, userId, diet, type, energy, max_energy, food, max_food, hunger, max_hunger, experience, epoch, reborn_amount, karma]);
      const dinosaurId = (dinosaurResult as any).insertId;

      // Définir les multiplicateurs en fonction du régime alimentaire
      let earn_herbi_food_multiplier = 1;
      let earn_carni_food_multiplier = 1;

      if (diet === 'herbivore') {
        earn_herbi_food_multiplier = BASE_FOOD_MULTIPLIER_FOR_DIETS;
      } else if (diet === 'carnivore') {
        earn_carni_food_multiplier = BASE_FOOD_MULTIPLIER_FOR_DIETS;
      }

      // Initialisation des multiplicateurs pour le dinosaure créé avec les valeurs appropriées
      const multiplierQuery = `INSERT INTO dinosaur_multiplier (dinosaur_id, earn_herbi_food_multiplier, earn_carni_food_multiplier, earn_food_multiplier, earn_energy_multiplier, earn_experience_multiplier, max_energy_multiplier, max_food_multiplier)
                               VALUES (?, ?, ?, 1, 1, 1, 1, 1)`;
      await pool.query(multiplierQuery, [dinosaurId, earn_herbi_food_multiplier, earn_carni_food_multiplier]);


      return dinosaurId;
    } catch (err) {
      console.error('Erreur lors de la création du dinosaure:', err);
      throw err;
    }
  }

  // Trouver un dinosaure par ID
  private async findDinosaurById(dinosaurId: number): Promise<Dinosaur | null> {
    try {
      const [results] = await pool.query('SELECT * FROM dinosaur WHERE id = ?', [dinosaurId]);
      const dinosaurs = results as Dinosaur[];
      return dinosaurs.length > 0 ? dinosaurs[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération du dinosaure par ID:', err);
      throw err;
    }
  }

  // Hashage du mot de passe
  private async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, 10);
    } catch (error) {
      console.error('Erreur lors du hashage du mot de passe:', error);
      throw new Error('Erreur interne du serveur');
    }
  }

  // Vérification du mot de passe
  private async checkPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (error) {
      console.error('Erreur lors de la vérification du mot de passe:', error);
      throw new Error('Erreur interne du serveur');
    }
  }

  // Génération du token JWT
  private generateToken(user: User): string {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET est manquant dans les variables d\'environnement');
      }

      return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
    } catch (error) {
      console.error('Erreur lors de la génération du token JWT:', error);
      throw new Error('Erreur interne du serveur');
    }
  }

  // Vérification du token JWT
  public async verifyToken(token: string): Promise<User> {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET est manquant dans les variables d\'environnement');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };

      const user = await this.findUserById(decoded.id);

      if (!user) {
        throw new Error('Utilisateur non trouvé ou supprimé');
      }

      return user;
    } catch (error) {
      console.error('Erreur lors de la vérification du token JWT:', error);
      throw new Error('Token invalide, expiré ou utilisateur non trouvé');
    }
  }

  // Inscription d'un nouvel utilisateur
  public async signup(username: string, email: string, password: string): Promise<{ user: User; dinosaur: Dinosaur }> {
    try {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await this.findUserByEmail(email);
      if (existingUser) {
        throw new Error('Email déjà utilisé');
      }

      // Hasher le mot de passe
      const passwordHash = await this.hashPassword(password);

      // Créer un nouvel utilisateur
      const userId = await this.createUser(username, email, passwordHash);
      const newUser = await this.findUserById(userId);

      if (!newUser) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      // Générer un nom et un régime alimentaire aléatoires pour le dinosaure
      const randomName = generateRandomName();
      const randomDiet = getRandomDiet();
      const randomType = getRandomType();

      // Créer le dinosaure associé à l'utilisateur
      const dinosaurId = await this.createDinosaur(randomName, userId, randomDiet, randomType);
      const newDinosaur = await this.findDinosaurById(dinosaurId);

      if (!newDinosaur) {
        throw new Error('Erreur lors de la création du dinosaure');
      }

      return { user: newUser, dinosaur: newDinosaur };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  // Connexion de l'utilisateur
  public async login(identifier: string, password: string): Promise<{ token: string; user: User }> {
    try {
      // Recherche l'utilisateur par email ou pseudo
      const user = identifier.includes('@')
        ? await this.findUserByEmail(identifier)
        : await this.findUserByUsername(identifier);
  
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
  
      const passwordValid = await this.checkPassword(password, user.password_hash);
      if (!passwordValid) {
        throw new Error('Identifiants invalides');
      }
  
      const token = this.generateToken(user);
  
      return { token, user };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }
  
  // Ajout de la méthode pour trouver un utilisateur par pseudo
  private async findUserByUsername(username: string): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE username = ?', [username]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par username:', err);
      throw err;
    }
  }

  // Méthode pour réinitialiser le mot de passe
  public async resetPassword(email: string, currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifie si l'ancien mot de passe est correct
      const isCurrentPasswordValid = await this.checkPassword(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        throw new Error('Mot de passe actuel incorrect');
      }

      // Hash le nouveau mot de passe
      const newPasswordHash = await this.hashPassword(newPassword);

      // Met à jour le mot de passe de l'utilisateur
      const [result] = await pool.query('UPDATE user SET password_hash = ? WHERE id = ?', [newPasswordHash, user.id]);
      const res = result as any;

      return res.affectedRows > 0;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      throw error;
    }
  }
}
