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

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const prisma = new PrismaClient();

const database = new Database(prisma);

const studentService = new StudentService(database);
const classService = new ClassService(database);
const assignmentService = new AssignmentService(database);

const studentController = new StudentController(studentService, errorHandler);
const classController = new ClasseController(classService, errorHandler);
const assignmentController = new AssignmentController(
  assignmentService,
  errorHandler
);

app.use("/student", studentController.getRouter());
app.use("/class", classController.getRouter());
app.use("/assignment", assignmentController.getRouter());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
