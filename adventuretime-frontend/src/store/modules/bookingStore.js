
import { getToken } from '../../config/auth';
const BASE_URL = process.env.VUE_APP_API_URL;

const bookingStore = {
  namespaced: true,

  state: () => ({
    booking: {
      selectedEvent: "",
      selectedStartDate: "",
      selectedEndDate: "",
      selectedAccommodation: "",
      selectedRoom: "",
      selectedBedID: "",
      additionalInfo: [],
    },
    singleBookingsList: [],
    myBookings: [],
    allBookings: [],
  }),

  getters: {
    booking: state => state.booking,
    singleBookingsList: state => state.singleBookingsList,
    myBookings: state => state.myBookings,
    allBookings: state => state.allBookings,
  },

  mutations: {

    updateBooking(state, obj) {
      state.booking = obj
    },
    setUnavailableBeds(state, unavailableBeds) {
      state.unavailableBeds = unavailableBeds
    },
    setSingleBookingsList(state, bookingList) {
      state.singleBookingsList = bookingList;
    },
    setMyBookings(state, myBookings) {
      state.myBookings = myBookings;
    },
    setAllBookings(state, allBookings) {
      state.allBookings = allBookings
    },
    resetBooking(state) {
      state.booking = {
        selectedEvent: "",
        selectedStartDate: "",
        selectedEndDate: "",
        selectedAccommodation: "",
        selectedRoom: "",
        selectedBedID: "",
        additionalInfo: [],
      }
    }
  },

  actions: {
    resetBookingAction() {
      this.commit('bookingStore/resetBooking')
      this.commit('bookingStore/setSingleBookingsList', [])
    },

    updateBooking(_, updatedBooking) {
      this.commit('bookingStore/updateBooking', updatedBooking)
    },

    setUnavailableBeds(_, unavailableBeds) {
      this.commit('bookingStore/setUnavailableBeds', unavailableBeds)
    },

    setSingleBookingsList(_, handPickedDates) {
      this.commit('bookingStore/setSingleBookingsList', handPickedDates)
    },

    async validateNewBooking(_, newBooking) {
      let res = await fetch(`${BASE_URL}/booking/validateNewBooking`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
        method: 'POST',
        body: JSON.stringify(newBooking)
      });
      return res.json();
    },

    async validateBookingList(_, newBooking) {
      console.log('kör api');
      let res = await fetch(`${BASE_URL}/booking/validateBookingList`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
        method: 'POST',
        body: JSON.stringify(newBooking)
      });
      return res.json();
    },

    async postNewBooking(_, booking) {
      await fetch(`${BASE_URL}/booking`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
        method: 'POST',
        body: JSON.stringify(booking)
      });

    },

    async getUnAvailableBedsDetailed(_, query) {
      let res = await fetch(`${BASE_URL}/event/getUnAvailableBedsDetailed?${query}`);
      return res.json()
    },

    async getUnavailableBeds(_, query) {
      let res = await fetch(`${BASE_URL}/event/getUnavailableBeds?${query}`);
      let unAvailableBeds = await res.json()
      this.commit('bookingStore/setUnavailableBeds', unAvailableBeds)
    },

    async getBookingsByEvent(_, eventID) {
      let res = await fetch(`${BASE_URL}/openBookingRoutes/${eventID}`);
      return res.json()
    },

    async getMyBookings() {
      const res = await fetch(`${BASE_URL}/booking/my-bookings?`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      const myBooks = await res.json()
      this.commit('bookingStore/setMyBookings', myBooks)
      return myBooks;
    },

    async deleteMyBooking(_, query) {
      await fetch(`${BASE_URL}/booking/deleteMyBooking?${query}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
    },

    resetBooking() {
      this.commit('bookingStore/resetBooking')
    },

    async getAllBookings() {
      const res = await fetch(`${BASE_URL}/booking/getAllBookings`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      const resResult = await res.json()
      if (res.status === 200) {
        this.commit('bookingStore/setAllBookings', resResult)
        return resResult;
      }
    },
  },
}

export default bookingStore;

