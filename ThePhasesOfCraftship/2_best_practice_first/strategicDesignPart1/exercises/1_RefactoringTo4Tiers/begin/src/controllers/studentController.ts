import express, { NextFunction, Request, Response } from "express";
import { StudentService } from "../services/studentService";
import { ErrorHandler } from "../shared/errorHandling";
import { Errors } from "../shared/errors";
import { parseForResponse, isMissingKeys, isUUID } from "../shared/helpers";

class StudentController {
  private router: express.Router;
  private errorHandler: ErrorHandler;
  private studentService: StudentService;

  constructor(studentService: StudentService, errorHandler: ErrorHandler) {
    this.studentService = studentService;
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
    this.router.post("/", this.createStudent);
    this.router.get("/", this.getStudents);
    this.router.get("/:id", this.getStudent);
    this.router.get("/:id/assignments", this.getStudentAssigments);
    this.router.get("/:id/grades", this.getStudentGrades);
  }

  private async createStudent(req: Request, res: Response, next: NextFunction) {
    try {
      if (isMissingKeys(req.body, ["name"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }
      const { name } = req.body;
      const student = await this.studentService.createStudent(name);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const students = this.studentService.getStudents();

      res.status(200).json({
        error: undefined,
        data: parseForResponse(students),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!isUUID(id)) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const student = this.studentService.getStudent(id);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getStudentAssigments(
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

      const studentAssignments = await this.studentService.getStudentAssigments(
        id
      );

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignments),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }

  private async getStudentGrades(
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

      const studentAssignments = await this.studentService.getStudentGrades(id);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignments),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  }
}
