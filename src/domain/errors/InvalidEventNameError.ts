export class InvalidEventNameError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidEventNameError";
  }
}
