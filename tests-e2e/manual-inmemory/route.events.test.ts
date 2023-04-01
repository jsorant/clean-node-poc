import axios from "axios";
import * as path from "path";
import { GenericContainer, StartedTestContainer } from "testcontainers";

describe("Application", () => {
  jest.setTimeout(60000); // in milliseconds

  let apiContainer: StartedTestContainer;
  let apiUrl: string;

  beforeAll(async () => {
    apiContainer = await new GenericContainer("node:14")
      .withExposedPorts(3000)
      .withBindMounts([
        {
          source: "/local/file.txt",
          target: "/remote/file.txt",
        },
        {
          source: "/local/dir",
          target: "/remote/dir",
          mode: "ro",
        },
      ])
      .withBindMount(path.join(__dirname, "./node_modules"), "/node_modules")
      .withBindMount(
        path.join(__dirname, "./babel.config.js"),
        "/babel.config.js"
      )
      .withBindMount(path.join(__dirname, "./package.json"), "/package.json")
      .withBindMount(path.join(__dirname, "./tsconfig.json"), "/tsconfig.json")
      .withBindMount(path.join(__dirname, "./src"), "/src")
      .withBindMount(path.join(__dirname, "./tests-e2e"), "/tests-e2e")
      .withCmd(["npm", "run", "dev:inmemory"])
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
