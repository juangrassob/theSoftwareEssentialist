import express, { NextFunction, Request, Response } from "express";
import { prisma } from "../database";
import { ClassService } from "../services/classStervice";
import { ErrorHandler } from "../shared/errorHandling";
import { Errors } from "../shared/errors";
import { parseForResponse, isMissingKeys, isUUID } from "../shared/helpers";

class ClasseController {
  private classService: ClassService;
  private router: express.Router;
  private errorHandler: ErrorHandler;

  constructor(classService: ClassService, errorHandler: ErrorHandler) {
    this.classService = classService;
    this.router = express.Router();
    this.errorHandler = errorHandler;
    this.setupRoutes();
    this.setupErrorHandler();
  }

  public getRouter(): express.Router {
    return this.router;
  }

  private setupErrorHandler() {
    this.router.use(this.errorHandler);
  }

  private setupRoutes() {
    this.router.post("/", this.createClass);
    this.router.get("/:id/assignments", this.getClassAssignments);
    this.router.get("/enrollments", this.enrollStudent);
  }

  private async createClass(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ["name"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const { name } = req.body;

      const cls = await this.classService.createClass(name);

      res
        .status(201)
        .json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
      next(error);
    }
  }

  private async getClassAssignments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const assignments = await this.classService.getClassAssignments(id);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(assignments),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async enrollStudent(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ["studentId", "classId"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const { studentId, classId } = req.body;

      const classEnrollment = await this.classService.enrollStudent(
        studentId,
        classId
      );

      res.status(201).json({
        error: undefined,
        data: parseForResponse(classEnrollment),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
