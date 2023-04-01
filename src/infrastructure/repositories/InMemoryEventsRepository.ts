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

  addEvent(eventName: string, eventDescription: string): Promise<EventId> {
    return new Promise((resolve, reject) => {
      const id = this.generateId();
      this.events.push({
        id,
        name: eventName,
        description: eventDescription,
      });
      resolve(id);
    });
  }

  getAllEvents(): Array<EventItem> {
    return [...this.events];
  }

  getEvent(eventId: EventId): Promise<EventItem> {
    return new Promise((resolve, reject) => {
      let result: EventItem;
      this.events.forEach((item: EventItem) => {
        if (item.id === eventId) {
          result = item;
        }
      });
      resolve(result);
    });
  }
}
