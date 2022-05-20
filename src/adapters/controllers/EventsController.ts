import { NextFunction, Request, Response } from "express";
import { autoInjectable } from "tsyringe";
import { EventNotFoundError } from "../../domain/errors/EventNotFoundError";
import { InvalidEventDescriptionError } from "../../domain/errors/InvalidEventDescriptionError";
import { InvalidEventNameError } from "../../domain/errors/InvalidEventNameError";
import { InvalidJwtError } from "../../domain/errors/InvalidJwtError";
import { MissingParameterError } from "../../domain/errors/MissingParameterError";
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

  async addNewEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Call use case
      const { name, description, jwt } = req.body;
      const id = await this.addEvent.execute(name, description, jwt);

      // Format response
      res.status(200);
      res.json({
        eventId: id,
      });
    } catch (err: any) {
      // TODO improve this with error mapping
      if (
        err instanceof MissingParameterError ||
        err instanceof InvalidEventNameError ||
        err instanceof InvalidEventDescriptionError
      ) {
        res.status(400).send({ error: err.message });
      } else if (err instanceof InvalidJwtError) {
        res.status(401).send({ error: err.message });
      } else {
        next(err);
      }
    }
  }

  async getEventById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const jwt = req.body.jwt;
      const eventId = req.params.id;
      // Call use case
      const event: EventItem = await this.getEvent.execute(eventId, jwt);
      // Format response
      res.status(200);
      res.json(event);
    } catch (err: any) {
      // TODO improve this with error mapping
      if (err instanceof InvalidJwtError) {
        res.status(401).send({ error: err.message });
      } else if (err instanceof EventNotFoundError) {
        res.status(404).send({ error: err.message });
      } else {
        next(err);
      }
    }
  }
}
