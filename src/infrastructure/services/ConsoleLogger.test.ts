import { ConsoleLogger } from "./ConsoleLogger";

global.console.log = jest.fn();

describe("ConsoleLogger class", () => {
  test("should be able to log a message in the console", async () => {
    const message = "Message to log";
    const logger: ConsoleLogger = new ConsoleLogger();
    logger.log(message);

    expect(console.log).toBeCalledTimes(1);
    expect(console.log).toHaveBeenLastCalledWith("ConsoleLogger: ", message);
  });
});
