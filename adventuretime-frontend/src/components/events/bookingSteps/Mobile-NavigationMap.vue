<template>
  <div class="navigation-steps-container mobile">
    <span
      :class="stepBackwards ? 'material-icons' : 'material-icons inactive'"
      @click="updateStep(step - 1)"
    >
      arrow_back_ios_new
    </span>
    <h1 class="title">
      <span class="headingHighlight">{{ title }}</span>
    </h1>
    <span
      :class="stepForward ? 'material-icons' : 'material-icons inactive'"
      @click="updateStep(step + 1)"
    >
      arrow_forward_ios_new
    </span>
  </div>
</template>

<script>
export default {
  props: ["step"],
  emits: ["setStep"],
  data() {
    return {
      booking: this.$store.getters["bookingStore/booking"],
      mobileNavigation: { back: false, forward: false },
      title: "1. Choose date",
    };
  },

  computed: {
    getBooking() {
      return this.$store.getters["bookingStore/booking"];
    },
    mobileNavigationChange() {
      return this.mobileNavigation;
    },

    stepBackwards() {
      return this.mobileNavigation.back;
    },
    stepForward() {
      return this.mobileNavigation.forward;
    },
  },

  watch: {
    step: function (newVal) {
      this.setMobileNavigation(newVal);
      this.booking = this.$store.getters["bookingStore/booking"];
    },
  },

  beforeMount() {
    this.setMobileNavigation(1);
  },

  methods: {
    updateStep(step) {
      if (step === 9) {
        this.$emit("setStep", 1);
        return;
      }
      this.$emit("setStep", step);
    },

    setMobileNavigation(step) {
      switch (step) {
        //Choose date & accommodation
        case 1:
          this.title = "1. Choose date";
          this.mobileNavigation.back = false;
          this.changeMobileNavigation("selectedAccommodation");
          break;

        //Choose room
        case 2:
          this.title = "3. Choose room";
          this.mobileNavigation.back = true;
          //Kontrollera om Acco är satt
          this.changeMobileNavigation("selectedRoom");
          break;

        //Choose bed
        case 3:
          this.title = "4. Choose bed";
          this.changeMobileNavigation("selectedBedID");
          break;

        case 4:
          this.title = "5. Additional info";
          this.changeMobileNavigation("additionalInfo");
          break;

        case 5:
        case 12:
          this.title = "6. Confrim booking";
          this.mobileNavigation.back = true;
          this.mobileNavigation.forward = false;
          break;
        case 10:
          this.title = "3. Custom Booking";
          this.mobileNavigation.back = true;
          this.mobileNavigation.forward = false;
          break;
        case 11:
          this.title = "4. Additional info";
          this.changeMobileNavigation("additionalInfo");
          break;

        default:
          break;
      }
    },

    changeMobileNavigation(property) {
      switch (property) {
        case "selectedAccommodation":
          {
            this.$store.getters["bookingStore/booking"]?.selectedAccommodation
              ? (this.mobileNavigation.forward = true)
              : (this.mobileNavigation.forward = false);
          }
          break;

        case "selectedRoom": {
          this.$store.getters["bookingStore/booking"]?.selectedRoom
            ? (this.mobileNavigation.forward = true)
            : (this.mobileNavigation.forward = false);
          break;
        }
        case "selectedBedID": {
          this.$store.getters["bookingStore/booking"]?.selectedBedID
            ? (this.mobileNavigation.forward = true)
            : (this.mobileNavigation.forward = false);
          break;
        }
        case "additionalInfo": {
          this.$store.getters["bookingStore/booking"]?.additionalInfo
            ? (this.mobileNavigation.forward = true)
            : (this.mobileNavigation.forward = false);
          break;
        }
        default:
          break;
      }
    },
  },
};
</script>

<style scoped>
.navigation-steps-container {
  display: flex;
  align-items: center;
  border-radius: 10px;
  /* padding-left: 15px;
  padding-right: 15px; */
}

.navigation-step {
  display: flex;
  align-items: center;
  padding: 5px;
}
.title {
  width: 45%;
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
  display: flex;
  margin: 0;
  min-width: 400px;
  align-self: center;
  justify-content: center;
}

.material-icons {
  max-width: 50px;
  background: #3d1e7bde;
  border-radius: 25px;
  margin: 0px 20px 0px 20px;
}
.material-icons:hover {
  cursor: pointer;
  background-color: #4c337cde;
}

.inactive {
  pointer-events: none;
  opacity: 0;
}

@media screen and (max-width: 1080px) {
  .navigation-steps-container.mobile {
    display: flex;
    width: 100%;
  }
}
@media screen and (max-width: 900px) {
  .title {
    width: unset;
  }
}
@media screen and (max-width: 450px) {
  .navigation-steps-container.mobile {
    justify-content: space-between;
    min-width: unset;
  }
  .material-icons {
    margin: 0px 5px 0px 5px;
  }
  .survey-full-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
  }
  .surveys-container {
    width: 60%;
    overflow: unset;
    padding: unset;
  }
}
</style>