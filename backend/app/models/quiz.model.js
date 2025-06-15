const Joi = require('joi');
const BaseModel = require('../utils/base-model.js');

module.exports = new BaseModel('Quiz', {
  //id: Joi.number().required(), 
  title: Joi.string().required(),
  description: Joi.string().allow(''),
  category: Joi.string().required(),
  imageUrl: Joi.string(),
});
