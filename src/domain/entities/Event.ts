import { InvalidEventDescriptionError } from "../errors/InvalidEventDescriptionError";
import { InvalidEventNameError } from "../errors/InvalidEventNameError";

export interface EventDictionnary {
  getForbiddenWords(): Array<string>;
}

export class Event {
  private name: string;
  private description: string;
  private dictionnary: EventDictionnary;

  constructor(
    name: string,
    description: string,
    dictionnary: EventDictionnary
  ) {
    this.name = name;
    this.description = description;
    this.dictionnary = dictionnary;
    this.ensureIsValidOrThrow();
  }

  private ensureIsValidOrThrow(): void {
    this.dictionnary.getForbiddenWords().forEach((forbiddenWord) => {
      this.ensureNameIsValid(forbiddenWord);
      this.ensureDescriptionIsValid(forbiddenWord);
    });
  }

  private ensureDescriptionIsValid(forbiddenWord: string) {
    if (this.description.includes(forbiddenWord)) {
      throw new InvalidEventDescriptionError(forbiddenWord);
    }
  }

  private ensureNameIsValid(forbiddenWord: string) {
    if (this.name.includes(forbiddenWord)) {
      throw new InvalidEventNameError(forbiddenWord);
    }
  }
}
