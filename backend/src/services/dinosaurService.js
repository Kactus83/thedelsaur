const dinosaurModel = require('../models/dinosaurModel');

// Service pour récupérer tous les dinosaures
exports.getAllDinosaurs = async () => {
  return await dinosaurModel.findAll();
};

// Service pour récupérer un dinosaure par son ID
exports.getDinosaurById = async (dinosaurId) => {
  return await dinosaurModel.findById(dinosaurId);
};

// Service pour créer un dinosaure
exports.createDinosaur = async (name, userId, diet) => {
  return await dinosaurModel.createDinosaur(name, userId, diet);
};

// Service pour mettre à jour un dinosaure
exports.updateDinosaur = async (dinosaurId, updates) => {
  return await dinosaurModel.updateDinosaur(dinosaurId, updates);
};

// Service pour supprimer un dinosaure
exports.deleteDinosaur = async (dinosaurId) => {
  return await dinosaurModel.deleteDinosaur(dinosaurId);
};
