import axios from "axios";
import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
  Wait,
} from "testcontainers";

describe("Application", () => {
  jest.setTimeout(160000); // in milliseconds

  let apiUrl: string;
  let environment: StartedDockerComposeEnvironment;

  beforeAll(async () => {
    const composeFilePath = "./";
    const composeFile = "docker-compose.yml";

    console.log("mounting docker compose...");

    environment = await new DockerComposeEnvironment(
      composeFilePath,
      composeFile
    )
      .withWaitStrategy(
        "api_1",
        Wait.forLogMessage("server is listening on 3000")
      )
      .up();

    console.log("environment up");

    const apiContainer = environment.getContainer("api_1");

    console.log("api container retrieved");

    (await apiContainer.logs())
      .on("data", (line) => console.log(line))
      .on("err", (line) => console.error(line))
      .on("end", () => console.log("Stream closed"));

    console.log("streaming logs");

    apiUrl = `http://${apiContainer.getHost()}:${apiContainer.getMappedPort(
      3000
    )}`;

    console.log("api url : ", apiUrl);
  });

  it("should adds new events", async () => {
    console.log("RUN");

    const response1 = await axios.post(`${apiUrl}/events`, {
      name: "First event",
      description: "This is the first event",
    });
    console.log("response1", response1);
    expect(response1.data).toEqual({ id: 0 });

    const response2 = await axios.post(`${apiUrl}/events`, {
      name: "Second event",
      description: "This is the second event",
    });
    console.log("response2", response2);
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
    console.log("downing environment");
    await environment.down({ timeout: 10000 }); // ms
    console.log("environment down");
  });
});
