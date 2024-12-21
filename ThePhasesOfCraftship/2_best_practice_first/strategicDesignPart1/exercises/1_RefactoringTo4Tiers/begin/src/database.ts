import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();
//
// export { prisma }

export interface StudentPersistance {
  save(name: string): Promise<any>;
  getAll(): Promise<any>;
  getById(id: string): Promise<any>;
  getAssignments(id: string): Promise<any>;
  getGrades(id: string): Promise<any>;
}
export interface ClassPersistance {}
export interface AssignmentPersistance {}

export class Database {
  private prisma: PrismaClient;
  public student: StudentPersistance;
  public class: ClassPersistance;
  public assignment: AssignmentPersistance;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.student = this.buildStudentPersistance();
    this.class = this.buildClassPersistance;
    this.assignment = this.buildAssignmentPersistance;
  }

  private buildStudentPersistance(): StudentPersistance {
    return {
      save: this.saveStudent,
      getAll: this.getAllStudents,
      getById: this.getStudentById,
      getAssignments: this.getStudentAssignments,
      getGrades: this.getStudentGrades,
    };
  }
  private buildClassPersistance(): ClassPersistance {
    return {};
  }
  private buildAssignmentPersistance(): AssignmentPersistance {
    return {};
  }

  private async saveStudent(name: string) {
    const student = await this.prisma.student.create({
      data: {
        name,
      },
    });

    return student;
  }

  private async getAllStudents() {
    const students = await this.prisma.student.findMany({
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

  private async getStudentById(id: string) {
    const student = await this.prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        classes: true,
        assignments: true,
        reportCards: true,
      },
    });

    return student;
  }

  private async getStudentAssignments(id: string) {
    const studentAssignments = await this.prisma.studentAssignment.findMany({
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
  private async getStudentGrades(id: string) {
    const studentGrades = this.prisma.studentAssignment.findMany({
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

    return studentGrades;
  }
}

