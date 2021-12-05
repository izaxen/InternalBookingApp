export default class Booking {

  email: string;
  eventID: string;
  startDate: string;
  endDate: string;
  selectedBedID: string;
  additionalInfo: {};
  groupID: string;
  selectedRoom: string;
  selectedAccommodation: string;
  created: Date;



  constructor(booking: IBookingBase) {
    this.email = booking.email;
    this.eventID = booking.eventID;
    this.startDate = booking.startDate;
    this.endDate = booking.endDate;
    this.selectedBedID = booking.selectedBedID;
    this.additionalInfo = booking.additionalInfo;
    this.groupID = booking.groupID;
    this.selectedRoom = booking.selectedRoom;
    this.selectedAccommodation = booking.selectedAccommodation;
    this.created = new Date();
  }

}


export interface IBookingBase {
  email: string;
  eventID: string;
  startDate: string;
  endDate: string;
  selectedBedID: string;
  additionalInfo: {};
  groupID: string;
  selectedRoom: string;
  selectedAccommodation: string;
}

export interface IBooking extends IBookingBase {
  id: string,
}

export interface DeleteBooking {
  id: string
}

export interface FilterBooking{
  startDate: string;
  endDate: string;
  eventID:string
}