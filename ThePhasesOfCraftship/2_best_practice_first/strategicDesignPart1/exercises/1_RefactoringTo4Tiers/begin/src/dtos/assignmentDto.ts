import { InvalidRequestBodyException } from "../shared/exeptions";
import { isMissingKeys, isUUID } from "../shared/helpers";

export class CreateAssignmentDTO {
  public classId: string;
  public title: string;

  constructor(classId: string, title: string) {
    this.classId = classId;
    this.title = title;
  }

  static fromRequest(body: unknown) {
    const requiredKeys = ["classId", "title"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { classId, title } = body as { classId: string; title: string };

    if (!isUUID(classId)) {
      throw new InvalidRequestBodyException(["classId"]);
    }

    return new CreateAssignmentDTO(classId, title);
  }
}

export class SubmitAssignmentDTO {
  public id: string;

  constructor(id: string) {
    this.id = id;
  }

  static fromRequest(body: unknown) {
    const requiredKeys = ["id"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id } = body as { id: string };

    if (!isUUID(id)) {
      throw new InvalidRequestBodyException(["id"]);
    }

    return new SubmitAssignmentDTO(id);
  }
}

export class GradeAssignmentDTO {
  public id: string;
  public grade: string;

  constructor(id: string, grade: string) {
    this.id = id;
    this.grade = grade;
  }

  static fromRequest(body: unknown) {
    const requiredKeys = ["id", "grade"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { id, grade } = body as { id: string; grade: string };

    if (!isUUID(id)) {
      throw new InvalidRequestBodyException(["id"]);
    }

    if (!["A", "B", "C", "D"].includes(grade)) {
      throw new InvalidRequestBodyException(["grade"]);
    }

    return new GradeAssignmentDTO(id, grade);
  }
}

export class AssignmentID {
  constructor(public id: string) {}

  static fromRequestParams(params: unknown) {
    const areParamsInvalid =
      !params || typeof params !== "object" || "id" in params === false;

    if (areParamsInvalid) {
      throw new InvalidRequestBodyException(["id"]);
    }

    const { id } = params as { id: string };

    if (!isUUID(id)) {
      throw new InvalidRequestBodyException(["id"]);
    }

    return new AssignmentID(id);
  }
}
