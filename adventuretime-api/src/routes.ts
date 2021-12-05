import { Application } from "express";
import httpsRedirect from "./middlewares/httpsRedirect";
import handleError from "./middlewares/handleError";
import missingRoute from "./middlewares/missingRoute";
import basic from "./controllers/basicRoutes";
import authentication from "./controllers/authenticationRoutes";
import booking from "./controllers/bookingRoutes";
import event from "./controllers/eventRoutes";
import openBookingRoutes from "./controllers/openBookingRoutes";

export = (app: Application): void => {
  // HTTPS redirect
  app.use(httpsRedirect);

  // Routes

  app.use("/authentication", authentication);
  app.use("/booking", booking)
  app.use("/event", event)
  app.use("/openBookingRoutes", openBookingRoutes)
  app.use("/", basic);

  // Error handling
  app.use(missingRoute);
  app.use(handleError);
};