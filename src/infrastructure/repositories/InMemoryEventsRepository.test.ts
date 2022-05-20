import { EventId, EventItem } from "../../domain/ports/IEventsRepository";
import { InMemoryEventsRepository } from "./InMemoryEventsRepository";

describe("InMemoryEventsRepository class", () => {
  test("should be able to add an event", async () => {
    const items = [
      { name: "Name", description: "Description" },
      { name: "Tennis", description: "A one-day tennis tournament." },
      { name: "Karting", description: "A karting on next Sunday." },
    ];

    const eventsRepository: InMemoryEventsRepository =
      new InMemoryEventsRepository();

    for (let i = 0; i < items.length; i++) {
      await eventsRepository.addEvent(items[i].name, items[i].description);
    }

    const events = eventsRepository.getAllEvents();

    // We want to test that the repository has added the items but we do not care of the generated id.
    const eventsWithoutId: Array<any> = events.map((event: EventItem) => {
      return {
        name: event.name,
        description: event.description,
      };
    });

    items.forEach((item) => {
      expect(eventsWithoutId).toContainEqual(item);
    });

    expect(events.length).toBe(items.length);
  });

  test("should be able to add a duplicate", async () => {
    const items = [
      { name: "Name", description: "Description" },
      { name: "Tennis", description: "A one-day tennis tournament." },
      { name: "Tennis", description: "A one-day tennis tournament." },
    ];

    const eventsRepository: InMemoryEventsRepository =
      new InMemoryEventsRepository();

    for (let i = 0; i < items.length; i++) {
      await eventsRepository.addEvent(items[i].name, items[i].description);
    }

    const events = eventsRepository.getAllEvents();

    // We want to test that the repository has added the items but we do not care of the generated id.
    const eventsWithoutId: Array<any> = events.map((event: EventItem) => {
      return {
        name: event.name,
        description: event.description,
      };
    });

    items.forEach((item) => {
      expect(eventsWithoutId).toContainEqual(item);
    });

    expect(events.length).toBe(items.length);
  });

  test("should return an identifier when adding an event", async () => {
    const eventsRepository: InMemoryEventsRepository =
      new InMemoryEventsRepository();

    const id = await eventsRepository.addEvent("name", "description");

    expect(id.length).toBeGreaterThan(0);
  });

  test("should return unique identifiers when adding multiple events", async () => {
    const eventsRepository: InMemoryEventsRepository =
      new InMemoryEventsRepository();

    const loopCount: number = 20;
    const ids: Array<EventId> = [];
    for (let i = 0; i < loopCount; ++i) {
      const id = await eventsRepository.addEvent("name", "description");
      ids.push(id);
    }

    expect(ids.length).toBe(loopCount);
    // Function to check that array is unique.
    const isArrayUnique = (arr) =>
      Array.isArray(arr) && new Set(arr).size === arr.length;
    expect(isArrayUnique(ids)).toBeTruthy();
  });

  test("should be able to list events", async () => {
    const eventsRepository: InMemoryEventsRepository =
      new InMemoryEventsRepository();

    expect(eventsRepository.getAllEvents().length).toBe(0);

    const items = [
      { name: "Name", description: "Description" },
      { name: "Tennis", description: "A one-day tennis tournament." },
      { name: "Karting", description: "A karting on next Sunday." },
    ];
    for (let i = 0; i < items.length; i++) {
      await eventsRepository.addEvent(items[i].name, items[i].description);
    }

    const events = eventsRepository.getAllEvents();

    // TODO improve with deep copy
    // expect(eventsRepository.getAllEvents().length).toBe(3);
    // events.push({ id: "1", name: "name", description: "desc" });
    // expect(eventsRepository.getAllEvents().length).toBe(3);

    // We want to test that the repository has added the items but we do not care of the generated id.
    const eventsWithoutId: Array<any> = events.map((event: EventItem) => {
      return {
        name: event.name,
        description: event.description,
      };
    });

    items.forEach((item) => {
      expect(eventsWithoutId).toContainEqual(item);
    });

    expect(events.length).toBe(items.length);
  });

  test("should be able to get an event by id", async () => {
    const eventsRepository: InMemoryEventsRepository =
      new InMemoryEventsRepository();

    const id: EventId = await eventsRepository.addEvent("name", "description");

    const event: EventItem = await eventsRepository.getEvent(id);

    expect(event.name).toBe("name");
    expect(event.description).toBe("description");
  });

  test("should return undefined if trying to get an event by id which does not exist", async () => {
    const eventsRepository: InMemoryEventsRepository =
      new InMemoryEventsRepository();

    const id: EventId = "unexisting id";
    const event: EventItem = await eventsRepository.getEvent(id);

    expect(event).toBeUndefined();
  });
});
