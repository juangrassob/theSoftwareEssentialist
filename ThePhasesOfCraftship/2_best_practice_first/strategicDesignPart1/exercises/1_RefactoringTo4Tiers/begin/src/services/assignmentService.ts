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

  async getAssignment(dto: AssignmentID) {
    const { id } = dto;
    const assignment = this.db.assignment.getById(id);

    if (!assignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    return assignment;
  }

  async createAssignment(dto: CreateAssignmentDTO) {
    const { classId, title } = dto;
    const assignment = this.db.assignment.save(classId, title);

    return assignment;
  }

  async submitAssignment(dto: SubmitAssignmentDTO) {
    const { id } = dto;
    const studentAssignment = await this.db.assignment.getById(id);

    if (!studentAssignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    const studentAssignmentUpdated = await this.db.assignment.submit(id);

    return studentAssignmentUpdated;
  }

  async gradeAssignment(dto: GradeAssignmentDTO) {
    const { id, grade } = dto;
    const studentAssignment = await this.db.assignment.getById(id);

    if (!studentAssignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    const studentAssignmentUpdated = await this.db.assignment.grade(id, grade);

    return studentAssignmentUpdated;
  }
}
