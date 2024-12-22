import { Database } from "../database";
import { ClassID, CreateClassDTO, EnrollStudentDTO } from "../dtos/classDto";
import {
  ClassNotFoundExeption,
  StudentAlreadyEnrolledExeption,
  StudentNotFoundExeption,
} from "../shared/exeptions";

export class ClassService {
  private readonly db: Database;
  constructor(db: Database) {
    this.db = db;
  }

  async createClass(dto: CreateClassDTO) {
    const { name } = dto;
    const cls = this.db.class.save(name);

    return cls;
  }

  async getClassAssignments(dto: ClassID) {
    const { id } = dto;
    const cls = await this.db.class.getById(id);

    if (!cls) {
      throw new ClassNotFoundExeption(id);
    }

    const assignments = this.db.class.getAssignments(id);

    return assignments;
  }

  async enrollStudent(dto: EnrollStudentDTO) {
    const { studentId, classId } = dto;
    const student = await this.db.student.getById(studentId);

    if (!student) {
      throw new StudentNotFoundExeption(studentId);
    }

    // check if class exists
    const cls = this.db.class.getById(classId);

    if (!cls) {
      throw new ClassNotFoundExeption(classId);
    }

    // check if student is already unrolled in class
    const duplicatedClassEnrollment = await this.db.class.getEnrollment(
      classId,
      studentId
    );

    if (duplicatedClassEnrollment) {
      throw new StudentAlreadyEnrolledExeption(studentId, classId);
    }

    const classEnrollment = await this.db.class.saveEnrollment(
      classId,
      studentId
    );

    return classEnrollment;
  }
}
