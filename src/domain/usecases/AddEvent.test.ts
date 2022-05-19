import { AddEvent } from "./AddEvent";

const mockEventId = "EventIdentifier";
const mockJwt = "DummyJwt";

const mockEventsRepository = {
  addEvent: jest.fn(),
  getAllEvents: jest.fn(),
  getEvent: jest.fn(),
};

const mockJwtAuthentication = {
  verify: jest.fn(),
};

const mockEventValidator = {
  ensureIsValidOrThrow: jest.fn(),
};

const mockLogger = {
  log: jest.fn(),
};

describe("AddEvent use case", () => {
  beforeEach(() => {
    mockEventsRepository.addEvent.mockReset();
    mockEventsRepository.addEvent.mockReturnValue(mockEventId);

    mockJwtAuthentication.verify.mockReset();
    mockJwtAuthentication.verify.mockReturnValue(true);

    mockLogger.log.mockReset();

    mockEventValidator.ensureIsValidOrThrow.mockReset();
  });

  test("should add an event to the events repository", async () => {
    const usecase: AddEvent = new AddEvent(
      mockEventsRepository,
      mockJwtAuthentication,
      mockLogger,
      mockEventValidator
    );
    const commands = [
      { name: "Name1", description: "Description1" },
      { name: "Name2", description: "Description2" },
      { name: "Name3", description: "Description3" },
    ];
    for (let i = 0; i < commands.length; ++i) {
      mockEventsRepository.addEvent.mockReset();
      const name = commands[i].name;
      const description = commands[i].description;
      await usecase.execute(name, description, mockJwt);

      expect(mockEventsRepository.addEvent.mock.calls.length).toBe(1);
      expect(mockEventsRepository.addEvent.mock.calls[0][0]).toBe(name);
      expect(mockEventsRepository.addEvent.mock.calls[0][1]).toBe(description);
    }
  });

  test("should log the name, description, id when adding an event", async () => {
    const usecase: AddEvent = new AddEvent(
      mockEventsRepository,
      mockJwtAuthentication,
      mockLogger,
      mockEventValidator
    );
    await usecase.execute("name", "description", mockJwt);

    const logParameter = mockLogger.log.mock.calls[0][0];
    expect(mockLogger.log.mock.calls.length).toBe(1);
    expect(logParameter).toContain("name");
    expect(logParameter).toContain("description");
    expect(logParameter).toContain(mockEventId);
  });

  test("should validate the name and the description", async () => {
    const usecase: AddEvent = new AddEvent(
      mockEventsRepository,
      mockJwtAuthentication,
      mockLogger,
      mockEventValidator
    );
    await usecase.execute("name", "description", mockJwt);

    expect(mockEventValidator.ensureIsValidOrThrow.mock.calls.length).toBe(1);
    expect(mockEventValidator.ensureIsValidOrThrow.mock.calls[0][0]).toBe(
      "name"
    );
    expect(mockEventValidator.ensureIsValidOrThrow.mock.calls[0][1]).toBe(
      "description"
    );
  });

  test("should verify the jwt token", async () => {
    mockJwtAuthentication.verify.mockReturnValue(true);
    const usecase: AddEvent = new AddEvent(
      mockEventsRepository,
      mockJwtAuthentication,
      mockLogger,
      mockEventValidator
    );
    await usecase.execute("name", "description", mockJwt);

    expect(mockJwtAuthentication.verify.mock.calls.length).toBe(1);
    expect(mockJwtAuthentication.verify.mock.calls[0][0]).toBe(mockJwt);
  });

  test("should throw if the jwt token verification failed", async () => {
    mockJwtAuthentication.verify.mockReturnValue(false);
    const usecase: AddEvent = new AddEvent(
      mockEventsRepository,
      mockJwtAuthentication,
      mockLogger,
      mockEventValidator
    );
    expect(async () => {
      await usecase.execute("name", "description", mockJwt);
    }).toThrowError("InvalidJwtError");

    expect(mockJwtAuthentication.verify.mock.calls.length).toBe(1);
    expect(mockJwtAuthentication.verify.mock.calls[0][0]).toBe(mockJwt);
  });
});
