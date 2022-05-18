import { NextFunction, Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { InvalidEventDescriptionError } from "../../domain/errors/EventValidationError";
import { InvalidEventNameError } from "../../domain/errors/InvalidEventNameError";
import { EventItem } from "../../domain/ports/IEventsRepository";
import { AddEvent } from "../../domain/usecases/AddEvent";
import { GetEvent } from "../../domain/usecases/GetEvent";

@autoInjectable()
export class EventsController {
  private addEvent: AddEvent;
  private getEvent: GetEvent;

  public constructor(addEvent: AddEvent, getEvent: GetEvent) {
    this.addEvent = addEvent;
    this.getEvent = getEvent;
  }

  addNewEvent(req: Request, res: Response, next: NextFunction): void {
    try {
      // Call use case
      const { name, description } = req.body;
      const id = this.addEvent.execute(name, description);

      // Format response
      res.status(200);
      res.json({
        eventId: id,
      });
    } catch (err: any) {
      if (
        err instanceof InvalidEventNameError ||
        err instanceof InvalidEventDescriptionError
      ) {
        res.status(400).send({ error: err.message });
      } else {
        next(err);
      }
    }
  }

  getEventById(req: Request, res: Response, next: NextFunction): void {
    try {
      const eventId = req.params.id;
      // Call use case
      const event: EventItem = this.getEvent.execute(eventId);

      // Format response
      if (event) {
        res.status(200);
        res.json(event);
      } else {
        res.status(404).send({ error: `No event found with id: ${eventId}.` });
      }
    } catch (err: any) {
      next(err);
    }
  }
}
