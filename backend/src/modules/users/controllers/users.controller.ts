import { Response, Request } from 'express';
import { UsersService } from '../services/users.service';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../models/user.dto';
import { ChangeUsernameRequestBody } from '../../auth/models/change-username.dto';
import { PlayerScoreDTO } from '../models/player-score.dto';

export class UsersController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  public getMyProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      const user = await this.usersService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }

      // Transformer l'utilisateur en DTO
      const userDTO = plainToInstance(UserDTO, user);

      res.status(200).json(userDTO);
      return;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  // Méthode pour changer le nom d'utilisateur
  public changeUsername = async (
    req: AuthenticatedRequest & Request<{}, {}, ChangeUsernameRequestBody>,
    res: Response
  ) => {
    try {
      const userId = req.user?.id;
      const newUsername = req.body.username;

      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      if (!newUsername || typeof newUsername !== 'string' || newUsername.trim().length === 0) {
        res.status(400).json({ message: 'Nom d\'utilisateur invalide' });
        return;
      }

      // Vérifie l'unicité du nom d'utilisateur
      const isUsernameTaken = await this.usersService.isUsernameTaken(newUsername.trim());
      if (isUsernameTaken) {
        res.status(409).json({ message: 'Nom d\'utilisateur déjà utilisé' });
        return;
      }

      const updated = await this.usersService.updateUsername(userId, newUsername.trim());
      if (!updated) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }

      res.status(200).json({ message: 'Nom d\'utilisateur mis à jour avec succès', newUsername });
    } catch (error) {
      console.error('Erreur lors du changement de nom d\'utilisateur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  /**
   * Récupère la liste de tous les utilisateurs, avec leur score,
   * pour l'affichage d'un classement.
   */
public getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await this.usersService.getAllUsers();

    // Conversion en UserDTO (Validation des données)
    const userDTOs = plainToInstance(UserDTO, users);

    // Tri par totalSoulPoints
    userDTOs.sort((a, b) => {
      const scoreA = a.player_score;
      const scoreB = b.player_score;
      return (scoreB.totalSoulPoints || 0) - (scoreA.totalSoulPoints || 0);
    });

    // 4) On renvoie le tableau de DTO
    res.status(200).json(userDTOs);
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les utilisateurs:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
}