export class StudentNotFoundExeption extends Error {
  constructor(id: string) {
    super(`Student with ${id} was not found.`);
  }
}
