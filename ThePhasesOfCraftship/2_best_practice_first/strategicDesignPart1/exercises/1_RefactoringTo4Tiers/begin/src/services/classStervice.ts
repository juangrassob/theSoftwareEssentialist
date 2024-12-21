import { prisma } from "../database";
import {
  ClassNotFoundExeption,
  StudentAlreadyEnrolledExeption,
  StudentNotFoundExeption,
} from "../shared/exeptions";

export class ClassService {
  constructor() {}

  async createClass(name: string) {
    const cls = await prisma.class.create({
      data: {
        name,
      },
    });

    return cls;
  }

  async getClassAssignments(id: string) {
    const cls = await prisma.class.findUnique({
      where: {
        id,
      },
    });

    if (!cls) {
      throw new ClassNotFoundExeption(id);
    }

    const assignments = await prisma.assignment.findMany({
      where: {
        classId: id,
      },
      include: {
        class: true,
        studentTasks: true,
      },
    });

    return assignments;
  }

  async enrollStudent(studentId: string, classId: string) {
    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id: studentId,
      },
    });

    if (!student) {
      throw new StudentNotFoundExeption(studentId);
    }

    // check if class exists
    const cls = await prisma.class.findUnique({
      where: {
        id: classId,
      },
    });

    if (!cls) {
      throw new ClassNotFoundExeption(classId);
    }

    // check if student is already enrolled in class
    const duplicatedClassEnrollment = await prisma.classEnrollment.findFirst({
      where: {
        studentId,
        classId,
      },
    });

    if (duplicatedClassEnrollment) {
      throw new StudentAlreadyEnrolledExeption(studentId, classId);
    }

    const classEnrollment = await prisma.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });

    return classEnrollment;
  }
}
