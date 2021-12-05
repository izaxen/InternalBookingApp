<template>
  <div class="render-booking border-radius shadow">
    <div class="container" v-if="!singleList">
      <div class="booking-process-list2">
        <div class="render-p">
          <p class="bold">Arrival:</p>
          <p>{{ booking.selectedStartDate }}</p>
        </div>
        <div class="render-p">
          <p class="bold">Depature:</p>
          <p>{{ booking.selectedEndDate }}</p>
        </div>
        <div class="render-p">
          <p class="bold">Accommodation:</p>
          <p>{{ booking.selectedAccommodation.accommodationTitle }}</p>
        </div>
        <div class="render-p">
          <p class="bold">Room:</p>
          <p>{{ booking.selectedRoom.roomTitle }}</p>
        </div>
        <div class="render-p">
          <p class="bold">Bed:</p>
          <p>{{ getBedNumber(booking.selectedBedID) }}</p>
        </div>
      </div>
      <div v-if="booking.additionalInfo">
        <div class="render-p">
          <p class="bold">Additional info:</p>
          <div
            class="additional-info-container"
            v-for="(value) in booking.additionalInfo"
            :key="value"
          >
            <div class="additional-info-container1" v-for="(value1, key) in value" :key="key">
              <p class>{{ key }}:</p>
              <p class="italic">{{ value1 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="single">
      <div
        class="booking-process-list2"
        v-for="singleBooking in singleBookingsList"
        :key="singleBooking"
      >
        <div class="render-p">
          <p class="bold">Arrival:</p>
          <p>{{ singleBooking.startDate }}</p>
        </div>
        <div class="render-p">
          <p class="bold">Depature:</p>
          <p>{{ singleBooking.endDate }}</p>
        </div>
        <div class="render-p">
          <p class="bold">Accommodation:</p>
          <p>{{ singleBooking.accommodationTitle }}</p>
        </div>
        <div class="render-p">
          <p class="bold">Room:</p>
          <p>{{ singleBooking.roomTitle }}</p>
        </div>
        <div class="render-p">
          <p class="bold">Bednumber:</p>
          <p>{{ getBedNumber(singleBooking.bedID) }}</p>
        </div>
      </div>
      <div v-if="booking.additionalInfo">
        <div class="render-p">
          <p class="bold">Additional info:</p>
          <div
            class="additional-info-container"
            v-for="(value) in booking.additionalInfo"
            :key="value"
          >
            <div class="additional-info-container1" v-for="(value1, key) in value" :key="key">
              <p class>{{ key }}:</p>
              <p class="italic">{{ value1 }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button class="button-styled-2" @click="postNewBooking">BOOK NOW!</button>

    <div class="modal-mask" v-if="showModal">
      <div class="modal-wrapper modal-size" @click.self="showModal = false">
        <BookingConfirmed @closeModal="closeModal()" :bookingResponse="bookingResponseWait" />
      </div>
    </div>
  </div>
</template>

<script>
import BookingConfirmed from "../../modals/BookingConfirmed.vue";

export default {
  props: ["currentStep"],
  emits: ["closeModal", "setStep"],
  data() {
    return {
      showModal: false,
      booking: this.$store.getters["bookingStore/booking"],
      singleBookingsList: this.$store.getters["bookingStore/singleBookingsList"],
      bookingResponse: "",

    };
  },
  computed: {
    singleList() {
      console.log(this.singleBookingsList);
      return this.singleBookingsList.length > 0;
    },
    bookingResponseWait() {
      return this.bookingResponse;
    }
  },
  beforeMount() {
    console.log('this.current set', this.currentStep);
    if (this.currentStep === 5) {
      this.singleBookingsList = [];
      this.$store.dispatch("bookingStore/setSingleBookingsList", []);
    }
  },
  methods: {
    additionalInfoFromEmit(info) {
      this.additionalInfo = info;
    },
    getBedNumber(bedID) {
      var bednr = bedID.split("-");
      bednr = parseInt(bednr[3]) + 1;
      return bednr;
    },
    closeModal() {
      this.showModal = false;
      this.$emit("closeModal", false);
    },
    async postNewBooking() {

      if (this.singleBookingsList < 1) {
        this.showModal = true
        const groupID = Date.now();
        const booking = {
          email: this.$store.getters["eventStore/accountName"],
          eventID: this.booking.selectedEvent.id,
          startDate: this.booking.selectedStartDate,
          endDate: this.booking.selectedEndDate,
          selectedAccommodation: this.booking.selectedAccommodation.accommodationTitle,
          selectedBedID: this.booking.selectedBedID,
          selectedRoom: this.booking.selectedRoom.roomTitle,
          additionalInfo: this.booking.additionalInfo,
          groupID: groupID,
        };

        this.bookingResponse = await this.$store.dispatch("bookingStore/validateNewBooking", booking)
      }

      else {

        this.showModal = true
        const newList = await this.createMixedBooking();
        this.bookingResponse = await this.$store.dispatch("bookingStore/validateBookingList", newList)
      }
    },

    //this.$emit("closeModal", false);

    async createMixedBooking() {
      const newBookingList = [];
      const groupID = Date.now();
      console.log(this.singleBookingsList);
      debugger;
      const tasks = this.singleBookingsList.map(async (element) => {

        const booking = {
          email: this.$store.getters["eventStore/accountName"],
          eventID: this.booking.selectedEvent.id,
          startDate: element.startDate,
          endDate: element.endDate,
          selectedBedID: element.bedID,
          selectedRoom: element.roomTitle,
          additionalInfo: this.booking.additionalInfo,
          selectedAccommodation: element.accommodationTitle,
          groupID: groupID,
        };
        newBookingList.push(booking)


      })
      await Promise.all(tasks);
      return newBookingList;
    },
  },
  components: { BookingConfirmed },
};
</script>

<style scoped>
.additional-info-container {
  display: flex;
  justify-content: center;
}
.additional-info-container1 {
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: row;
}
.render-booking {
  background-color: white;
  padding: 35px 0;
  width: 90%;
  margin: 0 auto;
  overflow: auto;
  height: 55vh;
  border: 2px solid #3d1e7b;
}

.booking-process-list2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  align-items: center;
  border-radius: 10px;
  justify-content: center;
  margin: 10px;
  gap: 10px;
}
.render-p {
  margin-bottom: 35px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

h1 {
  color: black;
}
p.italic {
  font-style: italic;
}
p {
  font-size: larger;
  color: black;
  margin: 10px 3px;
}

@media screen and (max-width: 1080px) {
  .nav-title {
    visibility: hidden;
  }
}
</style>