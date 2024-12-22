import express, { NextFunction, Request, Response } from "express";
import {
  AssignmentID,
  CreateAssignmentDTO,
  GradeAssignmentDTO,
  SubmitAssignmentDTO,
} from "../dtos/assignmentDto";
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
      const dto = AssignmentID.fromRequestParams(req.params);

      const assignment = await this.assignmentService.getAssignment(dto);

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
      const dto = CreateAssignmentDTO.fromRequest(req.body);

      const assignment = await this.assignmentService.createAssignment(dto);
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
      const dto = SubmitAssignmentDTO.fromRequest(req.body);

      const studentAssignmentUpdated =
        await this.assignmentService.submitAssignment(dto);

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
      const dto = GradeAssignmentDTO.fromRequest(req.body);

      const studentAssignmentUpdated =
        await this.assignmentService.gradeAssignment(dto);

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
