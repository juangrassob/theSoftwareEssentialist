import express from "express";
import { Database } from "./database";
import { PrismaClient } from "@prisma/client";
import { StudentService } from "./services/studentService";
import { ClassService } from "./services/classStervice";
import { AssignmentService } from "./services/assignmentService";
import StudentController from "./controllers/studentController";
import { errorHandler } from "./shared/errorHandling";
import ClasseController from "./controllers/classController";
import AssignmentController from "./controllers/assignmentController";
import { Application } from "express";
const cors = require("cors");

export default class Server {
  private readonly app: Application;

  constructor(
    studentController: StudentController,
    classController: ClasseController,
    assignmentController: AssignmentController
  ) {
    this.app = express();
    this.setUpMiddlewares();
    this.setUpRoutes(studentController, classController, assignmentController);
  }

  public start(port: number) {
    this.app.listen(port, () => console.log(`Listening on port ${port}`));
  }

  private setUpMiddlewares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private setUpRoutes(
    studentController: StudentController,
    classController: ClasseController,
    assignmentController: AssignmentController
  ) {
    this.app.use("/student", studentController.getRouter());
    this.app.use("/class", classController.getRouter());
    this.app.use("/assignment", assignmentController.getRouter());
  }
}
