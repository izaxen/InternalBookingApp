import { IBooking } from "../models/booking";
import BookingRepo from "../repositories/bookingRepo";
import { controlAdmin } from "../repositories/adminRepo"


export function checkBookingDeletion(id) {
  let  idToDelete:string[] = []
  
  if (Array.isArray(id)) {
    id.forEach(element => {
      let a:string = element;
      
      if (a.length === 20) {
        idToDelete.push(element)
      }
    });
  }
  else {
    if (id.length === 20) {
      idToDelete.push(id)// Hjälp här
    }
  }
    return idToDelete
}
  
export async function validUserDeletionBooking(bookingID: string, identity: string) {
  const bookingRepo = new BookingRepo();
  const booking: IBooking = await bookingRepo.getSingleBooking(bookingID)
  const isAdmin:boolean = await controlAdmin(identity)

  if(booking.email === identity || isAdmin){
    return true;
  }
  return false;
}
  
  
  
  



