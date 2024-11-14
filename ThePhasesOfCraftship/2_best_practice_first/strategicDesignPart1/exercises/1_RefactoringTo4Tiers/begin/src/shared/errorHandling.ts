import { Request, Response, NextFunction } from "express";

export type ErrorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) => Response;
