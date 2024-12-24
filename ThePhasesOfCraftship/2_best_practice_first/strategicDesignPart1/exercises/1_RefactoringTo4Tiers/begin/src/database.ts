import { PrismaClient } from "@prisma/client";

export interface StudentPersistance {
  save(name: string): Promise<any>;
  getAll(): Promise<any>;
  getById(id: string): Promise<any>;
  getAssignments(id: string): Promise<any>;
  getGrades(id: string): Promise<any>;
}

export interface ClassPersistance {
  save(name: string): Promise<any>;
  getById(id: string): Promise<any>;
  getAssignments(id: string): Promise<any>;
  getEnrollment(classId: string, studentId: string): Promise<any>;
  saveEnrollment(classId: string, studentId: string): Promise<any>;
}

export interface AssignmentPersistance {
  save(classId: string, title: string): Promise<any>;
  getById(id: string): Promise<any>;
  submit(id: string): Promise<any>;
  grade(id: string, grade: string): Promise<any>;
}

export class Database {
  private prisma: PrismaClient;
  public student: StudentPersistance;
  public class: ClassPersistance;
  public assignment: AssignmentPersistance;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
    this.student = this.buildStudentPersistance();
    this.class = this.buildClassPersistance();
    this.assignment = this.buildAssignmentPersistance();
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
    return {
      save: this.saveClass,
      getById: this.getClassById,
      getAssignments: this.getClassAssignments,
      getEnrollment: this.getClassEnrollment,
      saveEnrollment: this.saveClassEnrollment,
    };
  }

  private buildAssignmentPersistance(): AssignmentPersistance {
    return {
      save: this.saveAssignment,
      getById: this.getAssignmentById,
      submit: this.submitAssignment,
      grade: this.gradeAssignment,
    };
  }

  private saveStudent = async (name: string) => {
    const student = await this.prisma.student.create({
      data: {
        name,
      },
    });

    return student;
  };

  private getAllStudents = async () => {
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
  };

  private getStudentById = async (id: string) => {
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
  };

  private getStudentAssignments = async (id: string) => {
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
  };

  private getStudentGrades = async (id: string) => {
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
  };

  private saveAssignment = async (classId: string, title: string) => {
    const assignment = await this.prisma.assignment.create({
      data: {
        classId,
        title,
      },
    });

    return assignment;
  };

  private getAssignmentById = async (id: string) => {
    const assignment = await this.prisma.assignment.findUnique({
      include: {
        class: true,
        studentTasks: true,
      },
      where: {
        id,
      },
    });

    return assignment;
  };

  private submitAssignment = async (id: string) => {
    const updatedAssignmnet = await this.prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        status: "submitted",
      },
    });

    return updatedAssignmnet;
  };

  private gradeAssignment = async (id: string, grade: string) => {
    const updatedAssignmnet = await this.prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        grade,
      },
    });

    return updatedAssignmnet;
  };

  private saveClass = async (name: string) => {
    const cls = await this.prisma.class.create({
      data: {
        name,
      },
    });

    return cls;
  };

  private getClassById = async (id: string) => {
    const cls = await this.prisma.class.findUnique({
      where: {
        id,
      },
    });

    return cls;
  };

  private getClassAssignments = async (id: string) => {
    const assignments = await this.prisma.assignment.findMany({
      where: {
        classId: id,
      },
      include: {
        class: true,
        studentTasks: true,
      },
    });

    return assignments;
  };

  private getClassEnrollment = async (classId: string, studentId: string) => {
    const enrollment = await this.prisma.classEnrollment.findFirst({
      where: {
        studentId,
        classId,
      },
    });

    return enrollment;
  };

  private saveClassEnrollment = async (classId: string, studentId: string) => {
    const enrollment = await this.prisma.classEnrollment.create({
      data: {
        studentId,
        classId,
      },
    });

    return enrollment;
  };
}
