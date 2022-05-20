import { container, Lifecycle } from "tsyringe";
import { EventValidator } from "../../domain/entities/EventValidator";
import { InMemoryEventsRepository } from "../../infrastructure/repositories/InMemoryEventsRepository";
import { ConsoleLogger } from "../../infrastructure/services/ConsoleLogger";
import { InMemoryJwtAuthentication } from "../../infrastructure/services/InMemoryJwtAuthentication";

export const configureDi = (): void => {
  container.register(
    "IEventsRepository",
    { useClass: InMemoryEventsRepository },
    { lifecycle: Lifecycle.Singleton }
  );

  container.register("ILogger", {
    useClass: ConsoleLogger,
  });

  container.register("IJwtAuthentication", {
    useClass: InMemoryJwtAuthentication,
  });

  container.register("IEventValidator", {
    useClass: EventValidator,
  });
};
