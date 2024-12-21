import { Database } from "../database";
import { CreateStudentDTO, StudentID } from "../dtos/studentDto";
import { StudentNotFoundExeption } from "../shared/exeptions";

export class StudentService {
  private readonly db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  async createStudent(dto: CreateStudentDTO) {
    const { name } = dto;
    const student = await this.db.student.save(name);
    return student;
  }

  async getStudents() {
    const students = await this.db.student.getAll();
    return students;
  }

  async getStudent(dto: StudentID) {
    const { id } = dto;
    const student = await this.db.student.getById(id);

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    return student;
  }

  async getStudentAssigments(dto: StudentID) {
    const { id } = dto;
    const student = await this.db.student.getById(id);

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    const studentAssignments = await this.db.student.getAssignments(id);

    return studentAssignments;
  }

  async getStudentGrades(dto: StudentID) {
    const { id } = dto;
    const student = await this.db.student.getById(id);

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    const studentAssignments = await this.db.student.getGrades(id);

    return studentAssignments;
  }
}
