import axios from "axios";
import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";

describe("Application", () => {
  jest.setTimeout(60000); // in milliseconds

  let apiContainer: StartedTestContainer;
  let apiUrl: string;

  beforeAll(async () => {
    apiContainer = await new GenericContainer("node:14")
      .withExposedPorts(3000)
      .withBindMounts([
        {
          source: "/Users/jso/dev/clean-node-poc",
          target: "/app",
          mode: "ro",
        },
      ])
      .withWorkingDir("/app")
      .withCommand(["npm", "run", "dev:inmemory"])
      .withWaitStrategy(Wait.forLogMessage("server is listening on 3000"))
      .start();

    (await apiContainer.logs())
      .on("data", (line) => console.log(line))
      .on("err", (line) => console.error(line))
      .on("end", () => console.log("Stream closed"));

    apiUrl = `http://${apiContainer.getHost()}:${apiContainer.getMappedPort(
      3000
    )}`;
  });

  it("should adds new events", async () => {
    console.log("Wait...");
    await new Promise((resolve) => setTimeout(resolve, 10000));
    console.log("RUN");

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
    await apiContainer.stop();
  });
});
