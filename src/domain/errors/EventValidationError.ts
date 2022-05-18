export class InvalidEventDescriptionError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidEventDescriptionError";
  }
}
