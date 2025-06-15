// models/user.js (Backend)
const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');

// Schéma pour les paramètres de jeu de l'utilisateur
const userGameSettingsSchema = Joi.object({
  difficulty: Joi.string().valid('easy', 'medium', 'hard').default('medium'),
  wordLength: Joi.boolean().default(true),
  similarLetters: Joi.boolean().default(true),
  phoneticComplexity: Joi.boolean().default(true),
  hintType: Joi.string().valid('text', 'animation', 'image', 'audio').default('text'),
  hintsPerExercise: Joi.number().integer().min(1).max(5).default(1),
  hintsCount: Joi.number().integer().min(1).max(10).default(3),
  hintDelay: Joi.number().integer().min(0).max(60).default(5),
  gameSpeed: Joi.number().integer().min(1).max(10).default(5),
  interactionMode: Joi.string().valid('mouse', 'voice', 'keyboard').default('mouse'),
  timerEnabled: Joi.boolean().default(false),
  timerDuration: Joi.number().integer().min(10).max(300).default(60),
  hideWrongAnswers: Joi.boolean().default(true),
  showFinalScore: Joi.boolean().default(true),
  feedbackLevel: Joi.string().valid('none', 'basic', 'detailed', 'very-detailed').default('detailed')
});

module.exports = new BaseModel('User', {
  id: Joi.number().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  imageUrl: Joi.string().allow(''),
  settings: userGameSettingsSchema.optional() // Paramètres de jeu optionnels
});
