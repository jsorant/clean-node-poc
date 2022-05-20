export class EventNotFoundError extends Error {
  constructor(public readonly eventId: string) {
    super(`Event with id '${eventId}' not found.`);
    this.name = "EventNotFoundError";
  }
}
