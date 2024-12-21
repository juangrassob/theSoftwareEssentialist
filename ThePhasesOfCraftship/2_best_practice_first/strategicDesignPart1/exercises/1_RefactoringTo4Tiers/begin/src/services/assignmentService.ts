import { Database } from "../database";
import { AssignmentNotFoundExeption } from "../shared/exeptions";

export class AssignmentService {
  private readonly db: Database;

  constructor(db: Database) {
    this.db = db;
  }

  async getAssignment(id: string) {
    const assignment = this.db.assignment.getById(id);

    if (!assignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    return assignment;
  }

  async createAssignment(classId: string, title: string) {
    const assignment = this.db.assignment.save(classId, title);

    return assignment;
  }

  async submitAssignment(id: string) {
    const studentAssignment = await this.db.assignment.getById(id);

    if (!studentAssignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    const studentAssignmentUpdated = await this.db.assignment.submit(id);

    return studentAssignmentUpdated;
  }

  async gradeAssignment(id: string, grade: string) {
    const studentAssignment = await this.db.assignment.getById(id);

    if (!studentAssignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    const studentAssignmentUpdated = await this.db.assignment.grade(id, grade);

    return studentAssignmentUpdated;
  }
}
