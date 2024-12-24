import request from "supertest";
import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../src/modules/tasks/controller";
import * as taskService from "../src/modules/tasks/service";
import { MESSAGES } from "../src/constants/index";

const app = express();
app.use(express.json());
app.get("/tasks", getTasks);
app.post("/tasks", createTask);
app.put("/tasks/:id", updateTask);
app.delete("/tasks/:id", deleteTask);

jest.mock("../src/modules/tasks/service");

describe("Task Controller", () => {
  describe("GET /tasks", () => {
    it("should return paginated tasks", async () => {
      const tasks = [
        { id: 1, title: "Test Task", color: "red", completed: false },
      ];
      const paginatedTasks = {
        tasks,
        totalDocs: 1,
        currentPage: 1,
        totalPages: 1,
      };
      (taskService.findTasksWithPagination as jest.Mock).mockResolvedValue(
        paginatedTasks
      );

      const response = await request(app).get("/tasks?page=1&limit=10");

      expect(response.status).toBe(200);
      expect(response.body).toEqual(paginatedTasks);
    });

    it("should handle validation errors", async () => {
      const response = await request(app).get("/tasks?page=invalid&limit=10");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid query parameters");
    });

    it("should handle errors", async () => {
      (taskService.findTasksWithPagination as jest.Mock).mockRejectedValue(
        new Error("Fetch error")
      );

      const response = await request(app).get("/tasks?page=1&limit=10");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(MESSAGES.FETCH_ERROR);
    });
  });

  describe("POST /tasks", () => {
    it("should create a new task", async () => {
      const newTask = {
        id: 1,
        title: "New Task",
        color: "blue",
        completed: false,
      };
      (taskService.findTaskByTitle as jest.Mock).mockResolvedValue(null);
      (taskService.createTask as jest.Mock).mockResolvedValue(newTask);

      const response = await request(app)
        .post("/tasks")
        .send({ title: "New Task", color: "blue" });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newTask);
    });

    it("should return 400 if task already exists", async () => {
      (taskService.findTaskByTitle as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Existing Task",
        color: "blue",
        completed: false,
      });

      const response = await request(app)
        .post("/tasks")
        .send({ title: "Existing Task", color: "blue" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(MESSAGES.TASK_EXISTS);
    });

    it("should handle errors", async () => {
      (taskService.findTaskByTitle as jest.Mock).mockRejectedValue(
        new Error("Create error")
      );

      const response = await request(app)
        .post("/tasks")
        .send({ title: "New Task", color: "blue" });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(MESSAGES.CREATE_ERROR);
    });
  });

  describe("PUT /tasks/:id", () => {
    it("should update an existing task", async () => {
      const updatedTask = {
        id: 1,
        title: "Updated Task",
        color: "green",
        completed: true,
      };
      (taskService.findTaskById as jest.Mock).mockResolvedValue(updatedTask);
      (taskService.updateTask as jest.Mock).mockResolvedValue(updatedTask);

      const response = await request(app)
        .put("/tasks/1")
        .send({ title: "Updated Task", color: "green", completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
    });

    it("should return 404 if task not found", async () => {
      (taskService.findTaskById as jest.Mock).mockResolvedValue(null);

      const response = await request(app)
        .put("/tasks/1")
        .send({ title: "Updated Task", color: "green", completed: true });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(MESSAGES.TASK_NOT_FOUND);
    });

    it("should handle errors", async () => {
      (taskService.findTaskById as jest.Mock).mockRejectedValue(
        new Error("Update error")
      );

      const response = await request(app)
        .put("/tasks/1")
        .send({ title: "Updated Task", color: "green", completed: true });

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(MESSAGES.UPDATE_ERROR);
    });
  });

  describe("DELETE /tasks/:id", () => {
    it("should delete an existing task", async () => {
      (taskService.findTaskById as jest.Mock).mockResolvedValue({
        id: 1,
        title: "Task to delete",
        color: "red",
        completed: false,
      });
      (taskService.deleteTask as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/tasks/1");

      expect(response.status).toBe(204);
    });

    it("should return 404 if task not found", async () => {
      (taskService.findTaskById as jest.Mock).mockResolvedValue(null);

      const response = await request(app).delete("/tasks/1");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe(MESSAGES.TASK_NOT_FOUND);
    });

    it("should handle errors", async () => {
      (taskService.findTaskById as jest.Mock).mockRejectedValue(
        new Error("Delete error")
      );

      const response = await request(app).delete("/tasks/1");

      expect(response.status).toBe(500);
      expect(response.body.message).toBe(MESSAGES.DELETE_ERROR);
    });
  });
});
