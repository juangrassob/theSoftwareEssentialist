import express, { Request, Response } from "express";
import { prisma } from "../database";
import { ErrorHandler } from "../shared/errorHandling";
import { Errors } from "../shared/errors";
import { parseForResponse, isMissingKeys, isUUID } from "../shared/helpers";

class AssignmentController {
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
    this.router.get(":id", this.getAssignment);
    this.router.post("/", this.createAssignment);
    this.router.post("/submit", this.submitAssigment);
    this.router.post("/grade", this.gradeAssignment);
  }

  async getAssignment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!isUUID(id)) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }
      const assignment = await prisma.assignment.findUnique({
        include: {
          class: true,
          studentTasks: true,
        },
        where: {
          id,
        },
      });

      if (!assignment) {
        return res.status(404).json({
          error: Errors.AssignmentNotFound,
          data: undefined,
          success: false,
        });
      }

      res.status(200).json({
        error: undefined,
        data: parseForResponse(assignment),
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }

  async createAssignment(req: Request, res: Response) {
    try {
      if (isMissingKeys(req.body, ["classId", "title"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const { classId, title } = req.body;

      const assignment = await prisma.assignment.create({
        data: {
          classId,
          title,
        },
      });

      res.status(201).json({
        error: undefined,
        data: parseForResponse(assignment),
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }

  async submitAssigment(req: Request, res: Response) {
    try {
      if (isMissingKeys(req.body, ["id"])) {
        return res.status(400).json({
          error: Errors.ValidationError,
          data: undefined,
          success: false,
        });
      }

      const { id } = req.body;

      // check if student assignment exists
      const studentAssignment = await prisma.studentAssignment.findUnique({
        where: {
          id,
        },
      });

      if (!studentAssignment) {
        return res.status(404).json({
          error: Errors.AssignmentNotFound,
          data: undefined,
          success: false,
        });
      }

      const studentAssignmentUpdated = await prisma.studentAssignment.update({
        where: {
          id,
        },
        data: {
          status: "submitted",
        },
      });

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignmentUpdated),
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }

  async gradeAssignment(req: Request, res: Response) {
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

      // check if student assignment exists
      const studentAssignment = await prisma.studentAssignment.findUnique({
        where: {
          id,
        },
      });

      if (!studentAssignment) {
        return res.status(404).json({
          error: Errors.AssignmentNotFound,
          data: undefined,
          success: false,
        });
      }

      const studentAssignmentUpdated = await prisma.studentAssignment.update({
        where: {
          id,
        },
        data: {
          grade,
        },
      });

      res.status(200).json({
        error: undefined,
        data: parseForResponse(studentAssignmentUpdated),
        success: true,
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: Errors.ServerError, data: undefined, success: false });
    }
  }
}
