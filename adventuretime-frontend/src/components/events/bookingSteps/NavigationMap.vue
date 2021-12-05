<template>
  <div class="navigation-steps-container desktop">
    <div class="navigation-step" @click="setStep(1)">
      <p>Choose dates or accommodation</p>
    </div>
    <div
      class="navigation-step"
      v-if="getBooking.selectedAccommodation"
      @click="setStep(2)"
    >
      <span class="material-icons">keyboard_arrow_right</span>
      <p>Choose room</p>
    </div>
    <div
      class="navigation-step"
      v-if="getBooking.selectedRoom"
      @click="setStep(3)"
    >
      <span class="material-icons">keyboard_arrow_right</span>
      <p>Choose bed</p>
    </div>
    <div
      class="navigation-step"
      v-if="getBooking.selectedBedID"
      @click="setStep(4)"
    >
      <span class="material-icons">keyboard_arrow_right</span>
      <p>Additional info</p>
    </div>
    <div
      class="navigation-step"
      v-if="this.$props.completeBooking"
      @click="setStep(5)"
    >
      <!--     <div
      class="navigation-step"
      v-if="
        getBooking.selectedBedID &&
        getBooking.selectedStartDate &&
        getBooking.selectedEndDate &&
        evaluateSurvey
      "
      @click="setStep('Complete booking')"
    > -->
      <span class="material-icons">keyboard_arrow_right</span>
      <p>Confirm your booking</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["step", "completeBooking"],
  emits: ["setStep"],
  data() {
    return {
      booking: this.$store.getters["bookingStore/booking"],
    };
  },

  computed: {
    getBooking() {
      return this.$store.getters["bookingStore/booking"];
    },
  },

  methods: {
    setStep(step) {
      this.$emit("setStep", step);
    },
  },
};
</script>

<style scoped>
.navigation-steps-container {
  display: flex;
  bottom: 5px;
  align-items: center;
  border-radius: 10px;
  background-color: #3d1e7bd1;
  padding-left: 15px;
  padding-right: 15px;
}

.navigation-step {
  display: flex;
  align-items: center;
  padding: 5px;
}

.navigation-step p {
  font-size: 20px;
  color: rgb(255, 255, 255);
  margin: 0;
}
.navigation-step:hover {
  cursor: pointer;
}
.navigation-step:hover p {
  text-decoration: underline;
}

.navigation-steps-container.mobile {
  display: none;
  margin: 0;
  width: 95%;
}

@media screen and (max-width: 1080px) {
  .desktop {
    display: none !important;
  }
  .navigation-steps-container.mobile {
    display: flex;
    position: unset;
    bottom: unset;
  }
}
</style>