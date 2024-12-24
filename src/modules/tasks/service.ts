import { PrismaClient } from "@prisma/client";
import { Task } from "../../types/index";

const prisma = new PrismaClient();

export const findAllTasks = async (): Promise<Task[]> => {
  return await prisma.task.findMany();
};

export const findTaskByTitle = async (title: string): Promise<Task | null> => {
  return await prisma.task.findFirst({ where: { title } });
};

export const createTask = async (
  title: string,
  color: string
): Promise<Task> => {
  return await prisma.task.create({ data: { title, color } });
};

export const findTaskById = async (id: number): Promise<Task | null> => {
  return await prisma.task.findUnique({ where: { id } });
};

export const updateTask = async (
  id: number,
  data: Partial<Task>
): Promise<Task> => {
  return await prisma.task.update({ where: { id }, data });
};

export const deleteTask = async (id: number): Promise<void> => {
  await prisma.task.delete({ where: { id } });
};

export const findTasksWithPagination = async (
  page: number,
  limit: number
): Promise<{
  tasks: Task[];
  totalDocs: number;
  currentPage: number;
  totalPages: number;
}> => {
  const offset = (page - 1) * limit;
  const [tasks, totalDocs] = await Promise.all([
    prisma.task.findMany({
      skip: offset,
      take: limit,
    }),
    prisma.task.count(),
  ]);

  const totalPages = Math.ceil(totalDocs / limit);

  return {
    tasks,
    totalDocs,
    currentPage: page,
    totalPages,
  };
};
