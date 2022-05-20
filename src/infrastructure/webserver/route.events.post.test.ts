import "reflect-metadata";
import supertest from "supertest";
import { container } from "tsyringe";
import { EventValidator } from "../../domain/entities/EventValidator";
import { InMemoryEventsRepository } from "../repositories/InMemoryEventsRepository";
import { InMemoryJwtAuthentication } from "../services/InMemoryJwtAuthentication";
import { Application } from "./Application";

const mockLogger = {
  log: jest.fn(),
};

const jwt = "validJwt";

const eventsRepository: InMemoryEventsRepository =
  new InMemoryEventsRepository();

describe("POST /events", () => {
  beforeAll(() => {
    // Use in memory db to run integration tests
    container.register("IEventsRepository", {
      useValue: eventsRepository,
    });

    // Use fake logger to run integration tests
    container.register("ILogger", {
      useValue: mockLogger,
    });

    container.register("IJwtAuthentication", {
      useClass: InMemoryJwtAuthentication,
    });

    container.register("IEventValidator", {
      useClass: EventValidator,
    });
  });

  beforeEach(() => {
    eventsRepository.reset();
  });

  describe("given a valid name, a valid description and a valid jwt", () => {
    const validBody = {
      name: "Name",
      description: "Description",
      jwt,
    };

    test("should save the username and the password in the repository", async () => {
      const application = new Application();

      // First add an event
      const addEventResponse = await supertest(
        application.getExpressApplication()
      )
        .post("/events")
        .send(validBody);
      const addedEventId = addEventResponse.body.eventId;

      // Try to retrieve the event using its id
      const getEventResponse = await supertest(
        application.getExpressApplication()
      )
        .get(`/events/${addedEventId}`)
        .send({
          jwt,
        });

      expect(getEventResponse.body.name).toBe("Name");
      expect(getEventResponse.body.description).toBe("Description");
      expect(getEventResponse.body.id).toBe(addedEventId);
    });

    test("should respond with an id", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .post("/events")
        .send(validBody);
      expect(response.body.eventId).not.toBeUndefined();
      expect(response.body.eventId.length).toBeGreaterThan(0);
    });

    test("should respond with a 200 status code", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .post("/events")
        .send(validBody);
      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content type header", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .post("/events")
        .send(validBody);
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("when the name is incorrect", () => {
    const invalidBodies = [
      { description: "Description", jwt },
      { name: undefined, description: "Description", jwt },
      { name: "", description: "Description", jwt },
    ];

    test("should respond with 400", async () => {
      const application = new Application();
      for (const body of invalidBodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test("should respond with an error in json", async () => {
      const application = new Application();
      for (const body of invalidBodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.body).not.toBeUndefined();
        // TODO implement missing error mapper
        expect(response.body.error).toBe(
          `The parameter 'eventName' is missing.`
        );
      }
    });

    test("should specify json in the content type header", async () => {
      const application = new Application();
      for (const body of invalidBodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      }
    });
  });

  describe("when the description is incorrect", () => {
    const invalidBodies = [
      { name: "Name", jwt: "validJwt" },
      { name: "Name", description: undefined, jwt: "validJwt" },
      { name: "Name", description: "", jwt: "validJwt" },
    ];

    test("should respond with 400", async () => {
      const application = new Application();
      for (const body of invalidBodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test("should respond with an error in json", async () => {
      const application = new Application();
      for (const body of invalidBodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.body).not.toBeUndefined();
        // TODO implement missing error mapper
        expect(response.body.error).toBe(
          `The parameter 'eventDescription' is missing.`
        );
      }
    });

    test("should specify json in the content type header", async () => {
      const application = new Application();
      for (const body of invalidBodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.headers["content-type"]).toEqual(
          expect.stringContaining("json")
        );
      }
    });
  });
});

// Missing tests :
// - wrong jwt
// - missing jwt
// - invalid name
// - invalid description
