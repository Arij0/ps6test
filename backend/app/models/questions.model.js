// models/question.js
const Joi = require('joi')
const BaseModel = require('../utils/base-model')

module.exports = new BaseModel('Question', {
  id: Joi.string().optional(),
  text: Joi.string().required(),
  options: Joi.array().items(Joi.string()).required(),
  answer: Joi.string().required(),
  hints: Joi.array().items(Joi.string()).required(),
  wordLength: Joi.number().required(),
  hasSimilarLetters: Joi.boolean().required(),
  phoneticComplexity: Joi.number().required(),
  isCustom: Joi.boolean().optional(),
   category: Joi.string().optional(),
    quizId: Joi.number().required(), 
})
