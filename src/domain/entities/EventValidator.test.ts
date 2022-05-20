import { InvalidEventDescriptionError } from "../errors/InvalidEventDescriptionError";
import { InvalidEventNameError } from "../errors/InvalidEventNameError";
import { EventValidator } from "./EventValidator";

const forbiddenWords: Array<string> = ["Forbidden", "AnotherUndesired"];

describe("ensureIsValidOrThrow function", () => {
  test("should not throw with valid name and description", () => {
    const eventValidator: EventValidator = new EventValidator(forbiddenWords);
    expect(() =>
      eventValidator.ensureIsValidOrThrow("Name", "Description")
    ).not.toThrow();
    expect(() =>
      eventValidator.ensureIsValidOrThrow("OtherName", "OtherDescription")
    ).not.toThrow();
  });

  test("should throw with invalid name", () => {
    const eventValidator: EventValidator = new EventValidator(forbiddenWords);
    for (const forbiddenWord of forbiddenWords) {
      try {
        eventValidator.ensureIsValidOrThrow(forbiddenWord, "Description");
      } catch (err: any) {
        expect(err instanceof InvalidEventNameError).toBeTruthy();
        expect(err.message).toBe(
          `Name cannot contain the forbidden words: ${forbiddenWord}`
        );
        expect((err as InvalidEventNameError).forbiddenWord).toBe(
          forbiddenWord
        );
      }
    }
  });

  test("should throw with invalid description", () => {
    const eventValidator: EventValidator = new EventValidator(forbiddenWords);
    for (const forbiddenWord of forbiddenWords) {
      try {
        eventValidator.ensureIsValidOrThrow("Name", forbiddenWord);
      } catch (err: any) {
        expect(err instanceof InvalidEventDescriptionError).toBeTruthy();
        expect(err.message).toBe(
          `Description cannot contain the forbidden words: ${forbiddenWord}`
        );
        expect((err as InvalidEventDescriptionError).forbiddenWord).toBe(
          forbiddenWord
        );
      }
    }
  });
});
