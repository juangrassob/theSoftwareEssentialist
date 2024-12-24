import { Request, Response, NextFunction } from "express";
import {
  AssignmentNotFoundExeption,
  ClassNotFoundExeption,
  InvalidRequestBodyException,
  StudentAlreadyEnrolledExeption,
  StudentNotFoundExeption,
} from "./exeptions";
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
): Response {
  console.error(error);

  if (error instanceof InvalidRequestBodyException) {
    return response.status(400).json({
      error: Errors.ValidationError,
      data: undefined,
      success: false,
    });
  }

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

  if (error instanceof StudentAlreadyEnrolledExeption) {
    return response.status(400).json({
      error: Errors.StudentAlreadyEnrolled,
      data: undefined,
      success: false,
    });
  }

  if (error instanceof AssignmentNotFoundExeption) {
    return response.status(404).json({
      error: Errors.AssignmentNotFound,
      data: undefined,
      success: false,
    });
  }

  return response
    .status(500)
    .json({ error: Errors.ServerError, data: undefined, success: false });
}
