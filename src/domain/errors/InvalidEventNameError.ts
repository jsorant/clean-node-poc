export class InvalidEventNameError extends Error {
  constructor(public readonly forbiddenWord) {
    super(`Name cannot contain the forbidden words: ${forbiddenWord}`);
    this.name = "InvalidEventNameError";
  }
}
