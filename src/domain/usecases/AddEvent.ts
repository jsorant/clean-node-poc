import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { IEventValidator } from "../entities/EventValidator";
import { MissingParameterError } from "../errors/MissingParameterError";
import { EventId, IEventsRepository } from "../ports/IEventsRepository";
import { ILogger } from "../ports/ILogger";

@injectable()
export class AddEvent {
  private eventsRepository: IEventsRepository;
  private logger: ILogger;
  private eventValidator: IEventValidator;

  public constructor(
    @inject("IEventsRepository")
    eventsRepository: IEventsRepository,
    @inject("ILogger")
    logger: ILogger,
    @inject("IEventValidator")
    eventValidator: IEventValidator
  ) {
    this.eventsRepository = eventsRepository;
    this.logger = logger;
    this.eventValidator = eventValidator;
  }

  // Throws EventValidationError
  async execute(eventName: string, eventDescription: string): Promise<EventId> {
    this.validateInputs(eventName, eventDescription);
    this.validateNameAndDescription(eventName, eventDescription);
    const id: EventId = await this.addEvent(eventName, eventDescription);
    this.logOperation(eventName, eventDescription, id);
    return id;
  }

  private validateNameAndDescription(
    eventName: string,
    eventDescription: string
  ) {
    this.eventValidator.ensureIsValidOrThrow(eventName, eventDescription);
  }

  private async addEvent(
    eventName: string,
    eventDescription: string
  ): Promise<string> {
    return await this.eventsRepository.addEvent(eventName, eventDescription);
  }

  private logOperation(
    eventName: string,
    eventDescription: string,
    id: string
  ) {
    this.logger.log(
      `Event added with name=${eventName}, description=${eventDescription}. Generated id is ${id}`
    );
  }

  private validateInputs(eventName: string, eventDescription: string) {
    if (!eventName || eventName === "") {
      throw new MissingParameterError("eventName");
    }
    if (!eventDescription || eventDescription === "") {
      throw new MissingParameterError("eventDescription");
    }
  }
}
