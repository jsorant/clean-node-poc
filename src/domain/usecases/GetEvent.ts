import "reflect-metadata";
import { inject, injectable } from "tsyringe";
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
    // Get
    const event: EventItem = await this.eventsRepository.getEvent(eventId);

    // Log operation
    if (event) {
      this.logger.log(
        `Event retrieved from id=${eventId}: name=${event.name}, description=${event.description}`
      );
    } else {
      this.logger.log(`No event found with id=${eventId}`);
    }

    return event;
  }
}
