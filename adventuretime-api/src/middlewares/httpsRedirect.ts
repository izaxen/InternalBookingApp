import { NextFunction, Request, Response } from "express";

const httpsRedirect = (req: Request, res: Response, next: NextFunction) => {
  const isSecureRequest =
    req.secure || req.hostname === "localhost" || req.hostname === "127.0.0.1";

  if (isSecureRequest) {
    next();
  } else {
    res.redirect("https://" + req.headers.host + req.url);
  }
};

export = httpsRedirect;