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

  addEvent(eventName: string, eventDescription: string): EventId {
    const id = this.generateId();
    this.events.push({
      id,
      name: eventName,
      description: eventDescription,
    });
    return id;
  }

  getAllEvents(): Array<EventItem> {
    // TODO: improve this with deep copy
    return this.events;
  }

  getEvent(eventId: EventId): EventItem {
    let result: EventItem;
    this.events.forEach((item: EventItem) => {
      if (item.id === eventId) {
        result = item;
      }
    });
    return result;
  }
}
