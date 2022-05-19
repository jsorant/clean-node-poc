import bodyParser from "body-parser";
import express, { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { EventsController } from "../../adapters/controllers/EventsController";
import { ErrorHandler } from "./ErrorHandler";
import { makeEventsRouter } from "./routes/EventsRouter";

export class Application {
  private expressApplication: express.Application;

  constructor() {
    this.expressApplication = express();

    // load middlewares
    this.expressApplication.use(bodyParser.urlencoded({ extended: true }));
    this.expressApplication.use(bodyParser.json());

    // load routes
    const eventsRouter = makeEventsRouter(container.resolve(EventsController));
    this.expressApplication.use("/events", eventsRouter);

    // TODO move this into status
    this.expressApplication.get(
      "/",
      (req: Request, res: Response, next: NextFunction) => {
        res.status(200);
        res.json({ message: "Server started" });
      }
    );

    // generic error handler
    this.expressApplication.use(ErrorHandler);
  }

  start(port: number): void {
    this.expressApplication.listen(port, () => {
      return console.log(`server is listening on ${port}`);
    });
  }

  getExpressApplication(): express.Application {
    return this.expressApplication;
  }
}
