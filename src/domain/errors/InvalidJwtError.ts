export class InvalidJwtError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidJwtError";
  }
}
