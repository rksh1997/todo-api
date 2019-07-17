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
