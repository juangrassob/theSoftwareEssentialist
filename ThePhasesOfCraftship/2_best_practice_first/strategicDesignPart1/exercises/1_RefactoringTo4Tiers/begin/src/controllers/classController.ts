import express, { NextFunction, Request, Response } from "express";
import { ClassID, CreateClassDTO, EnrollStudentDTO } from "../dtos/classDto";
import { ClassService } from "../services/classStervice";
import { ErrorHandler } from "../shared/errorHandling";
import { Errors } from "../shared/errors";
import { parseForResponse, isMissingKeys, isUUID } from "../shared/helpers";

export default class ClasseController {
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

  private createClass = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = CreateClassDTO.fromRequest(req.body);

      const cls = await this.classService.createClass(dto);

      res
        .status(201)
        .json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
      next(error);
    }
  };

  private getClassAssignments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = ClassID.fromRequestParams(req.params);

      const assignments = await this.classService.getClassAssignments(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(assignments),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private enrollStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = EnrollStudentDTO.fromRequest(req.body);

      const classEnrollment = await this.classService.enrollStudent(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(classEnrollment),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };
}
