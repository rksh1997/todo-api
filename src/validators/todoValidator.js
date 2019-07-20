import Joi from '@hapi/joi';

export const createTodoSchema = Joi.object()
  .keys({
    title: Joi.string()
      .min(1)
      .max(1000)
      .required(),
    description: Joi.string()
      .min(1)
      .max(1000),
  })
  .required();
