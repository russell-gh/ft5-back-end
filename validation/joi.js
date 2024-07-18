const joi = require("joi");

const userSchema = joi.object({
  email: joi.string().email(),
  password: joi.string().min(8).max(32),
});

module.exports = { userSchema };
