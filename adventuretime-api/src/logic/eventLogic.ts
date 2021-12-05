import e from 'express';
import EventRepo from '../repositories/eventRepo'
import event, { EventWithoutCreatedDate } from "../models/event";

export default class EventLogic {

  eventRepo = new EventRepo();

  constructor() {

  }

  async getEvents() {
    return this.eventRepo.getEvents();
  }

  async getEventsDTO() {
    let list = await this.eventRepo.getEvents();
    const listDTO: object[] = [];
    list.forEach(element => {
      listDTO.push({
        country: element["country"],
        city: element["city"],
        id: element["id"],
      })
    });
    return listDTO
  }

  async setBedIDforEvent(newEvent: event) {

    if (newEvent.accommodations.length > 0) {
      let eventID = await this.getNewEventID(newEvent)

      // now i need to generate bedID after we have eventID
      let event = await this.eventRepo.getEvent(eventID);
      if (event) {
        for (let app = 0; app < event.accommodations.length; app++) {
          if (!event.accommodations[app].rooms) {
            return "done";
          }
          else {
            for (let room = 0; room < event.accommodations[app].rooms.length; room++) {
              if (!event.accommodations[app].rooms[room].beds) {
                return "done";
              }
              else {
                for (let bed = 0; bed < event.accommodations[app].rooms[room].beds.length; bed++) {
                  let bedID = eventID + "-" + app + "-" + room + "-" + bed;
                  event.accommodations[app].rooms[room].beds[bed].bedID = bedID;
                }

                await this.eventRepo.updateEvent(eventID, event);
              }
            }
          }
        }
      }
    }
    else {
      return "done";
    }
  }

  async getNewEventID(newEvent) {
    let list = await this.eventRepo.getEvents();
    let eventID;
    list.forEach(element => {
      if (element["country"] === newEvent.country && element["city"] === newEvent.city && element["created"] === newEvent.created) {
        eventID = element["id"]
      }
    });

    return eventID
  }

  async updateEvent(id: string, newEvent: EventWithoutCreatedDate) {
    await this.eventRepo.updateEvent(id, newEvent);
  }

  async getEventByID(id: string) {
    return await this.eventRepo.getEvent(id)
  }





}