import {
  EventId,
  EventItem,
  IEventsRepository,
} from "../../domain/ports/IEventsRepository";

// Class for test purpose
export class InMemoryEventsRepository implements IEventsRepository {
  private events: Array<EventItem> = [];
  private counter: number = 0;

  private generateId(): EventId {
    const id: EventId = this.counter.toString();
    this.counter++;
    return id;
  }

  reset(): void {
    this.events = [];
  }

  async addEvent(
    eventName: string,
    eventDescription: string
  ): Promise<EventId> {
    const id: string = this.generateId();
    this.events.push({
      id,
      name: eventName,
      description: eventDescription,
    });
    return id;
  }

  getAllEvents(): Array<EventItem> {
    return [...this.events];
  }

  async getEvent(eventId: EventId): Promise<EventItem> {
    const event = this.events.find((event) => event.id === eventId);
    // TODO what if event not found ?
    return event;
  }
}
