import { NextFunction, Request, Response, Router } from "express";
import { Firestore } from "@google-cloud/firestore";
import BookingLogic from "../logic/bookingLogic";

const firestore = new Firestore();
const router = Router();
const bookingLogic = new BookingLogic();


firestore.settings({
  ignoreUndefinedProperties: true
});

router.get("/:eventID", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const eventID = req.params.eventID;
    const bookings = await bookingLogic.getBookingsByEventID(eventID)
    res.json(bookings)
  } catch (error) {
    next(error);
  }
})

export = router
