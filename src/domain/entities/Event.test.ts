import { InvalidEventDescriptionError } from "../errors/InvalidEventDescriptionError";
import { InvalidEventNameError } from "../errors/InvalidEventNameError";
import { Event, EventDictionnary } from "./Event";

export class TestEventDictionnary implements EventDictionnary {
  getForbiddenWords(): Array<string> {
    return ["Forbidden", "AnotherUndesired"];
  }
}

describe("Event", () => {
  const testDictionnary = new TestEventDictionnary();

  test("should make an event with a valid name and a valid description", () => {
    expect(
      () => new Event("Name", "Description", testDictionnary)
    ).not.toThrow();
    expect(
      () => new Event("OtherName", "OtherDescription", testDictionnary)
    ).not.toThrow();
  });

  test("should throw with invalid name", () => {
    for (const forbiddenWord of testDictionnary.getForbiddenWords()) {
      try {
        // eslint-disable-next-line no-new
        new Event(forbiddenWord, "Description", testDictionnary);
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
    for (const forbiddenWord of testDictionnary.getForbiddenWords()) {
      try {
        // eslint-disable-next-line no-new
        new Event("Name", forbiddenWord, testDictionnary);
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
