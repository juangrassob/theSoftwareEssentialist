import { Database } from "../database";
import { StudentNotFoundExeption } from "../shared/exeptions";

export class StudentService {
  private readonly db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  async createStudent(name: string) {
    const student = await this.db.student.save(name);
    return student;
  }

  async getStudents() {
    const students = await this.db.student.getAll();
    return students;
  }

  async getStudent(id: string) {
    const student = await this.db.student.getById(id);

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    return student;
  }

  async getStudentAssigments(id: string) {
    const student = await this.db.student.getById(id);

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    const studentAssignments = await this.db.student.getAssignments(id);

    return studentAssignments;
  }

  async getStudentGrades(id: string) {
    const student = await this.db.student.getById(id);

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    const studentAssignments = await this.db.student.getGrades(id);

    return studentAssignments;
  }
}
