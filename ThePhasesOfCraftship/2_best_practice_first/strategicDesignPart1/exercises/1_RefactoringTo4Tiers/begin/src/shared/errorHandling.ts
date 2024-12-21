import { Request, Response, NextFunction } from "express";
import { ClassNotFoundExeption, StudentNotFoundExeption } from "./exeptions";
import { Errors } from "../shared/errors";
export type ErrorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => Response;

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof StudentNotFoundExeption) {
    return response.status(404).json({
      error: Errors.StudentNotFound,
      data: undefined,
      success: false,
    });
  }

  if (error instanceof ClassNotFoundExeption) {
    return response.status(404).json({
      error: Errors.ClassNotFound,
      data: undefined,
      success: false,
    });
  }

  response
    .status(500)
    .json({ error: Errors.ServerError, data: undefined, success: false });
}
