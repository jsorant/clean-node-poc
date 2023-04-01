import axios from "axios";
import { ServicesLauncher } from "./ServicesLauncher/ServicesLauncher";
import { ServicesLauncherProxy } from "./ServicesLauncher/ServicesLauncherProxy";

describe("Application", () => {
  jest.setTimeout(60000); // in milliseconds

  let servicesLauncher: ServicesLauncher;
  let apiUrl: string;

  const event1Name = "First event";
  const event1Description = "This is the first event";
  let event1Id: string;
  const event2Name = "Second event";
  const event2Description = "This is the second event";
  let event2Id: string;

  beforeAll(async () => {
    servicesLauncher = new ServicesLauncherProxy();
    await servicesLauncher.start();
    apiUrl = servicesLauncher.apiUrl();
  });

  it("should add an event", async () => {
    const response = await axios.post(`${apiUrl}/events`, {
      name: event1Name,
      description: event1Description,
    });
    event1Id = response.data.eventId;
    expect(event1Id.length).toBeGreaterThan(0);
  });

  it("should add another event that has another id", async () => {
    const response = await axios.post(`${apiUrl}/events`, {
      name: event2Name,
      description: event2Description,
    });
    event2Id = response.data.eventId;
    expect(event2Id.length).toBeGreaterThan(0);

    expect(event1Id).not.toEqual(event2Id);
  });

  it("should retrieve an added event", async () => {
    const response = await axios.get(`${apiUrl}/events/${event1Id}`, {});
    expect(response.data.id).toEqual(event1Id);
    expect(response.data.name).toEqual(event1Name);
    expect(response.data.description).toEqual(event1Description);
  });

  it("should return an error when retrieving a non existing event", async () => {
    try {
      await axios.get(`${apiUrl}/events/non-existing`, {});
      throw new Error("Test failed: exception was expected");
    } catch (error) {
      console.log(error.response);
      expect(error.response.status).toEqual(404);
      expect(error.response.data.error).toEqual(
        "Event with id 'non-existing' not found."
      );
    }
  });

  afterAll(async () => {
    await servicesLauncher.stop();
  });
});
