
import { auth } from '../../config/auth.js';
import { getToken } from '../../config/auth';

const BASE_URL = process.env.VUE_APP_API_URL;

const eventStore = {
  namespaced: true,

  state: () => ({
    accountName: undefined,
    events: undefined,
    selectedEvent: null,
    unavailableBeds: null,
    admin: false,

  }),

  getters: {
    accountName: state => state.accountName,
    events: state => state.events,
    selectedEvent: state => state.selectedEvent,
    unavailableBeds: state => state.unavailableBeds,
    admin:state => state.admin,
  },

  mutations: {
    setAccountName(state, accountName) {
      state.accountName = accountName;
    },
    setEvents(state, events) {
      state.events = events
    },
    setSelectedEvent(state, event) {
      state.selectedEvent = event;
    },
    setUnavailableBeds(state, unavailableBeds) {
      state.unavailableBeds = unavailableBeds
    },
    setAdmin(state, isAdmin) {
      state.admin = isAdmin;
    }
  },

  actions: {
    async getAccountName({ commit }) {
      const account = auth.getAccount();
      if (!account) {
        auth.loginRedirect();
      }

      commit('setAccountName', account.userName.toLowerCase());
    },

    async adminAuth() {
      const res = await fetch(`${BASE_URL}/authentication/isAdmin/`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      let a = await res.json()
      this.commit('eventStore/setAdmin', a )
    },

    async addAdmin(_, newAdmin) {
      const res = await fetch(`${BASE_URL}/authentication/addNewAdmin?${newAdmin}`, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      })
      return res.json();
    },



    setEvent(_, event) {
      this.commit('eventStore/setSelectedEvent', event)
    },

    setSelectedEvent(_, event) {
      this.commit('eventStore/setSelectedEvent', event)
    },

    setUnavailableBeds(_, unavailableBeds) {
      this.commit('eventStore/setUnavailableBeds', unavailableBeds)
    },

    async addNewEvent(_, event) {
      console.log(getToken); // TODO fix with bearer

      await fetch(`${BASE_URL}/event/addEvent/`, {
        method: 'POST',
        body: JSON.stringify(event),
      });
      // return res.json();
    },

    async getEvents() {
      let res = await fetch(`${BASE_URL}/event/getEvents/`, {
        method: 'GET',
      });
      let events = await res.json();
      this.commit('eventStore/setEvents', events)
      return events;
    },

    async getEventsDTO() {
      let res = await fetch(`${BASE_URL}/event/getEventsDTO/`, {
        method: 'GET',
      });
      return res.json();
    },

    async getEvent(_, id) {
      let res = await fetch(`${BASE_URL}/event/getEvent/${id}`)
      let event = await res.json();
      this.commit('eventStore/setSelectedEvent', event)
      return event;
    },

    //TODO - Blink blink (POST when just fetching?)
    async getSelectedEvent(_, selectedEvent) {
      let res = await fetch(`${BASE_URL}/event/getSelectedEvent/`, {
        method: 'POST',
        body: JSON.stringify(selectedEvent)
      });
      return res.json();
    },

    async updateSelectedEvent(_, event) {
      await fetch(`${BASE_URL}/event/updateEvent/`, {
        method: 'PUT',
        body: JSON.stringify(event)
      });
    },

    async getUnAvailableBedsDetailed(_, query) {
      let res = await fetch(`${BASE_URL}/event/getUnAvailableBedsDetailed?${query}`);
      return res.json()
    },

    async getUnavailableBeds(_, query) {
      let res = await fetch(`${BASE_URL}/event/getUnavailableBeds?${query}`);
      let unAvailableBeds = await res.json()
      this.commit('eventStore/setUnavailableBeds', unAvailableBeds)
    },

    async getBookingsByEvent(_, eventID) {
      let res = await fetch(`${BASE_URL}/booking/${eventID}`);
      return res.json()
    },

    async deleteEvent(_, obj) {
      let res = await fetch(`${BASE_URL}/event/deleteEvent/`, {
        method: 'DELETE',
        body: JSON.stringify(obj),
      });
      return res.json();
    }
  },

}

export default eventStore;