import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
  Wait,
} from "testcontainers";
import { ServicesLauncher } from "../ServicesLauncher";

export class ServicesLauncherWithDockerCompose implements ServicesLauncher {
  private readonly dockerComposeFolderPath: string;
  private readonly dockerComposeFileName: string;
  private environment: StartedDockerComposeEnvironment;

  constructor(dockerComposeFolderPath: string, dockerComposeFileName: string) {
    this.dockerComposeFolderPath = dockerComposeFolderPath;
    this.dockerComposeFileName = dockerComposeFileName;
  }

  async start(): Promise<void> {
    console.log("mounting docker compose...");

    this.environment = await new DockerComposeEnvironment(
      this.dockerComposeFolderPath,
      this.dockerComposeFileName
    )
      .withWaitStrategy(
        "api_1",
        Wait.forLogMessage("server is listening on 3000")
      )
      .up();

    /*
    const apiContainer = this.environment.getContainer("api_1");
    (await apiContainer.logs())
      .on("data", (line) => console.log(line))
      .on("err", (line) => console.error(line))
      .on("end", () => console.log("Stream closed"));
      */

    console.log("docker compose mounted");
  }

  apiUrl(): string {
    const apiContainer = this.environment.getContainer("api_1");
    const apiUrl = `http://${apiContainer.getHost()}:${apiContainer.getMappedPort(
      3000
    )}`;
    return apiUrl;
  }

  async stop(): Promise<void> {
    console.log("downing docker compose");
    await this.environment.down({ timeout: 10000 }); // ms
    console.log("docker compose down");
  }
}
