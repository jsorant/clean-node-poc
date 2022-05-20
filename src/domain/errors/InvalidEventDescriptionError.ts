export class InvalidEventDescriptionError extends Error {
  constructor(public readonly forbiddenWord) {
    super(`Description cannot contain the forbidden words: ${forbiddenWord}`);
    this.name = "InvalidEventDescriptionError";
  }
}
