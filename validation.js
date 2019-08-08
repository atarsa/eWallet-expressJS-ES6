// Validation
const Joi = require('@hapi/joi');

// Register Validation
const userValidation = data => {
  
  const schema = {
    username: Joi.string().min(5).required(),
    password: Joi.string().min(6).required()
  };

  return Joi.validate(data, schema);
}

// Item validation
const itemValidation = data => {
  const schema = {
    currency: Joi.string().trim().min(3).max(3).uppercase().required(),
    amount: Joi.number().positive().precision(3).required(),
    id: Joi.number().min(0).integer()
  };

  return Joi.validate(data, schema);
}

// Amount validation
const amountValidation = data => {
  const schema = {
    amount: Joi.number().positive().precision(3).required()
  };

  return Joi.validate(data, schema);
}

// Currency symbol validation
const currencySymbolValidation = data => {
  const schema = {
    symbols: Joi.string().trim().regex(/^([a-zA-Z]{3}),?/)
  };

  return Joi.validate(data, schema);
} 


module.exports = {userValidation,
                  itemValidation,
                  amountValidation,
                  currencySymbolValidation};