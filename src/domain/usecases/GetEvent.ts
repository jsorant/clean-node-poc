import "reflect-metadata";
import { inject, injectable } from "tsyringe";
import { EventNotFoundError } from "../errors/EventNotFoundError";
import {
  EventId,
  EventItem,
  IEventsRepository,
} from "../ports/IEventsRepository";
import { ILogger } from "../ports/ILogger";

@injectable()
export class GetEvent {
  private eventsRepository: IEventsRepository;
  private logger: ILogger;

  public constructor(
    @inject("IEventsRepository")
    eventsRepository: IEventsRepository,
    @inject("ILogger")
    logger: ILogger
  ) {
    this.eventsRepository = eventsRepository;
    this.logger = logger;
  }

  async execute(eventId: EventId): Promise<EventItem> {
    const event: EventItem = await this.getEventOrThrow(eventId);
    this.logOperation(eventId, event);
    return event;
  }

  private logOperation(eventId: string, event: EventItem) {
    this.logger.log(
      `Event retrieved from id=${eventId}: name=${event.name}, description=${event.description}`
    );
  }

  private async getEventOrThrow(eventId: string) {
    const event: EventItem = await this.eventsRepository.getEvent(eventId);
    if (!event) {
      throw new EventNotFoundError(eventId);
    }
    return event;
  }
}
