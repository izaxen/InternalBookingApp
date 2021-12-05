<template>
  <div class="booking-process" v-if="accommodation">
    <div class="rooms-container">
      <div
        :class="
          room.roomTitle === getBooking.selectedRoom.roomTitle
            ? 'rooms shadow selected'
            : 'rooms shadow'
        "
        v-for="room in accommodation.rooms"
        :key="room.roomTitle"
        @click="this.continue(room)"
      >
        <span class="material-icons">night_shelter</span>
        <h3>{{ room.roomTitle }}</h3>
        <p>{{ room.roomDescription }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["setStep"],
  data() {
    return {};
  },

  computed: {
    accommodation() {
      return this.$store.getters["bookingStore/booking"].selectedAccommodation;
    },
    getBooking() {
      return this.$store.getters["bookingStore/booking"];
    },
  },

  methods: {
    continue(room) {
      this.$store.dispatch("bookingStore/updateBooking", {
        ...this.$store.getters["bookingStore/booking"],
        selectedRoom: room,
        selectedBedID: "",
      });
      this.$emit("setStep", 3);
    },
  },
};
</script>

<style scoped>
.rooms * {
  margin: 0;
  padding: 0;
  color: white;
}

.rooms-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 200px));
  gap: 10px;
  grid-row-gap: 30px;
  justify-content: center;
}

.rooms {
  max-width: 200px;
  display: flex;
  flex-direction: column;
  padding: 10px;
}
@media screen and (max-width: 1080px) {
  .nav-title {
    visibility: hidden;
  }
}
</style>