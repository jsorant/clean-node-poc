import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { EventValidator } from "../entities/EventValidator";
import { InvalidJwtError } from "../errors/InvalidJwtError";
import { EventId, IEventsRepository } from "../ports/IEventsRepository";
import { IJWTAuthentication, JwtBase64 } from "../ports/IJWTAuthentication";
import { ILogger } from "../ports/ILogger";

@injectable()
export class AddEvent {
  private eventsRepository: IEventsRepository;
  private jwtAuthentication: IJWTAuthentication;
  private logger: ILogger;
  private eventValidator: EventValidator;

  public constructor(
    @inject("IEventsRepository")
    eventsRepository: IEventsRepository,
    @inject("IJwtAuthentication")
    jwtAuthentication: IJWTAuthentication,
    @inject("ILogger")
    logger: ILogger,
    eventValidator: EventValidator
  ) {
    this.eventsRepository = eventsRepository;
    this.jwtAuthentication = jwtAuthentication;
    this.logger = logger;
    this.eventValidator = eventValidator;
  }

  // Throws EventValidationError
  async execute(
    eventName: string,
    eventDescription: string,
    jwt: JwtBase64
  ): Promise<EventId> {
    // Verify jwt
    if (!this.jwtAuthentication.verify(jwt)) {
      throw new InvalidJwtError("Invalid JWT");
    }

    // Validate
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
