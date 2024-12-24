import { Response } from "express";

class ApiResponse {
  static badRequest(res: Response, message: string): void {
    res.status(400).json({ message });
  }

  static internalError(res: Response, message: string): void {
    res.status(500).json({ message });
  }

  static notFound(res: Response, message: string): void {
    res.status(404).json({ message });
  }

  static success(res: Response, data: any): void {
    res.status(200).json(data);
  }

  static created(res: Response, data: any): void {
    res.status(201).json(data);
  }
}

export default ApiResponse;
