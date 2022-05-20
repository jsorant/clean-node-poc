export class MissingParameterError extends Error {
  constructor(public readonly parameterName: string) {
    super(`The parameter '${parameterName}' is missing.`);
    this.name = "MissingParameterError";
  }
}
