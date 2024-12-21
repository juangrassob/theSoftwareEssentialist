import { prisma } from "../database";
import { AssignmentNotFoundExeption } from "../shared/exeptions";

export class AssignmentService {
  constructor() {}

  async getAssignment(id: string) {
    const assignment = await prisma.assignment.findUnique({
      include: {
        class: true,
        studentTasks: true,
      },
      where: {
        id,
      },
    });

    if (!assignment) {
      throw new AssignmentNotFoundExeption(id);
    }
  }

  async createAssignment(classId: string, title: string) {
    const assignment = await prisma.assignment.create({
      data: {
        classId,
        title,
      },
    });

    return assignment;
  }

  async submitAssignment(id: string) {
    // check if student assignment exists
    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        id,
      },
    });

    if (!studentAssignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    const studentAssignmentUpdated = await prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        status: "submitted",
      },
    });

    return studentAssignmentUpdated;
  }

  async gradeAssignment(id: string, grade: string) {
    // check if student assignment exists
    const studentAssignment = await prisma.studentAssignment.findUnique({
      where: {
        id,
      },
    });

    if (!studentAssignment) {
      throw new AssignmentNotFoundExeption(id);
    }

    const studentAssignmentUpdated = await prisma.studentAssignment.update({
      where: {
        id,
      },
      data: {
        grade,
      },
    });

    return studentAssignmentUpdated;
  }
}
