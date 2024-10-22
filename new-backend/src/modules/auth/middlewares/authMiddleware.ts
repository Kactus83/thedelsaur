import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UsersService } from '../../modules/users/services/users.service';
import { User } from '../../users/models/user.interface';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateJWT = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7, authHeader.length);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

      const usersService = new UsersService();
      const user = await usersService.getUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      req.user = user;
      console.log('Utilisateur authentifié:', user);

      next();
    } catch (err) {
      console.error('Erreur lors de la vérification du token ou de la récupération de l\'utilisateur:', err);
      return res.status(401).json({ message: 'Token invalide ou utilisateur non trouvé' });
    }
  } else {
    res.status(401).json({ message: 'Token manquant' });
  }
};