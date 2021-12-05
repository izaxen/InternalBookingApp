<template>
  <div :class="allBok.length > 0 ? '' : 'loader'"></div>
  <div class="main-container border-radius" v-if="allBok">
    <div class="list-container">
      <div v-if="!listAll" class="top-marg"></div>
      <h2 class="headingHighlight">All bookings listed</h2>
      <div class="filter-events" v-if="!listAll">
        <select v-model="selectedEvent" @change="filterBookings()">
          <option disabled value>Choose event to filter</option>
          <option
            v-for="event in eventID"
            :key="event"
            :value="event.id"
          >{{ event.city }} {{ event.country }} {{ event.id }}</option>
        </select>
        <button class="button-styled-1" @click="clearFilter">Show all bookings</button>
      </div>
      <div
        class="render-bookings border-bottom-grey"
        v-for="booking in filterBookingList"
        :key="booking"
      >
        <div class="main-booking">
          <div class="inside-render">
            <p class="bold">Arrival:</p>
            <p class="mg-rh-10">{{ booking.startDate }}</p>
          </div>
          <div class="inside-render">
            <p class="bold">Departure:</p>
            <p class="mg-rh-10">{{ booking.endDate }}</p>
          </div>
          <div class="inside-render">
            <p class="bold">Accommodation:</p>
            <p class="mg-rh-10">{{ booking.selectedAccommodation }}</p>
          </div>
          <div class="inside-render">
            <p class="bold">Room:</p>
            <p class="mg-rh-10">{{ booking.selectedRoom }}</p>
          </div>
          <div class="inside-render">
            <p class="bold">BedID:</p>
            <p class="mg-rh-10">{{ getBedNumber(booking.selectedBedID) }}</p>
          </div>
          <div class="inside-render">
            <p class="bold">Email:</p>
            <p class="mg-rh-10">{{ booking.email }}</p>
          </div>
        </div>
        <div v-if="!listAll">
          <p class="bold lh-side">Additional Info:</p>
          <div class="additional-info" v-for="item in booking.additionalInfo" :key="item">
            <div class="render-additional-info" v-for="(value, name, index) in item" :key="index">
              <div class="add-info">
                <p class="add-info1">{{ name }} :</p>
                <p class="add-info1 ital">{{ value }}</p>
              </div>
            </div>
          </div>
          <div class="smelly-button">
            <button
              class="button-styled-1"
              @click="
                cancelBooking({
                  bookingID: booking.id,
                  groupID: booking.groupID,
                })
              "
            >Cancel booking</button>
          </div>
        </div>
      </div>
      <div class="modal-mask" v-if="showModal">
        <div class="modal-wrapper modal-size" @click.self="showModal = false">
          <DeletionModal
            @closeModal="closeModal()"
            :bookingIDAndGroupID="bookingIDAndGroupID"
            :admin="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DeletionModal from "./modals/DeletionModal.vue";
export default {
  emits: ["closeModal"],
  props: ["listAll", "event"],

  components: {
    DeletionModal,
  },

  data() {
    return {
      allBookings: [],
      events: this.$store.getters["eventStore/events"],
      showModal: false,
      eventID: "",
      selectedEvent: "",
      filteredBookings: "",
    };
  },
  computed: {
    allBok() {
      this.renderEvents();
      return this.allBookings;
    },
    allBookings2() {
      return this.$store.getters["bookingStore/allBookings"];
    },
    filterBookingList() {
      return this.filteredBookings;
    },

    selectEvent() {
      return this.selectedEvent;
    },
  },

  async beforeMount() {
    this.allBookings = await this.$store.dispatch(
      "bookingStore/getAllBookings"
    );
    this.filteredBookings = this.allBookings;
    this.setFilter();
    this.getEventId();
  },

  mounted() {
    this.$store.watch(state => state.bookingStore.allBookings, (value) => {
      if (value) {
        this.filteredBookings = this.$store.getters['bookingStore/allBookings'];
      }
    })
  },

  methods: {
    setFilter() {
      if (this.event !== undefined) {
        this.selectedEvent = this.event;
        this.filterBookings();
      }
    },

    getBedNumber(bedID) {
      var bednr = bedID.split("-");
      //ta ut 3st replace all - innan
      //bednr = bednr.replaceAll(/[-].*/g, "");
      bednr = parseInt(bednr[3]) + 1;
      return bednr;
    },

    cancelBooking(bookingIDAndGroupID) {
      this.bookingIDAndGroupID = bookingIDAndGroupID;
      this.showModal = true;
    },
    openModal() {
      this.showModal = true;
    },

    closeModal(boolean) {
      this.showModal = boolean;
    },

    getEventId() {
      const eventID = this.events.map((i) => ({
        country: i.country,
        id: i.id,
        city: i.city,
      }));
      this.eventID = eventID;
    },

    renderEvents() {
      this.allBookings.sort(
        (date1, date2) =>
          new Date(date1.startDate).getTime() -
          new Date(date2.startDate).getTime()
      );
      return this.allBookings.length;
    },

    clearFilter() {
      this.selectedEvent = "";
      this.filteredBookings = this.allBookings;
    },

    filterBookings() {
      let templist = [];
      this.allBookings.forEach((element) => {
        if (element.eventID === this.selectedEvent) {
          templist.push(element);
        }
      });
      this.filteredBookings = templist;
    },
  },
};
</script>

<style scoped>
.smelly-button {
  display: flex;
  justify-content: flex-end;
}
.lh-side {
  display: flex;
  justify-items: left;
}
.add-info1 {
  margin: 5px 5px;
  color: black;
}
.main-container {
  width: 80vw;
  margin: 35px auto;
  padding-bottom: 30px;
  background: white;
}
.list-container {
  width: 90%;
  margin: 0 auto;
}
.top-marg {
  height: 45px;
  background-color: white;
}
p.mg-rh-10 {
  color: black;
}

.loader {
  margin: 50px auto;
}
.add-info {
  display: flex;
}
.main-booking {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.render-bookings {
  margin: 20px;
}
.filter-events {
  margin: 0 auto;
}

button {
  margin: 0 0 15px 0;
}
select {
  margin-right: 20px;
}
h2 {
  margin: 0px 0 60px 0;
}
.ital {
  font-style: italic;
}

.inside-render {
  display: flex;
}
@media screen and (max-width: 600px) {
  select {
    width: 100%;
  }
}
</style>