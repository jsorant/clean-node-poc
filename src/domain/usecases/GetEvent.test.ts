import { EventNotFoundError } from "../errors/EventNotFoundError";
import { EventItem } from "../ports/IEventsRepository";
import { GetEvent } from "./GetEvent";

const mockEventId = "EventIdentifier";
const mockEventName = "EventName";
const mockEventDescription = "EventDescription";

const mockEventsRepository = {
  addEvent: jest.fn(),
  getAllEvents: jest.fn(),
  getEvent: jest.fn(),
};

const mockLogger = {
  log: jest.fn(),
};

describe("GetEvent use case", () => {
  beforeEach(() => {
    mockEventsRepository.getEvent.mockReset();
    mockEventsRepository.getEvent.mockReturnValue({
      id: mockEventId,
      name: mockEventName,
      description: mockEventDescription,
    });

    mockLogger.log.mockReset();
  });

  test("should get an event from the event repository", async () => {
    const eventId = "eventId";
    const usecase: GetEvent = new GetEvent(mockEventsRepository, mockLogger);
    const event: EventItem = await usecase.execute(eventId);

    expect(mockEventsRepository.getEvent.mock.calls.length).toBe(1);
    expect(mockEventsRepository.getEvent.mock.calls[0][0]).toBe(eventId);
    expect(event.id).toBe(mockEventId);
    expect(event.name).toBe(mockEventName);
    expect(event.description).toBe(mockEventDescription);
  });

  test("should throw if the event is not in the event repository", async () => {
    mockEventsRepository.getEvent.mockReset();
    mockEventsRepository.getEvent.mockReturnValue(undefined);
    const eventId = "eventId";
    const usecase: GetEvent = new GetEvent(mockEventsRepository, mockLogger);

    try {
      await usecase.execute(eventId);
    } catch (err: any) {
      expect(err instanceof EventNotFoundError).toBeTruthy();
      expect(err.message).toBe(`Event with id '${eventId}' not found.`);
      expect((err as EventNotFoundError).eventId).toBe(eventId);
    }
  });

  test("should log name, description, id when retrieving an event", async () => {
    const eventId = "RequestId";
    const usecase: GetEvent = new GetEvent(mockEventsRepository, mockLogger);
    await usecase.execute(eventId);

    const logParameter = mockLogger.log.mock.calls[0][0];
    expect(mockLogger.log.mock.calls.length).toBe(1);
    expect(logParameter).toContain(eventId);
    expect(logParameter).toContain(mockEventName);
    expect(logParameter).toContain(mockEventDescription);
  });
});
