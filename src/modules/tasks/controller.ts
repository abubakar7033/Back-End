import { Request, Response } from "express";
import { MESSAGES } from "../../constants/index";
import { Task } from "../../types/index";
import * as taskService from "./service";
import {
  taskIdSchema,
  createTaskSchema,
  updateTaskSchema,
  querySchema,
} from "./validation";
import ApiResponse from "../../utils/apiResponse";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = querySchema.validate(req.query);
    if (error) {
      return ApiResponse.badRequest(res, error.details[0].message);
    }

    const { page = "1", limit = "10" } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);

    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return ApiResponse.badRequest(res, "Invalid query parameters");
    }

    const tasks = await taskService.findTasksWithPagination(
      pageNumber,
      limitNumber
    );
    return ApiResponse.success(res, tasks);
  } catch (error) {
    return ApiResponse.internalError(res, MESSAGES.FETCH_ERROR);
  }
};

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = createTaskSchema.validate(req.body);
    if (error) {
      return ApiResponse.badRequest(res, error.details[0].message);
    }

    const { title, color }: Task = req.body;

    const existingTask = await taskService.findTaskByTitle(title);

    if (existingTask) {
      return ApiResponse.badRequest(res, MESSAGES.TASK_EXISTS);
    }

    const task = await taskService.createTask(title, color ?? "");
    return ApiResponse.created(res, task);
  } catch (error) {
    return ApiResponse.internalError(res, MESSAGES.CREATE_ERROR);
  }
};

export const updateTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error: paramError } = taskIdSchema.validate(req.params);
    if (paramError) {
      return ApiResponse.badRequest(res, paramError.details[0].message);
    }

    const { error: bodyError } = updateTaskSchema.validate(req.body);
    if (bodyError) {
      return ApiResponse.badRequest(res, bodyError.details[0].message);
    }

    const { id } = req.params;
    const { title, color, completed }: Task = req.body;

    const taskExists = await taskService.findTaskById(parseInt(id, 10));

    if (!taskExists) {
      return ApiResponse.notFound(res, MESSAGES.TASK_NOT_FOUND);
    }

    const task = await taskService.updateTask(parseInt(id, 10), {
      title,
      color: color ?? taskExists.color,
      completed,
    });
    return ApiResponse.success(res, task);
  } catch (error) {
    return ApiResponse.internalError(res, MESSAGES.UPDATE_ERROR);
  }
};

export const deleteTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = taskIdSchema.validate(req.params);
    if (error) {
      return ApiResponse.badRequest(res, error.details[0].message);
    }

    const { id } = req.params;

    const taskExists = await taskService.findTaskById(parseInt(id, 10));

    if (!taskExists) {
      return ApiResponse.notFound(res, MESSAGES.TASK_NOT_FOUND);
    }

    await taskService.deleteTask(parseInt(id, 10));
    res.status(204).send();
  } catch (error) {
    return ApiResponse.internalError(res, MESSAGES.DELETE_ERROR);
  }
};

export const getTaskById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = taskIdSchema.validate(req.params);
    if (error) {
      return ApiResponse.badRequest(res, error.details[0].message);
    }

    const { id } = req.params;
    const task = await taskService.findTaskById(parseInt(id, 10));

    if (!task) {
      return ApiResponse.notFound(res, MESSAGES.TASK_NOT_FOUND);
    }

    return ApiResponse.success(res, task);
  } catch (error) {
    return ApiResponse.internalError(res, MESSAGES.FETCH_ERROR);
  }
};
