export class InvalidRequestBodyException extends Error {
  constructor(fields: string[]) {
    super(`Missing fields: ${fields.join(", ")}`);
  }
}

export class StudentNotFoundExeption extends Error {
  constructor(id: string) {
    super(`Student with ${id} was not found.`);
  }
}

export class ClassNotFoundExeption extends Error {
  constructor(id: string) {
    super(`Class with ${id} was not found.`);
  }
}

export class StudentAlreadyEnrolledExeption extends Error {
  constructor(studentId: string, classId: string) {
    super(
      `The student ${studentId} is already enroller in the class ${classId}`
    );
  }
}

export class AssignmentNotFoundExeption extends Error {
  constructor(id: string) {
    super(`Assignment with ${id} was not found.`);
  }
}
