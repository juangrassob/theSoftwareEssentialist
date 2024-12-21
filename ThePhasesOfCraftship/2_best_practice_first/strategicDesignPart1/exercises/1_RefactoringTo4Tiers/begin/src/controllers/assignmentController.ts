import express, { NextFunction, Request, Response } from "express";
import { AssignmentService } from "../services/assignmentService";
import { ErrorHandler } from "../shared/errorHandling";
import { Errors } from "../shared/errors";
import { parseForResponse, isMissingKeys, isUUID } from "../shared/helpers";

class AssignmentController {
  private assignmentService: AssignmentService;
  private router: express.Router;
  private errorHandler: ErrorHandler;

  constructor(
    assignmentService: AssignmentService,
    errorHandler: ErrorHandler
  ) {
    this.assignmentService = assignmentService;
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
    this.router.get(":id", this.getAssignment);
    this.router.post("/", this.createAssignment);
    this.router.post("/submit", this.submitAssignment);
    this.router.post("/grade", this.gradeAssignment);
  }

  async getAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }
      const assignment = await this.assignmentService.getAssignment(id);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(assignment),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async createAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ["classId", "title"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const { classId, title } = req.body;

      const assignment = await this.assignmentService.createAssignment(
        classId,
        title
      );

      res.status(201).json({
        error: undefined,
        data: parseForResponse(assignment),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async submitAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ["id"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const { id } = req.body;

      const studentAssignmentUpdated =
        await this.assignmentService.submitAssignment(id);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignmentUpdated),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  async gradeAssignment(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ["id", "grade"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const { id, grade } = req.body;

      // validate grade
      if (!["A", "B", "C", "D"].includes(grade)) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const studentAssignmentUpdated =
        await this.assignmentService.gradeAssignment(id, grade);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignmentUpdated),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
