import { NextFunction, Request, Response, Router } from "express";
import { EventsController } from "../../../adapters/controllers/EventsController";

export const makeEventsRouter = (
  eventsController: EventsController
): Router => {
  const eventsRouter: Router = Router();

  // Workaround as using commented version do not keep eventsController alive...
  // eventsRouter.post("/", eventsController.addNewEvent);
  eventsRouter.post(
    "/",
    async (req: Request, res: Response, next: NextFunction) => {
      await eventsController.addNewEvent(req, res, next);
    }
  );

  // Workaround as using commented version do not keep eventsController alive...
  // eventsRouter.get("/:id", eventsController.getEvent);
  eventsRouter.get(
    "/:id",
    async (req: Request, res: Response, next: NextFunction) => {
      await eventsController.getEventById(req, res, next);
    }
  );

  return eventsRouter;
};
