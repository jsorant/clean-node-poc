import { container, Lifecycle } from "tsyringe";
import { EventValidator } from "../../domain/entities/EventValidator";
import { MySqlEventsRepository } from "../../infrastructure/repositories/MySqlEventsRepository";
import { ConsoleLogger } from "../../infrastructure/services/ConsoleLogger";

export const configureDi = async (): Promise<void> => {
  container.register(
    "IEventsRepository",
    { useClass: MySqlEventsRepository },
    { lifecycle: Lifecycle.Singleton }
  );

  container.register("ILogger", {
    useClass: ConsoleLogger,
  });

  container.register("IEventValidator", {
    useClass: EventValidator,
  });

  console.log("Initializing database...");
  const database: MySqlEventsRepository =
    container.resolve("IEventsRepository");
  await database.initialize();
  console.log("Database initialized.");
};
