import { NextFunction, Request, Response } from "express";

const missingRoute = (_: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found");
  res.status(404);

  next(error);
};

export = missingRoute;