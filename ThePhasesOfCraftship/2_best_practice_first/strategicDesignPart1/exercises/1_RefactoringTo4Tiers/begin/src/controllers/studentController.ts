import express, { NextFunction, Request, Response } from "express";
import { CreateStudentDTO, StudentID } from "../dtos/studentDto";
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
      const dto = CreateStudentDTO.fromRequest(req);

      const student = await this.studentService.createStudent(dto);

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
      const dto = StudentID.fromRequestParams(req.params);

      const student = this.studentService.getStudent(dto);

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
      const dto = StudentID.fromRequestParams(req.params);

      const studentAssignments = await this.studentService.getStudentAssigments(
        dto
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
      const dto = StudentID.fromRequestParams(req.params);
      const studentAssignments = await this.studentService.getStudentGrades(
        dto
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
}
