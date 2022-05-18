import { EventValidator } from "./EventValidator";

describe("ensureIsValidOrThrow function", () => {
  test("should not throw with valid name and description", () => {
    const eventValidator: EventValidator = new EventValidator();
    expect(() =>
      eventValidator.ensureIsValidOrThrow("Name", "Description")
    ).not.toThrow();
    expect(() =>
      eventValidator.ensureIsValidOrThrow("OtherName", "OtherDescription")
    ).not.toThrow();
  });

  test("should throw with empty name", () => {
    const eventValidator: EventValidator = new EventValidator();
    expect(() =>
      eventValidator.ensureIsValidOrThrow("", "Description")
    ).toThrowError("Name cannot be undefined or empty");
  });

  test("should throw with undefined name", () => {
    const eventValidator: EventValidator = new EventValidator();
    expect(() =>
      eventValidator.ensureIsValidOrThrow(undefined, "Description")
    ).toThrowError("Name cannot be undefined or empty");
  });

  test("should throw with empty description", () => {
    const eventValidator: EventValidator = new EventValidator();
    expect(() => eventValidator.ensureIsValidOrThrow("Name", "")).toThrowError(
      "Description cannot be undefined or empty"
    );
  });

  test("should throw with undefined description", () => {
    const eventValidator: EventValidator = new EventValidator();
    expect(() =>
      eventValidator.ensureIsValidOrThrow("Name", undefined)
    ).toThrowError("Description cannot be undefined or empty");
  });
});
