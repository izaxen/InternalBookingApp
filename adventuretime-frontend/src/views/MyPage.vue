<template>
  <div class="modal-mask" v-if="showModal">
    <div class="modal-wrapper modal-size" @click.self="showModal = false">
      <DeletionModal
        @closeModal="closeModal"
        :bookingIDAndGroupID="bookingIDAndGroupID"
      />
    </div>
  </div>
  <div>
    <div class="main-container border-radius">
      <div v-if="myBookLoaded.length == 0">
        <h2 class="headingHighlight">booking history</h2>
        <p :style="{ color: 'black' }">No bookings</p>
      </div>

      <div v-else-if="myBookLoaded">
        <div class="center-bookings">
          <h2 class="headingHighlight">My booking history</h2>
          <div
            class="loop-bookings border-bottom-grey"
            v-for="booking in myBookings"
            :key="booking"
          >
            <div class="render-my-bookings">
              <div class="inside-render">
                <p class="bold">Bookingnr:</p>
                <p class="low-p">{{ booking.id }}</p>
              </div>
              <div class="inside-render">
                <p class="bold">Arrival:</p>
                <p class="low-p">{{ booking.startDate }}</p>
              </div>
              <div class="inside-render">
                <p class="bold">Departure:</p>
                <p class="low-p">{{ booking.endDate }}</p>
              </div>
              <div class="inside-render">
                <p class="bold">Room:</p>
                <p class="low-p">{{ booking.selectedRoom }}</p>
              </div>
              <div class="inside-render">
                <p class="bold">Bed:</p>
                <p class="low-p">{{ getBedNumber(booking.selectedBedID) }}</p>
              </div>
              <div class="inside-render">
                <p class="bold">City:</p>
                <p class="low-p">{{ findEventPlace(booking.eventID) }}</p>
              </div>
              <div class="inside-render">
                <p class="bold">Country:</p>
                <p class="low-p">{{ findEventCountry(booking.eventID) }}</p>
              </div>
            </div>
            <div class="del-button">
              <button
                class="button-styled-1"
                v-if="checkDate(booking.startDate)"
                @click="
                  cancelBooking({
                    bookingID: booking.id,
                    groupID: booking.groupID,
                  })
                "
              >
                Cancel booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DeletionModal from "../components/modals/DeletionModal.vue";
export default {
  emits: ["closeModal"],
  components: {
    DeletionModal,
  },

  data() {
    return {
      myBookings: this.$store.getters["bookingStore/myBookings"],
      showModal: false,
      bookingIDAndGroupID: {},
    };
  },
  mounted() {
    this.$store.watch(
      (state) => state.bookingStore.myBookings,
      (value) => {
        if (value) {
          this.myBookings = this.$store.getters["bookingStore/myBookings"];
        }
      }
    );
  },

  computed: {
    myBookLoaded() {
      return this.myBookings;
    },
  },
  async beforeMount() {
    this.myBookings = await this.$store.dispatch("bookingStore/getMyBookings");
  },

  methods: {
    openModal() {
      this.showModal = true;
    },

    closeModal(boolean) {
      this.showModal = boolean;
    },

    findEventPlace(eventID) {
      let city;
      const events = this.$store.getters["eventStore/events"];
      events.forEach((element) => {
        if (element.id === eventID) {
          city = element.city;
        }
      });
      return city;
    },

    findEventCountry(eventID) {
      let country;
      const events = this.$store.getters["eventStore/events"];
      events.forEach((element) => {
        if (element.id === eventID) {
          country = element.country;
        }
      });
      return country;
    },

    async cancelBooking(bookingIDAndGroupID) {
      this.bookingIDAndGroupID = bookingIDAndGroupID;
      this.showModal = true;
    },

    checkDate(startDate) {
      //TODO Sätt in dagar innan man kan avboka.
      return new Date(startDate) > Date.now();
    },

   getBedNumber(bedID) {
      var bednr = bedID.split("-");
      bednr = parseInt(bednr[3]) + 1;
      return bednr;
    },
  },
};
</script>

<style scoped>
.loader {
  margin: 50px auto;
}
.del-button {
  margin: auto 0 10px 0;
}

.main-container {
  background-color: rgb(254, 254, 254);
  width: 80vw;
  margin: 10px auto;
  padding: 20px 0 35px 0;
}
p.low-p {
  color: black;
  margin-right: 15px;
}
h2 {
  margin-top: 35px;
  margin-bottom: 55px;
}

.loop-bookings {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.render-my-bookings {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 10px 15px 0px 15px;
}

.inside-render {
  display: flex;
  flex-direction: row;
}
.center-bookings {
  width: 85%;
  margin: 0 auto;
}

@media screen and (max-width: 600px) {
  .render-my-bookings {
    padding: 20px 0;
    flex-direction: row;
  }
  .del-button {
    margin-left: auto;
    margin-right: 0;
  }
}
</style>

