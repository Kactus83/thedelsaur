import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service';
import { plainToInstance } from 'class-transformer';
import { UserDTO } from '../../users/models/user.dto';
import { DinosaurDTO } from '../../dinosaurs/models/dinosaur.dto';

export class AdminController {
  private adminService: AdminService;

  constructor(adminService: AdminService) {
    this.adminService = adminService;
  }

  // Récupérer tous les utilisateurs
  public getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.adminService.getAllUsers();
      const usersDTO = users.map(user => plainToInstance(UserDTO, user));
      res.status(200).json(usersDTO);
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
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      const userDTO = plainToInstance(UserDTO, user);
      res.status(200).json(userDTO);
    } catch (error) {
      console.error('Erreur dans getUserByUsername:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Récupérer un utilisateur par email
  public getUserByEmail = async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const user = await this.adminService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      const userDTO = plainToInstance(UserDTO, user);
      res.status(200).json(userDTO);
    } catch (error) {
      console.error('Erreur dans getUserByEmail:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Récupérer un utilisateur par ID
  public getUserById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const user = await this.adminService.getUserById(id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      const userDTO = plainToInstance(UserDTO, user);
      res.status(200).json(userDTO);
    } catch (error) {
      console.error('Erreur dans getUserById:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Supprimer un utilisateur par ID
  public deleteUser = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const result = await this.adminService.deleteUser(id);
      if (!result) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
      res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
      console.error('Erreur dans deleteUser:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Récupérer tous les dinosaures
  public getAllDinosaurs = async (req: Request, res: Response) => {
    try {
      const dinosaurs = await this.adminService.getAllDinosaurs();
      const dinosaursDTO = dinosaurs.map(dino => plainToInstance(DinosaurDTO, dino));
      res.status(200).json(dinosaursDTO);
    } catch (error) {
      console.error('Erreur dans getAllDinosaurs:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Récupérer un dinosaure par ID
  public getDinosaurById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const dinosaur = await this.adminService.getDinosaurById(id);
      if (!dinosaur) {
        return res.status(404).json({ message: 'Dinosaure non trouvé' });
      }
      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json(dinosaurDTO);
    } catch (error) {
      console.error('Erreur dans getDinosaurById:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Créer un dinosaure
  public createDinosaur = async (req: Request, res: Response) => {
    try {
      const { name, userId, diet, energy, food, experience, epoch } = req.body;

      // Validation des champs requis
      if (!name || !userId || !diet) {
        return res.status(400).json({ message: 'Nom, userId et régime alimentaire sont requis' });
      }

      const newDinosaurId = await this.adminService.createDinosaur(name, userId, diet, energy, food, experience, epoch);
      const newDinosaur = await this.adminService.getDinosaurById(newDinosaurId);

      if (!newDinosaur) {
        return res.status(500).json({ message: 'Erreur lors de la création du dinosaure' });
      }

      const dinosaurDTO = plainToInstance(DinosaurDTO, newDinosaur);

      res.status(201).json(dinosaurDTO);
    } catch (error) {
      console.error('Erreur dans createDinosaur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Mettre à jour un dinosaure
  public updateDinosaur = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const updates = req.body;

      const success = await this.adminService.updateDinosaurById(id, updates);
      if (!success) {
        return res.status(404).json({ message: 'Dinosaure non trouvé' });
      }

      const updatedDinosaur = await this.adminService.getDinosaurById(id);
      if (!updatedDinosaur) {
        return res.status(500).json({ message: 'Erreur lors de la récupération du dinosaure mis à jour' });
      }

      const dinosaurDTO = plainToInstance(DinosaurDTO, updatedDinosaur);
      res.status(200).json(dinosaurDTO);
    } catch (error) {
      console.error('Erreur dans updateDinosaur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Supprimer un dinosaure
  public deleteDinosaur = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await this.adminService.deleteDinosaurById(id);
      if (!success) {
        return res.status(404).json({ message: 'Dinosaure non trouvé' });
      }
      res.status(200).json({ message: 'Dinosaure supprimé avec succès' });
    } catch (error) {
      console.error('Erreur dans deleteDinosaur:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
}
