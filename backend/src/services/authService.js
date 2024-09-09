const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Charger les variables d'environnement pour JWT secret
require('dotenv').config();

// Fonction pour le hashage du mot de passe
exports.hashPassword = async (password) => {
  try {
    // Générer un hash sécurisé avec bcrypt et un salt de 10 tours
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error('Erreur lors du hashage du mot de passe:', error);
    throw new Error('Erreur interne du serveur');
  }
};

// Fonction pour vérifier si le mot de passe est correct
exports.checkPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    throw new Error('Erreur interne du serveur');
  }
};

// Fonction pour générer un token JWT
exports.generateToken = (user) => {
  try {
    // Vérifier si la clé secrète JWT est définie dans les variables d'environnement
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET est manquant dans les variables d\'environnement');
    }

    // Générer un token JWT avec l'ID et l'email de l'utilisateur, valable pendant 1 heure
    return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (error) {
    console.error('Erreur lors de la génération du token JWT:', error);
    throw new Error('Erreur interne du serveur');
  }
};

// Service pour enregistrer un nouvel utilisateur
exports.signup = async (username, email, password) => {
  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      throw new Error('Email déjà utilisé');
    }

    // Hasher le mot de passe
    const passwordHash = await this.hashPassword(password);

    // Créer un nouvel utilisateur dans la base de données
    const userId = await userModel.createUser(username, email, passwordHash);
    
    // Retourner les informations de l'utilisateur créé
    return { id: userId, username, email };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

// Service pour connecter un utilisateur
exports.login = async (email, password) => {
  try {
    // Vérifier si l'utilisateur existe
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier si le mot de passe est correct
    const passwordValid = await this.checkPassword(password, user.password_hash);
    if (!passwordValid) {
      throw new Error('Identifiants invalides');
    }

    // Générer un token JWT pour l'utilisateur connecté
    const token = this.generateToken(user);
    
    // Retourner le token et les informations de l'utilisateur
    return { token, user };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};
