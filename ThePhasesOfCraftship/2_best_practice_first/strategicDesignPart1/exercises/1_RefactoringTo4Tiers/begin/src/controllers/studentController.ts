import express, { NextFunction, Request, Response } from "express";
import { CreateStudentDTO, StudentID } from "../dtos/studentDto";
import { StudentService } from "../services/studentService";
import { ErrorHandler } from "../shared/errorHandling";
import { parseForResponse, isMissingKeys, isUUID } from "../shared/helpers";

export default class StudentController {
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

  private createStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = CreateStudentDTO.fromRequest(req.body);

      const student = await this.studentService.createStudent(dto);

      res.status(201).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getStudents = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const students = await this.studentService.getStudents();
      console.log({ students });
      res.status(200).json({
        error: undefined,
        data: parseForResponse(students),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getStudent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = StudentID.fromRequestParams(req.params);

      const student = await this.studentService.getStudent(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(student),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getStudentAssigments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const dto = StudentID.fromRequestParams(req.params);

      const studentAssignments =
        await this.studentService.getStudentAssignments(dto);

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignments),
        success: true,
      });
    } catch (error) {
      next(error);
    }
  };

  private getStudentGrades = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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
  };
}
