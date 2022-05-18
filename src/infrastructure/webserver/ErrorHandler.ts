import { NextFunction, Request, Response } from "express";

export const ErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO define ILogger and implement it as console.log
  console.log("=> Unexpected error: ");
  console.log(err);
  console.log("=====================");

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message });
};
