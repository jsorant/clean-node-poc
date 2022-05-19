import axios from "axios";
import * as path from "path";
import "reflect-metadata";
import {
  GenericContainer,
  StartedNetwork,
  StartedTestContainer,
} from "testcontainers";

describe("Application", () => {
  jest.setTimeout(60000); // in milliseconds

  let mysqlContainer: StartedTestContainer;
  let apiContainer: StartedTestContainer;
  let network: StartedNetwork;
  let apiUrl: string;

  beforeAll(async () => {
    /*
    network = await new Network({
      name: "clean-node-poc-test-network",
    }).start();

    mysqlContainer = await new GenericContainer("mysql:8")
      .withName("test_mysql")
      .withExposedPorts(3306)
      .withEnv("MYSQL_ROOT_PASSWORD", "password")
      .withEnv("MYSQL_DATABASE", "test")
      .withNetworkMode(network.getName())
      .start();
*/
    apiContainer = await new GenericContainer("node:14")
      .withExposedPorts(3000)
      .withEnv("MYSQL_HOST", "test_mysql")
      .withEnv("MYSQL_PORT", "3306")
      .withEnv("MYSQL_USER", "root")
      .withEnv("MYSQL_DATABASE", "test")
      .withEnv("MYSQL_PASSWORD", "password")
      .withBindMount(path.join(__dirname, "./"), "/app")
      .withCmd(["npm", "run", "dev:inmemory"])
      /*.withHealthCheck({
        test: "curl -f http://localhost:3000 || exit 1",
        interval: 1000,
        timeout: 3000,
        retries: 5,
        startPeriod: 1000,
      })
      .withWaitStrategy(Wait.forHealthCheck())*/
      //.withNetworkMode(network.getName())
      .start();

    const apiLogs = await apiContainer.logs();
    apiLogs.on("data", (line) => console.log(line));
    apiLogs.on("err", (line) => console.error(line));

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
    await mysqlContainer.stop();
    await network.stop();
  });
});
