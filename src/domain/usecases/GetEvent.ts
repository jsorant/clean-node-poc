import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { EventNotFoundError } from "../errors/EventNotFoundError";
import { InvalidJwtError } from "../errors/InvalidJwtError";
import {
  EventId,
  EventItem,
  IEventsRepository,
} from "../ports/IEventsRepository";
import { IJWTAuthentication, JwtBase64 } from "../ports/IJWTAuthentication";
import { ILogger } from "../ports/ILogger";

@injectable()
export class GetEvent {
  private eventsRepository: IEventsRepository;
  private jwtAuthentication: IJWTAuthentication;
  private logger: ILogger;

  public constructor(
    @inject("IEventsRepository")
    eventsRepository: IEventsRepository,
    @inject("IJwtAuthentication")
    jwtAuthentication: IJWTAuthentication,
    @inject("ILogger")
    logger: ILogger
  ) {
    this.eventsRepository = eventsRepository;
    this.jwtAuthentication = jwtAuthentication;
    this.logger = logger;
  }

  async execute(eventId: EventId, jwt: JwtBase64): Promise<EventItem> {
    // Verify jwt
    if (!this.jwtAuthentication.verify(jwt)) {
      throw new InvalidJwtError("Invalid JWT");
    }

    // Get
    const event: EventItem = await this.eventsRepository.getEvent(eventId);
    if (!event) {
      throw new EventNotFoundError(eventId);
    }

    // Log operation
    this.logger.log(
      `Event retrieved from id=${eventId}: name=${event.name}, description=${event.description}`
    );

    return event;
  }
}
