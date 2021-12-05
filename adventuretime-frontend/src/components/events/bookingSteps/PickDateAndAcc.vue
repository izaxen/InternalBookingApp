<template>
  <div class="booking-process" v-if="event">
    <div class="date-container">
      <div class="date shadow">
        <span class="material-icons">flight_land</span>
        <label>Arrival</label>
        <input
          v-model="startDate"
          placeholder="StartDate"
          type="date"
          :max="event.endDate"
          :min="getStartDate"
          @change="filterAccommodations"
        />
      </div>
      <div class="date shadow">
        <span class="material-icons">flight_takeoff</span>
        <label>Depature</label>
        <input
          v-model="endDate"
          placeholder="EndDate"
          type="date"
          :max="event.endDate"
          :min="getStartDate"
          @change="filterAccommodations"
        />
      </div>
    </div>

    <div>
      <h1>
        <span class="headingHighlight">2. Choose accommodation</span>
      </h1>
      <div class="accommodation-container">
        <div
          :class="
            accommodation?.accommodationTitle ===
            booking?.selectedAccommodation?.accommodationTitle
              ? 'accommodation shadow selected'
              : 'accommodation shadow'
          "
          v-for="accommodation in accommodations"
          :key="accommodation.accommodationTitle"
          @click="nextStep(accommodation)"
        >
          <div class="txt-area">
            <span class="material-icons">maps_home_work</span>
            <h3>{{ accommodation.accommodationTitle }}</h3>
            <p v-if="unavailableBeds">
              {{ calculateHowManyBedsLeft(accommodation) }}
            </p>
          </div>
        </div>
        <div
          class="accommodation mixed shadow"
          @click="nextStepMixed(accommodation)"
        >
          <div class="txt-area">
            <span class="material-icons">holiday_village</span>
            <span class="txt-area-mixed">
              <h3>Mixed beds</h3>
              <p>(if you want mix rooms/beds)</p>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["setStep"],
  data() {
    return {
      booking: this.$store.getters["bookingStore/booking"],
      unavailableBeds: "",
      usp: new URLSearchParams(),
      endDate: "",
      startDate: "",
    };
  },

  computed: {
    validStartDate() {
      return this.booking.selectedStartDate;
    },
    event() {
      return this.$store.getters["eventStore/selectedEvent"];
    },
    accommodations() {
      return this.$store.getters["eventStore/selectedEvent"].accommodations;
    },
    getBooking() {
      return this.$store.getters["bookingStore/booking"];
    },

    getEndDate() {
      return this.endDate
    },
    getStartDate() {
      this.setEndDate(this.startDate)
      return this.startDate;
    },
  },

  mounted() {
    this.getUnavailableBeds();
    this.setStartDate();
  },

  methods: {

    setStartDate() {
      if (new Date() > new Date(this.booking.selectedStartDate)) {
        this.startDate = new Date().toLocaleDateString();
      }
      else {
        this.startDate = this.booking.selectedStartDate;
      }
    },

    setEndDate(startDate) {
      Date.prototype.addDays = function (days) {
        date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };

      var date = new Date(startDate);
      this.endDate = date.addDays(7).toLocaleDateString();
    },

    dispatchEndDate() {
      console.log("kör");
      this.$store.dispatch("bookingStore/updateBooking", {
        ...this.$store.getters["bookingStore/booking"],
        selectedEndDate: this.endDate,
      });
    },


    nextStep(accommodation) {
      this.$store.dispatch("bookingStore/updateBooking", {
        ...this.$store.getters["bookingStore/booking"],
        selectedAccommodation: accommodation,
        selectedStartDate: this.startDate,
        selectedEndDate: this.endDate,
        selectedRoom: "",
        selectedBed: "",
      });

      this.$emit("setStep", 2);
    },

    nextStepMixed(accommodation) {
      this.$store.dispatch("bookingStore/updateBooking", {
        ...this.$store.getters["bookingStore/booking"],
        selectedAccommodation: accommodation,
        selectedStartDate: this.booking.selectedStartDate,
        selectedEndDate: this.booking.selectedEndDate,
      });

      this.$emit("setStep", 10);
    },

    async filterAccommodations() {
      let x = await this.getUnavailableBeds();
      this.$store.dispatch("eventStore/setUnavailableBeds", x);
      this.updateBooking();
    },

    updateBooking() {
      this.$store.dispatch("bookingStore/updateBooking", {
        ...this.$store.getters["bookingStore/booking"],
        selectedStartDate: this.booking.selectedStartDate,
        selectedEndDate: this.booking.selectedEndDate,
      });
    },

    async getUnavailableBeds() {
      this.usp.set("startDate", this.booking.selectedStartDate);
      this.usp.set("endDate", this.booking.selectedEndDate);
      this.usp.set("eventID", this.$route.params.id);
      this.$store.dispatch(
        "eventStore/getUnavailableBeds",
        this.usp.toString()
      );
    },

    calculateHowManyBedsLeft(accommodation) {
      let availableBeds = 0;
      let unavailableBeds = 0;

      accommodation.rooms.forEach((room) => {
        room.beds.forEach((bed) => {
          this.unavailableBeds.includes(bed.bedID)
            ? (unavailableBeds += 1)
            : (availableBeds += 1);
        });
      });
      let sum = availableBeds + unavailableBeds;

      return availableBeds + " of " + sum + " beds are available";
    },
  },
};
</script>

<style scoped>
.date {
  background-color: #9538b3;
  border-radius: 15px;
  padding: 10px;
  /* min-width: 15vw; */
  max-width: 400px;
  max-height: 140px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
}

.accommodation-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 350px));
  /* grid-template-rows: repeat(auto-fit, minmax(100px, 100px)); */
  align-items: center;
  border-radius: 10px;
  /* justify-content: center; */
  margin: 10px;
  gap: 10px;
  justify-content: center;
}
.date-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 400px));
  grid-row-gap: 20px;
  justify-content: center;
}

.headingHighlight {
  margin-bottom: 20px;
  font-size: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
}
.accommodation,
.rooms,
.beds {
  background-color: #9538b3;
  /* height: 100%; */
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.accommodation:hover,
.rooms:hover,
.beds:hover {
  cursor: pointer;
}

.accommodation .material-icons {
  font-size: 48px;
  color: white;
}

.accommodation h3 {
  padding: 0;
  margin: 0;
}

.mixed {
  /*   grid-column-start: 6;
  grid-column-end: 7; */
  background-color: #5214b7;
  max-height: 100px;
}
.mixed p {
  margin: 0;
}
.mixed:hover {
  /*   grid-column-start: 6;
  grid-column-end: 7; */
  background-color: #622eb6;
}

input {
  border-radius: 10px;
  border: none;
  font-size: x-large;
  padding: 5px;
  width: 98%;
}
label {
  margin: 10px;
  font-size: x-large;
}

.txt-area {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 15px;
}
.txt-area h3,
.txt-area-mixed {
  margin: auto;
}
.txt-area .material-icons {
  margin-left: 10px;
}

@media screen and (max-width: 942px) {
  .accommodation-container {
    grid-template-columns: repeat(auto-fit, minmax(250px, 400px));
    justify-content: center;
    row-gap: 40px;
    margin: 0;
    margin-bottom: 20px;
  }

  .date {
    margin-right: 0;
  }

  .accommodation {
    padding: 10px 0px 10px 0px;
  }
}

@media screen and (max-width: 500px) {
  .booking-process {
    width: 90%;
    margin: auto;
  }
}
</style>