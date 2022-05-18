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
  });

  beforeEach(() => {
    eventsRepository.reset();
  });

  describe("given a name and a description", () => {
    test("should save the username and the password in the repository", async () => {
      const application = new Application();

      // First add an event
      const addEventResponse = await supertest(
        application.getExpressApplication()
      )
        .post("/events")
        .send({
          name: "Name",
          description: "Description",
        });
      const addedEventId = addEventResponse.body.eventId;

      // Try to retrieve the event using its id
      const getEventResponse = await supertest(
        application.getExpressApplication()
      )
        .get(`/events/${addedEventId}`)
        .send();

      expect(getEventResponse.body.name).toBe("Name");
      expect(getEventResponse.body.description).toBe("Description");
      expect(getEventResponse.body.id).toBe(addedEventId);
    });

    test("should respond with an id", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .post("/events")
        .send({
          name: "Name",
          description: "Description",
        });
      expect(response.body.eventId).not.toBeUndefined();
      expect(response.body.eventId.length).toBeGreaterThan(0);
    });

    test("should respond with a 200 status code", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .post("/events")
        .send({
          name: "Name",
          description: "Description",
        });
      expect(response.statusCode).toBe(200);
    });

    test("should specify json in the content type header", async () => {
      const application = new Application();
      const response = await supertest(application.getExpressApplication())
        .post("/events")
        .send({
          name: "Name",
          description: "Description",
        });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("when the name is incorrect", () => {
    test("should respond with 400", async () => {
      const application = new Application();
      const bodies = [
        { description: "Description" },
        { name: undefined, description: "Description" },
        { name: "", description: "Description" },
      ];
      for (const body of bodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test("should respond with an error in json", async () => {
      const application = new Application();
      const bodies = [
        { description: "Description" },
        { name: undefined, description: "Description" },
        { name: "", description: "Description" },
      ];
      for (const body of bodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).toBe(`Name cannot be undefined or empty`);
      }
    });

    test("should specify json in the content type header", async () => {
      const application = new Application();
      const bodies = [
        { description: "Description" },
        { name: undefined, description: "Description" },
        { name: "", description: "Description" },
      ];
      for (const body of bodies) {
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
    test("should respond with 400", async () => {
      const application = new Application();
      const bodies = [
        { name: "Name" },
        { name: "Name", description: undefined },
        { name: "Name", description: "" },
      ];
      for (const body of bodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.statusCode).toBe(400);
      }
    });

    test("should respond with an error in json", async () => {
      const application = new Application();
      const bodies = [
        { name: "Name" },
        { name: "Name", description: undefined },
        { name: "Name", description: "" },
      ];
      for (const body of bodies) {
        const response = await supertest(application.getExpressApplication())
          .post("/events")
          .send(body);
        expect(response.body).not.toBeUndefined();
        expect(response.body.error).toBe(
          `Description cannot be undefined or empty`
        );
      }
    });

    test("should specify json in the content type header", async () => {
      const application = new Application();
      const bodies = [
        { name: "Name" },
        { name: "Name", description: undefined },
        { name: "Name", description: "" },
      ];
      for (const body of bodies) {
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
