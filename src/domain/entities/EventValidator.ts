import { InvalidEventDescriptionError } from "../errors/InvalidEventDescriptionError";
import { InvalidEventNameError } from "../errors/InvalidEventNameError";

export interface IEventValidator {
  ensureIsValidOrThrow(name: string, description: string): void;
}

export class EventValidator implements IEventValidator {
  private forbiddenWords: Array<string>;
  // TODO improve this with a domain dictionnary (rules are part of the domain)
  constructor(forbiddenWords: Array<string> = ["forbidden"]) {
    this.forbiddenWords = forbiddenWords;
  }

  // Throw EventValidationError
  ensureIsValidOrThrow(name: string, description: string): void {
    for (const forbiddenWord of this.forbiddenWords) {
      if (name.includes(forbiddenWord)) {
        throw new InvalidEventNameError(forbiddenWord);
      }

      if (description.includes(forbiddenWord)) {
        throw new InvalidEventDescriptionError(forbiddenWord);
      }
    }
  }
}
