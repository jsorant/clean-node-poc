import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { IEventValidator } from "../entities/EventValidator";
import { InvalidJwtError } from "../errors/InvalidJwtError";
import { MissingParameterError } from "../errors/MissingParameterError";
import { EventId, IEventsRepository } from "../ports/IEventsRepository";
import { IJWTAuthentication, JwtBase64 } from "../ports/IJWTAuthentication";
import { ILogger } from "../ports/ILogger";

@injectable()
export class AddEvent {
  private eventsRepository: IEventsRepository;
  private jwtAuthentication: IJWTAuthentication;
  private logger: ILogger;
  private eventValidator: IEventValidator;

  public constructor(
    @inject("IEventsRepository")
    eventsRepository: IEventsRepository,
    @inject("IJwtAuthentication")
    jwtAuthentication: IJWTAuthentication,
    @inject("ILogger")
    logger: ILogger,
    @inject("IEventValidator")
    eventValidator: IEventValidator
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
    // Validate inputs
    if (!eventName || eventName === "") {
      throw new MissingParameterError("eventName");
    }
    if (!eventDescription || eventDescription === "") {
      throw new MissingParameterError("eventDescription");
    }
    if (!jwt || jwt === "") {
      throw new MissingParameterError("jwt");
    }

    // Verify jwt
    if (!this.jwtAuthentication.verify(jwt)) {
      throw new InvalidJwtError("Invalid JWT");
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
