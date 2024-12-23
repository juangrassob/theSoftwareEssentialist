import { Database } from "../database";
import { CreateStudentDTO, StudentID } from "../dtos/studentDto";
import { StudentNotFoundExeption } from "../shared/exeptions";

export class StudentService {
  private readonly db: Database;

  constructor(db: Database) {
    console.log("Creating student service");
    this.db = db;
  }

  createStudent = async (dto: CreateStudentDTO) => {
    const { name } = dto;

    const student = await this.db.student.save(name);
    return student;
  };

  getStudents = async () => {
    const students = await this.db.student.getAll();
    return students;
  };

  getStudent = async (dto: StudentID) => {
    const { id } = dto;
    const student = await this.db.student.getById(id);

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    return student;
  };

  getStudentAssignments = async (dto: StudentID) => {
    const { id } = dto;
    const student = await this.db.student.getById(id);

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    const studentAssignments = await this.db.student.getAssignments(id);

    return studentAssignments;
  };

  getStudentGrades = async (dto: StudentID) => {
    const { id } = dto;
    const student = await this.db.student.getById(id);

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    const studentAssignments = await this.db.student.getGrades(id);

    return studentAssignments;
  };
}
