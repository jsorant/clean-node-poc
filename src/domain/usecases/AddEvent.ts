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
    // Validate inputs
    if (!eventName || eventName === "") {
      throw new MissingParameterError("eventName");
    }
    if (!eventDescription || eventDescription === "") {
      throw new MissingParameterError("eventDescription");
    }

    // Validate name & description
    this.eventValidator.ensureIsValidOrThrow(eventName, eventDescription);

    // Add
    const id: EventId = await this.eventsRepository.addEvent(
      eventName,
      eventDescription
    );

    // Log operation
    this.logger.log(
      `Event added with name=${eventName}, description=${eventDescription}. Generated id is ${id}`
    );
    return id;
  }
}
