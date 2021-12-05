import { Timestamp } from "@google-cloud/firestore";

export default class Event {

  country: string;
  city: string;
  startDate: string;
  endDate: string;
  destinationDescription: string;
  deadLine: string;
  eventDescription: string;
  accommodations: []
  images: [];
  customFields: [];
  links: [];
  surveys: [];
  created: number;


  constructor(event: EventWithCreatedDate) {
    this.country = event.country;
    this.city = event.city;
    this.startDate = event.startDate;
    this.endDate = event.endDate;
    this.destinationDescription = event.destinationDescription;
    this.deadLine = event.deadLine;
    this.eventDescription = event.eventDescription;
    this.accommodations = event.accommodations
    this.images = event.images
    this.customFields = event.customFields
    this.links = event.links
    this.surveys = event.surveys
    this.created = Date.now();
  }
}


export interface EventWithoutCreatedDate {
  country: string;
  city: string;
  startDate: string;
  endDate: string;
  destinationDescription: string;
  deadLine: string;
  eventDescription: string;
  accommodations: [];
  images: [];
  customFields: [];
  links: [];
  surveys: [];
}

export interface EventWithCreatedDate extends EventWithoutCreatedDate {
  created: string,
}