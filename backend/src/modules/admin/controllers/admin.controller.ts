import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../../users/models/user.dto';
import { DinosaurDTO } from '../../dinosaurs/models/frontend-dinosaur.dto';
import { getExperienceThresholdForLevel } from '../../dinosaurs/utils/dinosaur-actions.util';

export class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  public getLevelsXpTable = async (req: Request, res: Response) => {
    try {
      const levelsXp = [];
      for (let level = 1; level <= 100; level++) {
        const xpRequired = getExperienceThresholdForLevel(level);
        levelsXp.push({ level, xpRequired });
      }
      res.status(200).json(levelsXp);
    } catch (error) {
      console.error('Erreur dans getLevelsXpTable:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Récupérer tous les utilisateurs
  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.adminService.getAllUsers();
      const usersDTO = users.map(user => plainToInstance(UserDTO, user));
      res.status(200).json(usersDTO);
      return;
    } catch (error) {
      console.error('Erreur dans getAllUsers:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Récupérer un utilisateur par username
  public getUserByUsername = async (req: Request, res: Response) => {
    try {
      const { username } = req.params;
      const user = await this.adminService.getUserByUsername(username);
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }
      const userDTO = plainToInstance(UserDTO, user);
      res.status(200).json(userDTO);
      return;
    } catch (error) {
      console.error('Erreur dans getUserByUsername:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  // Récupérer un utilisateur par email
  public getUserByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const user = await this.adminService.getUserByEmail(email);
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }
      const userDTO = plainToInstance(UserDTO, user);
      res.status(200).json(userDTO);
      return;
    } catch (error) {
      console.error('Erreur dans getUserByEmail:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  // Récupérer un utilisateur par ID
  public getUserById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = await this.adminService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }
      const userDTO = plainToInstance(UserDTO, user);
      res.status(200).json(userDTO);
      return;
    } catch (error) {
      console.error('Erreur dans getUserById:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  // Supprimer un utilisateur par ID
  public deleteUser = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await this.adminService.deleteUser(id);
      if (!result) {
        res.status(404).json({ message: 'Utilisateur non trouvé' });
        return;
      }
      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
      return;
    } catch (error) {
      console.error('Erreur dans deleteUser:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  // Récupérer tous les dinosaures
  public getAllDinosaurs = async (req: Request, res: Response) => {
    try {
      const dinosaurs = await this.adminService.getAllDinosaurs();
      const dinosaursDTO = dinosaurs.map(dino => plainToInstance(DinosaurDTO, dino));
      res.status(200).json(dinosaursDTO);
      return;
    } catch (error) {
      console.error('Erreur dans getAllDinosaurs:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  // Récupérer un dinosaure par ID
  public getDinosaurById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dinosaur = await this.adminService.getDinosaurById(id);
      if (!dinosaur) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
      }
      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json(dinosaurDTO);
      return;
    } catch (error) {
      console.error('Erreur dans getDinosaurById:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  // Créer un dinosaure
  public createDinosaur = async (req: Request, res: Response) => {
    try {
      const { name, userId, diet, energy, food, experience, epoch } = req.body;

      // Validation des champs requis
      if (!name || !userId || !diet) {
        res.status(400).json({ message: 'Nom, userId et régime alimentaire sont requis' });
        return;
      }

      const newDinosaurId = await this.adminService.createDinosaur(name, userId, diet, energy, food, experience, epoch);
      const newDinosaur = await this.adminService.getDinosaurById(newDinosaurId);

      if (!newDinosaur) {
        res.status(500).json({ message: 'Erreur lors de la création du dinosaure' });
        return;
      }

      const dinosaurDTO = plainToInstance(DinosaurDTO, newDinosaur);

      res.status(201).json(dinosaurDTO);
      return;
    } catch (error) {
      console.error('Erreur dans createDinosaur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  // Mettre à jour un dinosaure
  public updateDinosaur = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const updates = req.body;

      const success = await this.adminService.updateDinosaurById(id, updates);
      if (!success) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
      }

      const updatedDinosaur = await this.adminService.getDinosaurById(id);
      if (!updatedDinosaur) {
        res.status(500).json({ message: 'Erreur lors de la récupération du dinosaure mis à jour' });
        return;
      }

      const dinosaurDTO = plainToInstance(DinosaurDTO, updatedDinosaur);
      res.status(200).json(dinosaurDTO);
      return;
    } catch (error) {
      console.error('Erreur dans updateDinosaur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  // Supprimer un dinosaure
  public deleteDinosaur = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await this.adminService.deleteDinosaurById(id);
      if (!success) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
      }
      res.status(200).json({ message: 'Dinosaure supprimé avec succès' });
      return;
    } catch (error) {
      console.error('Erreur dans deleteDinosaur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };
}
