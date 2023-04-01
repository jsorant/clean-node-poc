import axios from "axios";
import { ServicesLauncher } from "./ServicesLauncher/ServicesLauncher";
import { ServicesLauncherProxy } from "./ServicesLauncher/ServicesLauncherProxy";

describe("Application", () => {
  jest.setTimeout(60000); // in milliseconds

  let servicesLauncher: ServicesLauncher;
  let apiUrl: string;

  beforeAll(async () => {
    servicesLauncher = new ServicesLauncherProxy();
    await servicesLauncher.start();
    apiUrl = servicesLauncher.apiUrl();
  });

  it("should adds new events", async () => {
    const response1 = await axios.post(`${apiUrl}/events`, {
      name: "First event",
      description: "This is the first event",
    });
    expect(response1.data).toEqual({ id: 0 });

    const response2 = await axios.post(`${apiUrl}/events`, {
      name: "Second event",
      description: "This is the second event",
    });
    expect(response2.data).toEqual({ id: 1 });
  });
  /*
  it("gets existing todos", async () => {
    const response1 = await axios.get(`${apiUrl}/events/0`);
    expect(response1.data).toEqual({
      id: 0,
      name: "First event",
      description: "This is the first event",
    });

    const response2 = await axios.get(`${apiUrl}/events/1`);
    expect(response2.data).toEqual({
      id: 1,
      name: "Second event",
      description: "This is the second event",
    });
  });
*/
  afterAll(async () => {
    await servicesLauncher.stop();
  });
});
