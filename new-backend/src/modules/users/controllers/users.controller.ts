import { Response } from 'express';
import { UsersService } from '../services/users.service';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../models/user.dto';

export class UsersController {
  private usersService: UsersService;

  constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  public getMyProfile = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ message: 'Utilisateur non authentifié' });
      }

      const user = await this.usersService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Transformer l'utilisateur en DTO
      const userDTO = plainToInstance(UserDTO, user);

      res.status(200).json(userDTO);
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
}