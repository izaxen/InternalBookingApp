import { NextFunction, Response, Request } from "express";
import logger from "../logger";

const parseIdentity = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  
  const identity = req.user?.preferred_username?.toLowerCase();

  if (!identity) {
    const error = "Faulty identity token";
    logger.error(error);
    return res.status(401).json(error);
  }

  req.identity = identity;
  return next();
};

export = parseIdentity;