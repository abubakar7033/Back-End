import Joi from "joi";
import { MESSAGES } from "../../constants/index";

export const querySchema = Joi.object({
  page: Joi.alternatives().try(Joi.number(), Joi.string()).optional().allow(""),
  limit: Joi.alternatives()
    .try(Joi.number(), Joi.string())
    .optional()
    .allow(""),
});

export const taskIdSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({ "any.required": MESSAGES.INVALID_ID }),
});

export const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  color: Joi.string().optional(),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  color: Joi.string().optional(),
  completed: Joi.boolean().optional(),
});
