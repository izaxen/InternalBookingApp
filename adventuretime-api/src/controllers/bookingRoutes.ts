import { NextFunction, Request, Response, Router } from "express";
import BookingLogic from "../logic/bookingLogic";
import authenticate from "../middlewares/authentication";
import parseIdentity from "../middlewares/parseIdentity";
import { FilterBooking, IBookingBase } from "../models/booking";

const router = Router();
const bookingLogic = new BookingLogic();

router.use(authenticate);
router.use(parseIdentity);

router.get("/my-bookings", async (req: Request, res: Response, next: NextFunction) => {
  const myBookings = await bookingLogic.getMyBookings(req.identity)
  res.json(myBookings)
});

router.get("/deleteMyBooking", async (req: Request, res: Response,) => {
  const responseDelete = await bookingLogic.deleteMyBooking(req.query.id as any, req.identity);
  res.json(responseDelete)
})

router.post("/validateNewBooking", async (req: Request, res: Response, next: NextFunction) => {
  const validateBooking = await bookingLogic.validateNewBooking(req.body as FilterBooking, req.body as IBookingBase)
  res.json(validateBooking);
});

router.post("/validateBookingList", async (req: Request, res: Response, next: NextFunction) => {
const validateBookingList = await bookingLogic.validateBookingList(req.body);
  res.json(validateBookingList);
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  const bookingCreated = await bookingLogic.createNewBooking(req.body as IBookingBase)
  res.json(bookingCreated);
});

router.get("/getAllBookings", async (req: Request, res: Response) => {
  const allBookings = await bookingLogic.getAllBookings()
  return res.json(allBookings);
})

export = router