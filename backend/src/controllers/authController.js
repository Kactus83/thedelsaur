const authService = require('../services/authService');

// Contrôleur pour l'inscription
exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await authService.signup(username, email, password);
    res.status(201).json({ message: 'User created', user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Contrôleur pour la connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.status(200).json({ message: 'Login successful', token: data.token, user: data.user });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};
