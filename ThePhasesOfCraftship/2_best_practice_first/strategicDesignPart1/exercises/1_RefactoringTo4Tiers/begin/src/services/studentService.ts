import { prisma } from "../database";
import { StudentNotFoundExeption } from "../shared/exeptions";
export class StudentService {
  constructor() {}

  async createStudent(name: string) {
    const student = await prisma.student.create({
      data: {
        name,
      },
    });

    return student;
  }

  async getStudents() {
    const students = await prisma.student.findMany({
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return students;
  }

  async getStudent(id: string) {
    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
    });

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    return student;
  }

  async getStudentAssigments(id: string) {
    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    const studentAssignments = await prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
      },
      include: {
        assignment: true,
      },
    });

    return studentAssignments;
  }

  async getStudentGrades(id: string) {
    // check if student exists
    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      throw new StudentNotFoundExeption(id);
    }

    const studentAssignments = await prisma.studentAssignment.findMany({
      where: {
        studentId: id,
        status: "submitted",
        grade: {
          not: null,
        },
      },
      include: {
        assignment: true,
      },
    });

    return studentAssignments;
  }
}
