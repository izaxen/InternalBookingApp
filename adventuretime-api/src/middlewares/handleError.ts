import { NextFunction, Request, Response } from "express";
import logger from "../logger";

const handleError = (
  error: Error,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  logger.error(error.stack, "General Error");

  if (error instanceof SyntaxError) {
    return res
      .status(400)
      .send({ status: 400, message: "Body does not contain valid json." });
  }

  if (res.statusCode === 404) {
    return res
      .status(404)
      .send({ status: 404, message: "404, page not found." });
  }

  return res.status(500).send({
    status: 500,
    message: "500, something went wrong.",
    error: {
      name: error.name,
      message: error.message,
      trace: error.stack,
    },
  });
};

export = handleError;