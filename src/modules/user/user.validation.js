import Joi from "joi";

const addUserValidation = Joi.object({
  name: Joi.string().required().trim(),
  email: Joi.string().required().trim(),
  password: Joi.string().required(),
  role: Joi.string().valid("admin", "user").default("user"),
  isActive: Joi.boolean().default(true),
  verified: Joi.boolean().default(false),
  blocked: Joi.boolean().default(false),

}).options({ allowUnknown: false });

const updateUserValidation = Joi.object({
  name: Joi.string().trim(),
  password: Joi.string(),
  id: Joi.string().hex().length(24).required(),
  role: Joi.string().valid("admin", "user").default("user"),
  isActive: Joi.boolean().default(true),
  verified: Joi.boolean().default(false),
  blocked: Joi.boolean().default(false),

}).options({ allowUnknown: false });

const changeUserPasswordValidation = Joi.object({
  password: Joi.string().required(),
  id: Joi.string().hex().length(24).required(),
});

const deleteUserValidation = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export {
  addUserValidation, changeUserPasswordValidation,
  deleteUserValidation, updateUserValidation
};

