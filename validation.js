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

module.exports = userValidation;