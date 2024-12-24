import { InvalidRequestBodyException } from "../shared/exeptions";
import { isMissingKeys, isUUID } from "../shared/helpers";

export class CreateClassDTO {
  public name: string;
  constructor(name: string) {
    this.name = name;
  }

  static fromRequest(body: unknown) {
    const requiredKeys = ["name"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { name } = body as { name: string };

    return new CreateClassDTO(name);
  }
}

export class EnrollStudentDTO {
  public studentId: string;
  public classId: string;
  constructor(studentId: string, classId: string) {
    this.studentId = studentId;
    this.classId = classId;
  }

  static fromRequest(body: unknown) {
    const requiredKeys = ["studentId", "classId"];
    const isRequestInvalid =
      !body || typeof body !== "object" || isMissingKeys(body, requiredKeys);

    if (isRequestInvalid) {
      throw new InvalidRequestBodyException(requiredKeys);
    }

    const { studentId, classId } = body as {
      studentId: string;
      classId: string;
    };

    if (!isUUID(studentId)) {
      throw new InvalidRequestBodyException(["studentId"]);
    }

    if (!isUUID(classId)) {
      throw new InvalidRequestBodyException(["classId"]);
    }

    return new EnrollStudentDTO(studentId, classId);
  }
}

export class ClassID {
  public id: string;
  constructor(id: string) {
    this.id = id;
  }

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

    return new ClassID(id);
  }
}
