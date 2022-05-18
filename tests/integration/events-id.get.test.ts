import "reflect-metadata";
import supertest from "supertest";
import { container } from "tsyringe";
import { InMemoryEventsRepository } from "../../src/infrastructure/repositories/InMemoryEventsRepository";
import { Application } from "../../src/infrastructure/webserver/Application";

const mockLogger = {
  log: jest.fn(),
};

const eventsRepository: InMemoryEventsRepository =
  new InMemoryEventsRepository();

let initialEventIdInRepository;
const initialEventNameInRepository: string = "EventName";
const initialEventDescriptionInRepository: string = "EventDescription";

describe("Get /events/:id", () => {
  beforeAll(() => {
    // Use in memory db to run integration tests
    container.register("IEventsRepository", {
      useValue: eventsRepository,
    });

    // Use fake logger to run integration tests
    container.register("ILogger", {
      useValue: mockLogger,
    });
  });

  beforeEach(() => {
    eventsRepository.reset();
    initialEventIdInRepository = eventsRepository.addEvent(
      initialEventNameInRepository,
      initialEventDescriptionInRepository
    );
  });

  describe("given an id", () => {
    test("should respond with and object that has a name, a description and an id", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .get(`/events/${initialEventIdInRepository}`)
        .send();

      expect(response.body.name).toBe(initialEventNameInRepository);
      expect(response.body.description).toBe(
        initialEventDescriptionInRepository
      );
      expect(response.body.id).toBe(initialEventIdInRepository);
    });

    test("should respond with a 200 status code", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .get(`/events/${initialEventIdInRepository}`)
        .send();

      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content type header", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .get(`/events/${initialEventIdInRepository}`)
        .send();

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("when the id is incorrect", () => {
    test("should respond with 404 if id does not refer to an existing event", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .get(`/events/${initialEventIdInRepository}-unexisting`)
        .send();

      expect(response.statusCode).toBe(404);
    });

    test("should respond with an error in json", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .get(`/events/${initialEventIdInRepository}-unexisting`)
        .send();

      expect(response.body).not.toBeUndefined();
      expect(response.body.error).toBe(
        `No event found with id: ${initialEventIdInRepository}-unexisting.`
      );
    });

    test("should specify json in the content type header", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .get(`/events/${initialEventIdInRepository}-unexisting`)
        .send();

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
});
