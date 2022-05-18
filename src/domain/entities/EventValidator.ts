import { InvalidEventDescriptionError } from "../errors/EventValidationError";
import { InvalidEventNameError } from "../errors/InvalidEventNameError";

export class EventValidator {
  // Throw EventValidationError
  ensureIsValidOrThrow(name: string, description: string): void {
    if (name === undefined || name.length === 0) {
      throw new InvalidEventNameError("Name cannot be undefined or empty");
    }
    if (description === undefined || description.length === 0) {
      throw new InvalidEventDescriptionError(
        "Description cannot be undefined or empty"
      );
    }
  }
}
