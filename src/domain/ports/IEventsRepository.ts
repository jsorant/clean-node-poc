export type EventId = string;

export interface EventItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
}

export interface IEventsRepository {
  addEvent(eventName: string, eventDescription: string): Promise<EventId>;
  getEvent(eventId: EventId): Promise<EventItem>;
}
