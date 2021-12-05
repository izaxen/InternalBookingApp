<template>
  <div
    class="book-event-container popup"
    :style="{
      'background-Image':
        event.images.length > 0
          ? 'url(' + event.images[0] + ')'
          : 'url(http://res.cloudinary.com/simpleview/image/upload/v1597924305/clients/norway/alpine_voss_resort_vestland_fjord_norway_credits_hunnalvatn_media_2_1_2df89176-d7c8-4bb7-b7f4-88cd1ba7daf4.jpg)',
    }"
  >
    <div class="sub-container">
      <!-- For mobile -->
      <NavigationMapMobile :step="step" @setStep="setStep" />
      <!-- Desktop -->
      <PickDateAndAcc v-if="step === 1" @setStep="setStep" />
      <ChooseRooms v-if="step === 2" @setStep="setStep" />
      <ChooseBeds v-if="step === 3" @setStep="setStep" />
      <RenderBookingSurvey
        v-if="(step === 4 || step === 11) && hasEventSurveys"
        @setStep="setStep"
        :step="step"
        :surveyList="surveyList"
      />
      <HandpickDates v-if="step === 10" @setStep="setStep" />
      <CompleteBooking
        v-if="step === 5 || step === 12"
        @closeModal="closeModal"
        :currentStep="step"
      />
    </div>
    <!-- <div class="navi-map">
      <NavigationMap
        :step="step"
        @setStep="setStep"
        :completeBooking="completeBooking"
      />
    </div> -->
  </div>
</template>

<script>
import HandpickDates from "./bookingSteps/HandpickDates.vue";
import PickDateAndAcc from "./bookingSteps/PickDateAndAcc.vue";
import ChooseRooms from "./bookingSteps/ChooseRooms.vue";
import ChooseBeds from "./bookingSteps/ChooseBeds.vue";
import CompleteBooking from "./bookingSteps/CompleteBooking.vue";
/* import NavigationMap from "./bookingSteps/NavigationMap.vue"; */
import RenderBookingSurvey from "./bookingSteps/RenderBookingSurvey.vue";
import NavigationMapMobile from "./bookingSteps/Mobile-NavigationMap.vue";

export default {
  props: ["event"],
  emits: ["setStep", "closeModal"],

  data() {
    return {
      step: 1,
      unavailableBeds: "",
      usp: new URLSearchParams(),
      handPickedDateList: [],
      surveyList: [],
      completeBooking: false,
    };
  },

  mounted() {
    this.$store.dispatch("eventStore/setSelectedEvent", this.event);
    this.$store.dispatch("bookingStore/updateBooking", {
      ...this.$store.getters["bookingStore/booking"],
      selectedEvent: this.event,
      selectedStartDate: this.event.startDate,
      selectedEndDate: this.event.endDate,
    });
  },

  computed: {
    getBooking() {
      return this.$store.getters["bookingStore/booking"];
    },
  },

  methods: {
    async postNewBooking() {
      if (!this.handPickedDateList) {
        const booking = {
          email: this.$store.getters["eventStore/accountName"],
          eventID: this.eventID,
          startDate: this.startDate,
          endDate: this.endDate,
          selectedBedID: this.selectedBedID,
        };
        this.$store.dispatch("bookingStore/postNewBooking", booking);
        this.getUnavailableBeds();
      } else {
        this.handPickedDateList.forEach((element) => {
          let newBooking = {
            email: this.$store.getters["eventStore/accountName"],
            eventID: this.$route.params.id,
            startDate: element.startDate,
            endDate: element.endDate,
            selectedBedID: element.bedID,
          };
          this.$store.dispatch("bookingStore/postNewBooking", newBooking);
        });
      }
    },

    hasEventSurveys() {
      const surveyList = this.$store.getters["eventStore/selectedEvent"];
      if (surveyList.surveys.length > 0) {
        this.surveyList = surveyList.surveys;
        return true;
      } else {
        this.setStep(5);
      }
    },

    setStep(step) {
      if (step === 4 || step === 11) {
        this.hasEventSurveys();
      }
      if (step === 5 || step === 12) {
        this.completeBooking = true;
      }
      this.step = step;
    },

    filterAccommodations() {
      this.getUnavailableBeds();
    },
    compareAlreadyBookedBed(bed) {
      return this.unavailableBeds.includes(bed.bedID);
    },
    closeModal(closeModal) {
      this.$emit("closeModal", closeModal);
    },
  },

  components: {
    HandpickDates,
    PickDateAndAcc,
    ChooseRooms,
    ChooseBeds,
    CompleteBooking,
    /* NavigationMap, */
    RenderBookingSurvey,
    NavigationMapMobile,
  },
};
</script>

<style >
.cover {
  height: -webkit-fill-available;
  position: absolute;
  width: -webkit-fill-available;
  object-fit: cover;
}

.book-event-container {
  position: relative;
  height: 85%;
  display: flex;
  flex-direction: column;
  /* background-image: url(https://res.cloudinary.com/simpleview/image/upload/v1597924305/clients/norway/alpine_voss_resort_vestland_fjord_norway_credits_hunnalvatn_media_2_1_2df89176-d7c8-4bb7-b7f4-88cd1ba7daf4.jpg); */
  background-position: center;
  background-size: cover;
  padding: 30px;
  overflow: auto;
  overflow-x: hidden;
}
.book-event-container h3 {
  font-weight: 100;
  font-size: x-large;
}
.book-event-container .headingHighlight {
  margin-bottom: 20px;
  font-size: 40px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.booking-process {
  display: flex;
  flex-direction: column;
  row-gap: 40px;
}

.sub-container {
  min-height: 600px;
}

.accommodation,
.rooms {
  background-color: #9538b3;
  height: 100%;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.accommodation:hover,
.rooms:hover {
  cursor: pointer;
  background-color: #984cb1;
}

.navigation-step {
  display: flex;
  align-items: center;
  border-radius: 10px;
}
.navigation-step:hover {
  cursor: pointer;
}
.navigation-step:hover p {
  text-decoration: underline;
}

/* .rooms {
  background-color: #7862a3;
  height: 100%;
  border-radius: 20px;
} */

label {
  display: block;
}
.material-icons {
  color: white;
  font-size: 48px;
}
.accommodation .material-icons {
  font-size: 48px;
  color: white;
}

.accommodation h3 {
  padding: 0;
  margin: 0;
}

.selected {
  background-color: #0075ff !important;
  /* outline: 5px solid #52b367;
  outline-offset: -5px; */
}

@media screen and (max-width: 1080px) {
  .nav-title {
    visibility: hidden;
  }
}

@media screen and (max-width: 600px) {
  .book-event-container,
  .popup {
    background-color: unset;
    width: 90%;
    margin: 10px;
    padding: 0px;
  }
}

@media screen and (max-width: 550px) {
  .book-event-container .headingHighlight {
    font-size: 30px;
  }
}
@media screen and (max-width: 400px) {
  .book-event-container .headingHighlight {
    font-size: 25px;
  }
}
</style>