import Joi from '@hapi/joi';

export const registerBasicSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required(),
  })
  .required();

export const loginBasicSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
  })
  .required();

export const loginFacebookSchema = Joi.object()
  .keys({
    token: Joi.string().required(),
  })
  .required();

export const emailSchema = Joi.object()
  .keys({
    email: Joi.string()
      .email()
      .required(),
  })
  .required();

export const resetPasswordSchema = Joi.object()
  .keys({
    token: Joi.string().required(),
    password: Joi.string()
      .min(5)
      .max(50)
      .required(),
  })
  .required();
