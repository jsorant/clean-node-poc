import { GenericContainer, StartedTestContainer, Wait } from "testcontainers";
import { ServicesLauncher } from "../ServicesLauncher";

export class ServicesLauncherWithGenericContainers implements ServicesLauncher {
  private apiContainer: StartedTestContainer;

  async start(): Promise<void> {
    console.log("mounting generic container...");

    this.apiContainer = await new GenericContainer("node:14")
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

    (await this.apiContainer.logs())
      .on("data", (line) => console.log(line))
      .on("err", (line) => console.error(line))
      .on("end", () => console.log("Stream closed"));

    console.log("generic container mounted");
  }

  apiUrl(): string {
    const apiUrl = `http://${this.apiContainer.getHost()}:${this.apiContainer.getMappedPort(
      3000
    )}`;
    return apiUrl;
  }

  async stop(): Promise<void> {
    console.log("stopping generic container");
    await this.apiContainer.stop();
    console.log("generic container stopped");
  }
}
