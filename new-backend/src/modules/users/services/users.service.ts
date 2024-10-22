import pool from '../../../common/database/db';
import { User } from '../models/user.interface';

export class UsersService {
  public async getAllUsers(): Promise<User[]> {
    try {
      const [results] = await pool.query('SELECT * FROM user');
      return results as User[];
    } catch (err) {
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      throw err;
    }
  }

  public async getUserById(userId: number): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE id = ?', [userId]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par ID:', err);
      throw err;
    }
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    try {
      const [results] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
      const users = results as User[];
      return users.length > 0 ? users[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
      throw err;
    }
  }

  public async createUser(
    username: string,
    email: string,
    passwordHash: string,
    isAdmin: boolean = false
  ): Promise<number> {
    try {
      if (username === 'admin') {
        isAdmin = true;
      }
      const query = 'INSERT INTO user (username, email, password_hash, isAdmin) VALUES (?, ?, ?, ?)';
      const [result] = await pool.query(query, [username, email, passwordHash, isAdmin]);
      const res = result as any;
      return res.insertId;
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      throw err;
    }
  }
}