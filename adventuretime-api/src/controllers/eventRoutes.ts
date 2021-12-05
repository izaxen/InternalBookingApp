import { NextFunction, Request, Response, Router } from "express";
import { Firestore } from "@google-cloud/firestore";
import EventLogic from "../logic/eventLogic";
import BookingLogic from "../logic/bookingLogic";
import Event, { EventWithCreatedDate, EventWithoutCreatedDate } from "../models/event";

const db = new Firestore();
const router: Router = Router();
const eventLogic: EventLogic = new EventLogic();
const bookingLogic: BookingLogic = new BookingLogic();
const bookRef = db.collection('bookings');
const eventRef = db.collection('event');

db.settings({
  ignoreUndefinedProperties: true
});

router.get("/getUnAvailableBedsDetailed", async (req: Request, res: Response, next: NextFunction) => {
  const beds = await bookingLogic.filterDetailedBookings(req.query)
  res.json(beds)

})

router.get("/getUnavailableBeds", async (req: Request, res: Response, next: NextFunction) => {
  const beds = await bookingLogic.filterBookings(req.query)
  res.json(beds);
});


router.get('/getEvents', async (req: Request, res: Response) => {
  const events = await eventLogic.getEvents();
  res.status(200).json(events);
  res.send();
})

router.get('/getEventsDTO', async (req: Request, res: Response) => {
  const dtoList = await eventLogic.getEventsDTO();
  res.send(dtoList);
})

router.post('/addEvent', async (req: Request, res: Response, next: NextFunction) => {

  try {
    const eventWithCreatedDate = req.body as EventWithCreatedDate;
    const newEvent = new Event(eventWithCreatedDate)
    await eventRef.doc().create({ ...newEvent });

    const respond = await eventLogic.setBedIDforEvent(newEvent);
    res.json(respond);
  } catch (error) {
    next(error);
  }
})

router.put('/updateEvent', async (req: Request, res: Response) => {
  const newEvent = req.body as EventWithoutCreatedDate;
  await eventLogic.updateEvent(req.body.eventDocID, newEvent)
  res.json("done");
});

router.delete('/deleteEvent', async (req: Request, res: Response) => {
  await eventRef.doc(req.body.eventID).delete();
  res.json("done");
});

router.post('/getSelectedEvent', async (req: Request, res: Response) => {
  let event = await eventLogic.getEventByID(req.body.selectedEvent)
  res.json(event);
})


export = router