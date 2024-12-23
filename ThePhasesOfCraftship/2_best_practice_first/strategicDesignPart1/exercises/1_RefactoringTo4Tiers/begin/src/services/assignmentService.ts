import { Database } from "../database";
import {
  AssignmentID,
  CreateAssignmentDTO,
  GradeAssignmentDTO,
  SubmitAssignmentDTO,
} from "../dtos/assignmentDto";
import { AssignmentNotFoundExeption } from "../shared/exeptions";

export class AssignmentService {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  getAssignment = async (dto: AssignmentID) => {
    const { id } = dto;
    const assignment = await this.db.assignment.getById(id);

    if (!assignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    return assignment;
  };

  createAssignment = async (dto: CreateAssignmentDTO) => {
    const { classId, title } = dto;
    const assignment = await this.db.assignment.save(classId, title);

    return assignment;
  };

  submitAssignment = async (dto: SubmitAssignmentDTO) => {
    const { id } = dto;
    const studentAssignment = await this.db.assignment.getById(id);

    if (!studentAssignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    const studentAssignmentUpdated = await this.db.assignment.submit(id);

    return studentAssignmentUpdated;
  };

  gradeAssignment = async (dto: GradeAssignmentDTO) => {
    const { id, grade } = dto;
    const studentAssignment = await this.db.assignment.getById(id);

    if (!studentAssignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    const studentAssignmentUpdated = await this.db.assignment.grade(id, grade);

    return studentAssignmentUpdated;
  };
}
