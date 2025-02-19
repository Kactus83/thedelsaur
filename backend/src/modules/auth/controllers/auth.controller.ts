import { Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SignupDto } from '../models/sign-up.dto';
import { UserDTO } from '../../users/models/user.dto';
import { LoginDto } from '../models/login.dto';
import { AuthService } from '../services/auth.service';

export class AuthController {
  private authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Inscription d'un nouvel utilisateur.
   * Remarque : La création du dinosaure associé est désormais effectuée dans le middleware.
   */
  public signup = async (req: Request, res: Response): Promise<void> => {
    try {
      // Transformer et valider les données d'inscription
      const signupDto: SignupDto = plainToInstance(SignupDto, req.body);
      const errors = await validate(signupDto);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Données invalides', errors });
        return;
      }

      // Créer l'utilisateur via le service d'authentification
      const user = await this.authService.signup(
        signupDto.username,
        signupDto.email,
        signupDto.password
      );

      // Transformer l'utilisateur en DTO pour le frontend
      const userDTO = plainToInstance(UserDTO, user);

      res.status(201).json({ message: 'Utilisateur créé avec succès', user: userDTO });
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      res.status(400).json({ message: error.message });
    }
  };

  /**
   * Connexion de l'utilisateur.
   */
  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const loginDto: LoginDto = plainToInstance(LoginDto, req.body);
      const errors = await validate(loginDto);
      if (errors.length > 0) {
        res.status(400).json({ message: 'Données invalides', errors });
        return;
      }

      const { email, username, password } = loginDto;
      const identifier = email || username;
      if (!identifier) {
        res.status(400).json({ message: 'Veuillez fournir un email ou un pseudo' });
        return;
      }

      const { token, user } = await this.authService.login(identifier, password);
      const userDTO = plainToInstance(UserDTO, user);
      res.status(200).json({ message: 'Connexion réussie', token, user: userDTO });
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      res.status(401).json({ message: error.message });
    }
  };

  /**
   * Vérification du token JWT.
   */
  public verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        res.status(400).json({ message: 'Token manquant' });
        return;
      }
      const user = await this.authService.verifyToken(token);
      const userDTO = plainToInstance(UserDTO, user);
      res.status(200).json({ message: 'Token valide', user: userDTO });
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Token invalide ou expiré' });
    }
  };

  /**
   * Réinitialisation du mot de passe.
   */
  public resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, currentPassword, newPassword } = req.body;
      if (!email || !currentPassword || !newPassword) {
        res.status(400).json({ message: 'Veuillez fournir tous les champs requis' });
        return;
      }
      const resetSuccess = await this.authService.resetPassword(email, currentPassword, newPassword);
      if (resetSuccess) {
        res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
      } else {
        res.status(400).json({ message: 'Échec de la réinitialisation du mot de passe' });
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
}
