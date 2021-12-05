<template>
  <div class="navigation-steps-container">
    <div class="navigation-step" @click="setStep('basicInfoContainer')">
      <p
        :style="{
          background: showTab === 'basicInfoContainer' ? 'white' : '',
          'border-radius': showTab === 'basicInfoContainer' ? '6px' : 'none',
          color: showTab === 'basicInfoContainer' ? 'black' : 'white',
        }"
      >
        Basic Info
      </p>
    </div>
    <div
      class="navigation-step"
      v-if="showAccommodation"
      @click="setStep('showApartmentInfo')"
    >
      <span class="material-icons"> keyboard_arrow_right </span>
      <p
        :style="{
          background: showTab === 'showApartmentInfo' ? 'white' : '',
          'border-radius': showTab === 'showApartmentInfo' ? '6px' : 'none',
          color: showTab === 'showApartmentInfo' ? 'black' : 'white',
        }"
      >
        Accommodations
      </p>
    </div>

    <div
      class="navigation-step"
      v-if="
        showTab === 'addAccommodation' ||
        showTab === 'addRoom' ||
        showTab === 'addBed'
      "
      @click="setStep('addAccommodation')"
    >
      <span class="material-icons"> keyboard_arrow_right </span>
      <p
        :style="{
          background: showTab === 'addAccommodation' ? 'white' : '',
          'border-radius': showTab === 'addAccommodation' ? '6px' : 'none',
          color: showTab === 'addAccommodation' ? 'black' : 'white',
        }"
      >
        Accommodation
      </p>
    </div>

    <div
      class="navigation-step"
      v-if="showTab === 'addRoom' || showTab === 'addBed'"
      @click="setStep('addRoom')"
    >
      <span class="material-icons"> keyboard_arrow_right </span>
      <p
        :style="{
          background: showTab === 'addRoom' ? 'white' : '',
          'border-radius': showTab === 'addRoom' ? '6px' : 'none',
          color: showTab === 'addRoom' ? 'black' : 'white',
        }"
      >
        Rooms
      </p>
    </div>
    <div class="navigation-step" v-if="showTab === 'addBed'">
      <span class="material-icons"> keyboard_arrow_right </span>
      <p
        :style="{
          background: showTab === 'addBed' ? 'white' : '',
          'border-radius': showTab === 'addBed' ? '6px' : 'none',
          color: showTab === 'addBed' ? 'black' : 'white',
        }"
      >
        Beds
      </p>
    </div>
    <div
      class="navigation-step"
      v-if="showOverView"
      @click="setStep('confirm')"
    >
      <span class="material-icons"> keyboard_arrow_right </span>
      <p
        :style="{
          background: showTab === 'confirm' ? 'white' : '',
          'border-radius': showTab === 'confirm' ? '6px' : 'none',
          color: showTab === 'confirm' ? 'black' : 'white',
        }"
      >
        Confirmation
      </p>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["setStep"],
  props: ["showAccommodation", "showOverView", "showTab"],
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
  position: initial;
  bottom: 5px;
  align-items: center;
  border-radius: 10px;
  background-color: #3d1e7bd1;
  width: fit-content;
  align-self: center;
  margin-top: 1rem;
  margin-bottom: 1rem;
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
  cursor: default;
}
.navigation-step:hover p {
  text-decoration: none;
  cursor: pointer;
}

.material-icons {
  font-size: 1.5rem;
  padding-right: 5px;
}
</style>