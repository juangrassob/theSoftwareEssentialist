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

  createClass = async (dto: CreateClassDTO) => {
    const { name } = dto;
    const cls = await this.db.class.save(name);

    return cls;
  };

  getClassAssignments = async (dto: ClassID) => {
    const { id } = dto;
    const cls = await this.db.class.getById(id);

    if (!cls) {
      throw new ClassNotFoundExeption(id);
    }

    const assignments = await this.db.class.getAssignments(id);

    return assignments;
  };

  enrollStudent = async (dto: EnrollStudentDTO) => {
    const { studentId, classId } = dto;
    const student = await this.db.student.getById(studentId);

    if (!student) {
      throw new StudentNotFoundExeption(studentId);
    }

    // check if class exists
    const cls = await this.db.class.getById(classId);

    if (!cls) {
      throw new ClassNotFoundExeption(classId);
    }

    // check if student is already enrolled in class
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
  };
}
