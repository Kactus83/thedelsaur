const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

// Fonction pour le hashage du mot de passe
exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Fonction pour vérifier si le mot de passe est correct
exports.checkPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Fonction pour générer un token JWT
exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Service pour enregistrer un nouvel utilisateur
exports.signup = async (username, email, password) => {
  const existingUser = await userModel.findByEmail(email);
  if (existingUser) throw new Error('Email already in use');
  
  const passwordHash = await this.hashPassword(password);
  const userId = await userModel.createUser(username, email, passwordHash);
  return { id: userId, username, email };
};

// Service pour connecter un utilisateur
exports.login = async (email, password) => {
  const user = await userModel.findByEmail(email);
  if (!user) throw new Error('User not found');
  
  const passwordValid = await this.checkPassword(password, user.password_hash);
  if (!passwordValid) throw new Error('Invalid credentials');

  const token = this.generateToken(user);
  return { token, user };
};
