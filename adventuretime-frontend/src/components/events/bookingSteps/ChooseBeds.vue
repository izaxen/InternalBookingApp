<template>
  <div class="booking-process">
    <div class="bed-container">
      <div
        v-for="bed in room.beds"
        :class="[
          !compareAlreadyBookedBed(bed) ? 'beds shadow' : 'beds booked shadow',
          bed.bedID === getBooking.selectedBedID ? 'selected' : '',
        ]"
        :key="bed.bedID"
        @click="goContinue(bed)"
      >
        <span class="material-icons">{{ getBedIcon(bed) }}</span>

        <h2>Bed {{ getBedNumber(bed.bedID) }}</h2>
      </div>
    </div>
    <div class="info">
      <span class="material-icons warning">info </span>
      <span class="material-icons">single_bed </span>
      <h3>Single bed</h3>
      <span class="material-icons">king_bed </span>
      <h3>Double bed (not shareable)</h3>
      <span class="material-icons">people </span>
      <h3>Double bed (shareable)</h3>
      <span class="material-icons booked booked-icon"></span>
      <h3>Booked</h3>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["setStep"],
  data() {
    return {
      room: this.$store.getters["bookingStore/booking"].selectedRoom,
      unavailableBeds: this.$store.getters["eventStore/unavailableBeds"],
    };
  },

  computed: {
    getRoom() {
      return this.room;
    },
    getBooking() {
      return this.$store.getters["bookingStore/booking"];
    },
  },

  methods: {
    compareAlreadyBookedBed(bed) {
      if (this.unavailableBeds === null) return false;
      return this.unavailableBeds.includes(bed.bedID);
    },

    goContinue(bed) {
      this.$store.dispatch("bookingStore/updateBooking", {
        ...this.$store.getters["bookingStore/booking"],
        selectedBedID: bed.bedID,
      });
      if (
        this.$store.getters["bookingStore/booking"].selectedStartDate &&
        this.$store.getters["bookingStore/booking"].selectedEndDate
      ) {
        this.$emit("setStep", 4);
      } else {
        this.$emit("setStep", 1);
      }
    },
    getBedNumber(bedID) {
      const chars = bedID.split("-");
      return parseInt(chars[3]) + 1;
    },
    getBedIcon(bed) {
      if (bed?.isShareable) {
        return "people";
      } else if (bed.bedSize === "DoubleBed") {
        return "king_bed";
      }
      return "single_bed";
    },
  },
};
</script>

<style scoped >
.bed-container * {
  margin: 0;
  padding: 0;
}

.bed-container {
  display: grid;
  flex-direction: row;
  min-height: 60vh;
  gap: 10px;
  row-gap: 15px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 100px));
  grid-template-rows: repeat(auto-fit, minmax(100px, 100px));
  justify-content: center;
}

.beds {
  background-color: #9538b3;
  height: 85%;
  max-height: 80px;
  max-width: 150px;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

.beds h2 {
  font-weight: 100;
}

.booked {
  background-color: #6c1313;
  pointer-events: none;
  height: 70%;
  width: 70%;
  justify-self: center;
  align-self: center;
}

.booked-icon {
  background-color: #6c1313;
  height: 30px;
  width: 30px;
  border-radius: 10px;
  border: 1px solid white;
}

.material-icons {
  font-size: 40px;
}

.beds:hover {
  cursor: pointer;
  background-color: #984cb1;
}

.info * {
  margin: 0;
  font-weight: 100;
}

.info {
  display: flex;
  position: relative;
  background-color: #3d1e7bed;
  border-radius: 10px;
  align-items: center;
  margin-bottom: 10px;
}

.info h3 {
  margin: 10px 0px 10px 10px;
}

.info .material-icons {
  margin-left: 30px;
}
.warning {
  position: absolute;
  left: -49px;
  top: -16px;
  font-size: 40px;
  text-shadow: 0 0 16px #00000094;
}

@media screen and (max-width: 1080px) {
  .nav-title {
    visibility: hidden;
  }
}
@media screen and (max-width: 975px) {
  .info {
    flex-direction: column;
    padding-top: 10px;
    margin-bottom: 10px;
    margin: auto;
    margin-bottom: 10px;
    width: 90%;
  }
  .info .material-icons {
    margin-left: 0px;
    margin-top: 20px;
  }
  .info h3 {
    margin: 10px 0px 10px 10px;
  }
  .warning {
    position: absolute;
    left: 35px;
    top: 6px;
    text-shadow: unset;
    font-size: 55px;
  }
}
</style>