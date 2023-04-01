import { ServicesLauncherWithDockerCompose } from "./Implementations/ServicesLauncherWithDockerCompose";
import { ServicesLauncherWithGenericContainers } from "./Implementations/ServicesLauncherWithGenericContainers";
import { ServicesLauncher } from "./ServicesLauncher";

export class ServicesLauncherProxy implements ServicesLauncher {
  private readonly launcher: ServicesLauncher;

  constructor() {
    switch (process.env.DOCKER_STRATEGY) {
      case "compose-mysql":
        console.log("Docker compose with MySQL database");
        this.launcher = new ServicesLauncherWithDockerCompose(
          "./",
          "docker-compose.yml"
        );
        break;
      case "compose-inmemory":
        console.log("Docker compose with InMemory database");
        this.launcher = new ServicesLauncherWithDockerCompose(
          "./",
          "docker-compose-inmemory.yml"
        );
        break;
      default:
        console.log("Generic container with InMemory database");
        this.launcher = new ServicesLauncherWithGenericContainers();
        break;
    }
  }

  async start(): Promise<void> {
    await this.launcher.start();
  }

  apiUrl(): string {
    return this.launcher.apiUrl();
  }

  async stop(): Promise<void> {
    await this.launcher.stop();
  }
}
