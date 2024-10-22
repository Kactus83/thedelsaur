const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { generateRandomName, getRandomDiet } = require('../utils/dinosaurUtils');const { 
  BASE_ENERGY,
  BASE_FOOD
} = require('../config/constants');

// Charger les variables d'environnement pour JWT secret
require('dotenv').config();

/**
 * Crée un nouveau dinosaure avec des valeurs par défaut.
 * @param {string} name - Nom du dinosaure.
 * @param {number} userId - ID de l'utilisateur propriétaire.
 * @param {string} diet - Régime alimentaire.
 * @param {number} [energy=10000] - Énergie initiale.
 * @param {number} [food=10000] - Nourriture initiale.
 * @param {number} [max_energy=10000] - Énergie maximale.
 * @param {number} [max_food=10000] - Nourriture maximale.
 * @param {number} [experience=0] - Expérience initiale.
 * @param {string} [epoch='past'] - Époque du dinosaure.
 * @returns {Promise<number>} ID du dinosaure créé.
 */
const createDinosaur = async (name, userId, diet, energy = BASE_ENERGY, max_energy = BASE_ENERGY, food = BASE_FOOD, max_food = BASE_FOOD, experience = 0, epoch = 'past') => {
  try {
    // Correction: ajout de la virgule manquante entre max_food et experience
    const query = `INSERT INTO dinosaur (name, user_id, diet, energy, max_energy, food, max_food, experience, epoch)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(query, [name, userId, diet, energy, max_energy, food, max_food, experience, epoch]);
    console.log('Dinosaur created with ID:', result.insertId);
    return result.insertId;
  } catch (err) {
    console.error('Erreur lors de la création du dinosaure:', err);
    throw err;
  }
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
 * Vérifie la validité d'un token JWT.
 * @param {string} token - Le token JWT à vérifier.
 * @returns {Promise<Object>} Les informations décodées du token.
 */
const verifyToken = async (token) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET est manquant dans les variables d\'environnement');
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Erreur lors de la vérification du token JWT:', error);
    throw new Error('Token invalide ou expiré');
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
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      throw new Error('Email déjà utilisé');
    }

    // Hasher le mot de passe
    const passwordHash = await hashPassword(password);

    // Créer un nouvel utilisateur dans la base de données
    const userId = await createUser(username, email, passwordHash);
    const newUser = await findUserById(userId);

    // Générer un nom et régime aléatoires pour le dinosaure
    const randomName = generateRandomName();
    const randomDiet = getRandomDiet();

    // Créer le dinosaure associé à l'utilisateur
    const dinosaurId = await createDinosaur(randomName, userId, randomDiet);
    const newDinosaur = await findDinosaurById(dinosaurId);

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
    const user = await findUserByEmail(email);
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

    return { token };
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    throw error;
  }
};

// --------- FONCTIONS RELATIVES AUX UTILISATEURS ---------

/**
 * Crée un nouvel utilisateur dans la base de données.
 * @param {string} username - Nom d'utilisateur.
 * @param {string} email - Email de l'utilisateur.
 * @param {string} passwordHash - Le mot de passe hashé.
 * @param {boolean} [isAdmin=false] - Indique si l'utilisateur est administrateur.
 * @returns {Promise<number>} ID de l'utilisateur créé.
 */
const createUser = async (username, email, passwordHash, isAdmin = false) => {
  try {
    const query = 'INSERT INTO user (username, email, password_hash, isAdmin) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(query, [username, email, passwordHash, isAdmin]);
    return result.insertId;
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    throw err;
  }
};

/**
 * Récupère un utilisateur par son ID.
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur ou null.
 */
const findUserById = async (userId) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur par ID:', err);
    throw err;
  }
};

/**
 * Récupère un utilisateur par son email.
 * @param {string} email - L'email de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur ou null.
 */
const findUserByEmail = async (email) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
    throw err;
  }
};

// --------- FONCTIONS RELATIVES AUX DINOSAURES ---------

/**
 * Récupère un dinosaure par son ID.
 * @param {number} dinosaurId - L'ID du dinosaure.
 * @returns {Promise<Object|null>} Le dinosaure ou null.
 */
const findDinosaurById = async (dinosaurId) => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur WHERE id = ?', [dinosaurId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération du dinosaure par ID:', err);
    throw err;
  }
};

module.exports = {
  hashPassword,
  checkPassword,
  generateToken,
  signup,
  login,
  createUser,
  findUserById,
  findUserByEmail,
  findDinosaurById,
  verifyToken
};
