import { ILogger } from "../../domain/ports/ILogger";

export class ConsoleLogger implements ILogger {
  log(message: string): void {
    console.log("ConsoleLogger: ", message);
  }
}
