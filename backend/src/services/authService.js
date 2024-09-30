const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const dinosaurModel = require('../models/dinosaurModel');
const { generateRandomName, getRandomDiet } = require('../utils/dinosaurUtils');

// Charger les variables d'environnement pour JWT secret
require('dotenv').config();

/**
 * Crée un nouveau dinosaure avec des valeurs par défaut.
 * @param {string} name - Nom du dinosaure.
 * @param {number} userId - ID de l'utilisateur propriétaire.
 * @param {string} diet - Régime alimentaire.
 * @param {number} [energy=10000] - Énergie initiale.
 * @param {number} [food=10000] - Nourriture initiale.
 * @param {number} [experience=0] - Expérience initiale.
 * @param {string} [epoch='past'] - Époque du dinosaure.
 * @returns {Promise<number>} ID du dinosaure créé.
 */
const createDinosaur = async (name, userId, diet, energy = 10000, food = 10000, experience = 0, epoch = 'past') => {
  // Crée le dinosaure dans la base de données en incluant `last_update_by_time_service`
  return await dinosaurModel.createDinosaur(name, userId, diet, energy, food, experience, epoch);
};

/**
 * Hashage du mot de passe.
 * @param {string} password - Le mot de passe en clair.
 * @returns {Promise<string>} Le mot de passe hashé.
 */
const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error('Erreur lors du hashage du mot de passe:', error);
    throw new Error('Erreur interne du serveur');
  }
};

/**
 * Vérifie si le mot de passe correspond au hash.
 * @param {string} password - Le mot de passe en clair.
 * @param {string} hash - Le hash du mot de passe.
 * @returns {Promise<boolean>} Vrai si correspond, sinon faux.
 */
const checkPassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Erreur lors de la vérification du mot de passe:', error);
    throw new Error('Erreur interne du serveur');
  }
};

/**
 * Génère un token JWT.
 * @param {Object} user - L'utilisateur.
 * @returns {string} Le token JWT.
 */
const generateToken = (user) => {
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
};

/**
 * Inscrit un nouvel utilisateur et crée un dinosaure associé.
 * @param {string} username - Nom d'utilisateur.
 * @param {string} email - Email de l'utilisateur.
 * @param {string} password - Mot de passe en clair.
 * @returns {Promise<Object>} L'utilisateur créé et son dinosaure.
 */
const signup = async (username, email, password) => {
  try {
    console.log('Début de la fonction signup');

    // Vérifier si l'utilisateur existe déjà
    console.log('Vérification de l\'existence de l\'utilisateur avec l\'email:', email);
    const existingUser = await userModel.findByEmail(email);
    if (existingUser) {
      console.log('Utilisateur déjà existant avec l\'email:', email);
      throw new Error('Email déjà utilisé');
    }

    // Hasher le mot de passe
    console.log('Hashage du mot de passe pour l\'utilisateur:', username);
    const passwordHash = await hashPassword(password);

    // Créer un nouvel utilisateur dans la base de données
    console.log('Création de l\'utilisateur dans la base de données');
    const userId = await userModel.createUser(username, email, passwordHash);
    console.log('Nouvel utilisateur créé avec l\'ID:', userId);
    const newUser = await userModel.findById(userId);
    console.log('Utilisateur récupéré avec succès');

    // Générer un nom aléatoire pour le dinosaure
    console.log('Génération d\'un nom aléatoire pour le dinosaure');
    const randomName = generateRandomName();

    // Sélectionner un régime alimentaire aléatoire
    console.log('Sélection d\'un régime alimentaire aléatoire pour le dinosaure');
    const randomDiet = getRandomDiet();

    // Créer le dinosaure associé à l'utilisateur avec les caractéristiques par défaut
    console.log('Création du dinosaure associé à l\'utilisateur avec l\'ID:', userId);
    const newDinosaur = await createDinosaur(randomName, userId, randomDiet);
    console.log('Nouveau dinosaure créé avec le nom :', newDinosaur.name);

    // Retourner l'utilisateur et le dinosaure
    console.log('Inscription réussie pour l\'utilisateur:', username);
    return { user: newUser, dinosaur: newDinosaur };
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    throw error;
  }
};

/**
 * Connecte un utilisateur en vérifiant ses identifiants.
 * @param {string} email - Email de l'utilisateur.
 * @param {string} password - Mot de passe en clair.
 * @returns {Promise<Object>} Le token JWT et les informations de l'utilisateur.
 */
const login = async (email, password) => {
  try {
    // Vérifier si l'utilisateur existe
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    // Vérifier si le mot de passe est correct
    const passwordValid = await checkPassword(password, user.password_hash);
    if (!passwordValid) {
      throw new Error('Identifiants invalides');
    }

    // Générer un token JWT pour l'utilisateur connecté
    const token = generateToken(user);

    // Retourner le token et les informations de l'utilisateur
    return { token, user };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

module.exports = {
  hashPassword,
  checkPassword,
  generateToken,
  signup,
  login
};