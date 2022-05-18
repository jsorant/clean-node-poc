import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { EventValidator } from "../entities/EventValidator";
import { EventId, IEventsRepository } from "../ports/IEventsRepository";
import { ILogger } from "../ports/ILogger";

@injectable()
export class AddEvent {
  private eventsRepository: IEventsRepository;
  private logger: ILogger;
  private eventValidator: EventValidator;

  public constructor(
    @inject("IEventsRepository")
    eventsRepository: IEventsRepository,
    @inject("ILogger")
    logger: ILogger,
    eventValidator: EventValidator
  ) {
    this.eventsRepository = eventsRepository;
    this.logger = logger;
    this.eventValidator = eventValidator;
  }

  // Throws EventValidationError
  execute(eventName: string, eventDescription: string): EventId {
    // Validate
    this.eventValidator.ensureIsValidOrThrow(eventName, eventDescription);

    // Add
    const id: EventId = this.eventsRepository.addEvent(
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
