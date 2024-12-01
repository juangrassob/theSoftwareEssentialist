import express, { Request, Response } from "express";
import { prisma } from "../database";
import { ErrorHandler } from "../shared/errorHandling";
import { Errors } from "../shared/errors";
import { parseForResponse, isMissingKeys, isUUID } from "../shared/helpers";

class ClassesController {
  private router: express.Router;
  private errorHandler: ErrorHandler;

  constructor(errorHandler: ErrorHandler) {
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

  private async createClass(req: Request, res: Response) {
    try {
      if (isMissingKeys(req.body, ["name"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const { name } = req.body;

      const cls = await prisma.class.create({
        data: {
          name,
        },
      });

      res
        .status(201)
        .json({ error: undefined, data: parseForResponse(cls), success: true });
    } catch (error) {
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }

  private async getClassAssignments(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      // check if class exists
      const cls = await prisma.class.findUnique({
        where: {
          id,
        },
      });

      if (!cls) {
        return res.status(404).json({
          error: Errors.ClassNotFound,
          data: undefined,
          success: false,
        });
      }

      const assignments = await prisma.assignment.findMany({
        where: {
          classId: id,
        },
        include: {
          class: true,
          studentTasks: true,
        },
      });

      res.status(200).json({
        error: undefined,
        data: parseForResponse(assignments),
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }

  private async enrollStudent(req: Request, res: Response) {
    try {
      if (isMissingKeys(req.body, ["studentId", "classId"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const { studentId, classId } = req.body;

      // check if student exists
      const student = await prisma.student.findUnique({
        where: {
          id: studentId,
        },
      });

      if (!student) {
        return res.status(404).json({
          error: Errors.StudentNotFound,
          data: undefined,
          success: false,
        });
      }

      // check if class exists
      const cls = await prisma.class.findUnique({
        where: {
          id: classId,
        },
      });

      // check if student is already enrolled in class
      const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
        where: {
          studentId,
          classId,
        },
      });

      if (duplicatedClassEnrollment) {
        return res.status(400).json({
          error: Errors.StudentAlreadyEnrolled,
          data: undefined,
          success: false,
        });
      }

      if (!cls) {
        return res.status(404).json({
          error: Errors.ClassNotFound,
          data: undefined,
          success: false,
        });
      }

      const classEnrollment = await prisma.classEnrollment.create({
        data: {
          studentId,
          classId,
        },
      });

      res.status(201).json({
        error: undefined,
        data: parseForResponse(classEnrollment),
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }
}
