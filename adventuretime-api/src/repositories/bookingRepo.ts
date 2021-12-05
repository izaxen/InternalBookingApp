import { Firestore } from "@google-cloud/firestore";
import { IBooking } from "../models/booking"

export default class BookingRepo {

  private db = new Firestore();
  private bookingRef = this.db.collection('bookings');

  constructor() {
    this.firestoreSettings()
  }

  private firestoreSettings() {
    this.db.settings({
      ignoreUndefinedProperties: true
    });
  }

  public async getBookingsByEventID(eventID) {
    const snapshot = await this.bookingRef.where('eventID', '==', eventID).get()
    let bookingsList: IBooking[] = []
    snapshot.forEach(doc => {
      bookingsList.push(doc.data() as IBooking)
    })
    return bookingsList;
  }

  public async getMyBookings(id: string) {
    const snapshot = await this.bookingRef.where('email', '==', id).get();
    let myBookings: IBooking[] = [];
    snapshot.forEach(doc => {
      const bookingID: string = doc.id
      myBookings.push({ ...doc.data() as IBooking, id: bookingID })
    })
    return myBookings;
  }

  public async getSingleBooking(bookingID: string) {
    const booking = await this.bookingRef.doc(bookingID).get()
    return booking.data() as IBooking
  }

  public async deleteMyBooking(bookingId: string) {
    return this.bookingRef.doc(bookingId).delete()
  } 
 
  public async getAllBookings() {
    const allBookings: IBooking[] = [];
    const snapshot = await this.bookingRef.get();
    snapshot.forEach(doc => {
      allBookings.push({ ...doc.data() as IBooking, id: doc.id })
    });
    return allBookings;
  }

  public async createANewBooking(newBooking) {
    this.bookingRef.doc().create({ ...newBooking });
  }
}
