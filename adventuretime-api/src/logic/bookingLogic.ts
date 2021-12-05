import BookingRepo from "../repositories/bookingRepo";
import { checkBookingDeletion, validUserDeletionBooking } from '../controllers/bookingDataValidation'
import EventRepo from "../repositories/eventRepo";
import Booking, { FilterBooking, IBookingBase } from "../models/booking";


export default class BookingLogic {
  private bookingRepo = new BookingRepo();
  private eventRepo = new EventRepo();
  private sharedBeds: string[] = [];
  constructor() {
  }

  async createNewBooking(newBooking: IBookingBase) {
    this.bookingRepo.createANewBooking(new Booking(newBooking));
  }

  async validateBookingList(unCheckList: any) {
    let bookingIsValid: boolean = true;
    const tasks = unCheckList.map(async (element) => {
      return this.validateNewBooking(element as FilterBooking, element as IBookingBase)
    })
    await Promise.all(tasks).then((values) => {
      if (values.includes(false)) {
        bookingIsValid = false;
      }
    });

    if (bookingIsValid) {
      unCheckList.forEach(element => {
        this.bookingRepo.createANewBooking(new Booking(element));
      });
    }
    return bookingIsValid;

  }

  async validateNewBooking(filterBooking, newBooking) {
    let bookingIsValid: boolean = true;
    const newList: string[] = await this.filterBookings(filterBooking);
    const tasks = newList.map(async (element) => {
      if (element === newBooking.selectedBedID) {
        bookingIsValid = false;
      }
    });

    await Promise.all(tasks)
    if (bookingIsValid) {
      this.createNewBooking(newBooking as IBookingBase)
    }
    return bookingIsValid
  }

  async getAllBookings() {
    return this.bookingRepo.getAllBookings()
  }

  async getMyBookings(id: string) {
    const myBookings = await this.bookingRepo.getMyBookings(id);
    myBookings.sort((date1, date2) => new Date(date1.startDate).getTime() - new Date(date2.startDate).getTime())
    return myBookings;
  }

  async deleteMyBooking(id: any, identity: string) {
    const validDeletionList: string[] = checkBookingDeletion(id);
    if (!validDeletionList) { return "No bookings deleted" }

    validDeletionList.forEach(async element => {
      if (await validUserDeletionBooking(element, identity)) {
        await this.bookingRepo.deleteMyBooking(element);
      }
    });
    return "Bookings deleted";
  }

  async getBookingsByEventID(eventID) {
    return this.bookingRepo.getBookingsByEventID(eventID);
  }



  async filterBookings(filterQuery) {

    let unavailableBeds: any = [];
    let unAvailableBedsShared: string[] = [];

    const requestedStartDate: Date = new Date(filterQuery.startDate as string)
    const requestedEndDate: Date = new Date(filterQuery.endDate as string)
    const eventID: string = filterQuery.eventID as string;
    const bookings = await this.getBookingsByEventID(eventID)
    await this.checkAccommodations(eventID)

    const tasks = bookings.map((doc) => {
      let existingStartDate = new Date(doc.startDate)
      let existingEndDate = new Date(doc.endDate)
      existingEndDate.setDate(existingEndDate.getDate() - 1)

     /* if ((existingStartDate >= requestedStartDate && existingStartDate <= requestedEndDate)
        ||
        (existingEndDate >= requestedStartDate && existingEndDate <= requestedEndDate)
        || (requestedStartDate >= existingStartDate && requestedEndDate <= existingEndDate)) */
      if ((existingEndDate >= requestedStartDate && existingEndDate <= requestedEndDate)
        || (requestedStartDate >= existingStartDate && requestedEndDate <= existingEndDate))
      {

        unavailableBeds.push(doc.selectedBedID)

        if (this.sharedBeds.includes(doc.selectedBedID)) {
          const res = unavailableBeds.filter((x) => {
            return x === doc.selectedBedID;
          })
          if (res.length > 1 || res.length == 0) {
            unAvailableBedsShared.push(doc.selectedBedID)
          }
        }
        else {
          unAvailableBedsShared.push(doc.selectedBedID)
        }
      }
    })
    await Promise.all(tasks);

    return unAvailableBedsShared;
  }

  async filterDetailedBookings(filterQuery) {
    let unavailableBeds: any = [];
    let unAvailableBedsShared: string[] = [];

    const requestedStartDate: Date = new Date(filterQuery.startDate as string)
    const requestedEndDate: Date = new Date(filterQuery.endDate as string)
    const eventID: string = filterQuery.eventID as string;
    const bookings = await this.getBookingsByEventID(eventID)

    await this.checkAccommodations(eventID)

    bookings.forEach((doc) => {

      let existingStartDate = new Date(doc.startDate)
      let existingEndDate = new Date(doc.endDate)

      if ((existingStartDate >= requestedStartDate && existingStartDate <= requestedEndDate)
        ||
        (existingEndDate >= requestedStartDate && existingEndDate <= requestedEndDate)
        || (requestedStartDate >= existingStartDate && requestedEndDate <= existingEndDate)) {

        for (let index = 0; index < this.countDaysInEvent(existingStartDate, existingEndDate); index++) {
          let item: string = doc.selectedBedID + this.getNewDate(index, existingStartDate)

          unavailableBeds.push(item)
          if (this.controlSharedBeds(doc.selectedBedID, unavailableBeds, item)) {
            unAvailableBedsShared.push(item)
          }
        }
      }
    },

    )
    return unAvailableBedsShared;
  }

  countDaysInEvent(startDate, endDate) {
    let date1 = new Date(startDate);
    let date2 = new Date(endDate);
    let difference = date2.getTime() - date1.getTime();
    const date: number = Math.ceil(difference / (1000 * 3600 * 24))
    return date;
  }

  getNewDate(days: number, startDate: Date) {
    var futureDate = new Date(startDate);
    futureDate.setDate(futureDate.getDate() + days);
    let dateString: string = futureDate.getDate() + "/" + (futureDate.getMonth() + 1)

    return dateString;
  }

  async checkAccommodations(eventID: string) {
    const event = await this.eventRepo.getEvent(eventID);
    const eveAcco = event?.accommodations

    eveAcco.forEach(element => {
      this.checkrooms(element.rooms)
    });
  }

  checkrooms(room: any) {
    room.forEach(element => {
      this.checkBeds(element.beds);
    });

  }
  checkBeds(beds: any) {
    beds.forEach(element => {
      if (element.isShareable) {
        if (!this.sharedBeds.includes(element.bedID)) {
          this.sharedBeds.push(element.bedID)
        }
      }
    });
  }
  controlSharedBeds(bedID: string, unAvailableBeds: [], newBed: string) {
    if (this.sharedBeds.includes(bedID)) {
      const res = unAvailableBeds.filter((x) => {
        return x === newBed;
      })
      return res.length > 1
    }
    return true;
  }
}
