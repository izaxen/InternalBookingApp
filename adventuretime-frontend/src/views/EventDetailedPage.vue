<template>
  <div class="modal-mask" v-if="showParticipantsModalComp">
    <div class="modal-wrapper">
      <ShowParticipants
        @closeModal="closeBookingModal"
        :event="eventID"
        @click.self="showParticipantsModal = false"
      />
    </div>
  </div>

  <div class="modal-mask" v-if="showBookingModal || zoomInCover">
    <div
      v-if="!zoomInCover"
      class="modal-wrapper"
      @click.self="showBookingModal = false"
    >
      <BookEvent :event="event" @closeModal="closeBookingModal" />
    </div>

    <ZoomInPictureModal
      v-if="zoomInCover && event.images.length > 0"
      :showModal="zoomInCover"
      :imagesProp="event.images"
      :imageIndexProp="imageIndex"
      @showModalChange="zoomInCover = false"
    />
  </div>

  <div class="detailed-banner">
    <div class="leftArrow" @click="prevIndex" v-if="event.images.length > 0">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <img
      :src="
        event.images.length > 0
          ? event.images[imageIndex]
          : 'http://res.cloudinary.com/simpleview/image/upload/v1597924305/clients/norway/alpine_voss_resort_vestland_fjord_norway_credits_hunnalvatn_media_2_1_2df89176-d7c8-4bb7-b7f4-88cd1ba7daf4.jpg'
      "
      alt="cover"
      class="cover"
      @click="showPictures"
    />
    <div class="rightArrow" @click="nextIndex" v-if="event.images.length > 0">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <h1>
      <span class="headingHighlight">{{ event.city }}</span>
    </h1>
    <span class="book-now desktop">
      <h3>{{ returnDate(event.startDate, event.endDate) }}</h3>
      <button
        :class="outDated() ? 'btn-disabled' : ''"
        @click="goToBookingProccesss"
      >
        <p>BOOK NOW</p>
      </button>
    </span>
  </div>
  <div class="event-detailed-container">
    <div class="mobile-book">
      <span class="book-now">
        <h3>{{ returnDate(event.startDate, event.endDate) }}</h3>
        <button
          :class="outDated() ? 'btn-disabled' : ''"
          @click="goToBookingProccesss"
        >
          <p>BOOK NOW</p>
        </button>
      </span>
    </div>
    <div class="detailed-info-destination" v-if="event.destinationDescription">
      <h2 class="headingHighlight">{{ event.country }}, {{ event.city }}</h2>
      <p>{{ event.destinationDescription }}</p>
    </div>

    <div class="detailed-info-destination" v-if="event.eventDescription">
      <span>
        <h2 class="headingHighlight">The event:</h2>
        <p>{{ event.eventDescription }}</p>
        <span v-if="event.links">
          <p style="font-weight: bold">Additional links:</p>
          <!-- TODOO CHECK KEY IF ALWAYS UNIQE!!?? -->
          <div class="links">
            <span v-for="(x, index) in event.links" :key="index">
              <a :href="x.linkDescription" target="_blank">{{ x.linkTitle }}</a>
            </span>
          </div>
        </span>
      </span>
    </div>
    <div class="detailed-info-destination" v-if="event.customFields.length > 0">
      <h2 class="headingHighlight">SPECIAL NOTES</h2>
      <p v-for="x in event.customFields" :key="x">
        - {{ x.customFieldDescription }}
      </p>
      <div class="rh-marg">
        <button @click="showParticipants" class="button-styled-3">
          Show attendents
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BookEvent from "../components/events/BookEvent.vue";
import ZoomInPictureModal from "../components/modals/ZoomInPictureModal.vue";
import ShowParticipants from "../components/modals/ShowParticipants1.vue";
export default {
  name: "Event",
  data() {
    return {
      showBookingModal: false,
      eventID: this.$route.params.id,
      usp: new URLSearchParams(),
      event: null,
      zoomInCover: false,
      imageIndex: 0,
      showParticipantsModal: false,
    };
  },

  async created() {
    this.getEvent();
  },

  computed: {
    showParticipantsModalComp() {
      return this.showParticipantsModal;
    },
  },

  components: {
    BookEvent,
    ZoomInPictureModal,
    ShowParticipants,
  },

  methods: {
outDated(){
return this.event.deadLine <= new Date().toLocaleDateString();
},

    showParticipants() {
      this.showParticipantsModal = true;
    },

    async getEvent() {
      this.$store.getters["eventStore/events"].forEach((event) => {
        if (event.id === this.$route.params.id) {
          this.event = event;
          this.$store.dispatch("eventStore/setSelectedEvent", this.event);
        }
      });
    },

    async goToBookingProccesss() {
      if (!this.checkIfSameEventAsEarlier()) {
        this.$store.dispatch("bookingStore/resetBooking");
        this.$store.dispatch("bookingStore/updateBooking", {
          ...this.$store.getters["bookingStore/booking"],
          selectedStartDate: this.event.startDate,
          selectedEndDate: this.event.endDate,
        });
      }
      this.showBookingModal = true;
    },
    closeBookingModal(closeModal) {
      this.showBookingModal = closeModal;
      this.showParticipantsModal = closeModal;
    },

    checkIfSameEventAsEarlier() {
      try {
        return (
          this.eventID ===
          this.$store.getters["bookingStore/booking"].selectedEvent.id
        );
      } catch (error) {
        console.log(error);
      }
    },

    returnDate(date, date2) {
      let x = new Date(date);
      let y = new Date(date2);
      return `${x.getDate()}/${x.getMonth() + 1} - ${y.getDate()}/${
        y.getMonth() + 1
      } ${y.getFullYear()} `;
    },
    showPictures() {
      if (this.event.images.length) {
        this.zoomInCover = true;
      }
      // document.body.classList.add("modal-open");
    },

    prevIndex() {
      if (this.imageIndex - 1 < 0) {
        this.imageIndex = this.event.images.length - 1;
      } else {
        this.imageIndex -= 1;
      }
    },

    nextIndex() {
      if (this.imageIndex + 1 >= this.event.images.length) {
        this.imageIndex = 0;
      } else {
        this.imageIndex += 1;
      }
    },
  },
};
</script>


<style scoped>
.btn-disabled {
  pointer-events: none;
  opacity: 0.4;
}
.rh-marg {
  margin-left: auto;
  margin-right: 0;
}
.detailed-banner {
  background-image: url(http://res.cloudinary.com/simpleview/image/upload/v1597924305/clients/norway/alpine_voss_resort_vestland_fjord_norway_credits_hunnalvatn_media_2_1_2df89176-d7c8-4bb7-b7f4-88cd1ba7daf4.jpg);
  background-size: cover;
  background-position: center;
  min-height: 40vh;
  margin-bottom: 15px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  position: relative;
}

.cover {
  height: 100%;
  position: absolute;
  width: 100%;
  object-fit: cover;
}

.detailed-banner h1 {
  text-align: start;
  font-size: 40px;
  justify-self: center;
}

.book-now {
  width: 100%;
  grid-column-start: 3;
  justify-self: center;
  align-self: end;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
}

.book-now h3 {
  background: #705a9b;
  width: 190px;
  border-radius: 10px;
  padding: 5px;
  box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px 1px, rgb(0 0 0 / 14%) 0px 2px 2px 0px,
    rgb(0 0 0 / 12%) 0px 1px 5px 0;
}

.detailed-banner button {
  width: 100%;
  max-width: 200px;
  max-height: 60px;
  box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px 1px, rgb(0 0 0 / 14%) 0px 2px 2px 0px,
    rgb(0 0 0 / 12%) 0px 1px 5px 0;
}

.detailed-banner button:hover {
  background-color: #af3c3c;
}

.event-detailed-container {
  width: 100%;
  max-width: 1400px;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 600px));
  /* grid-template-rows: 2fr 2fr 1fr; */
  grid-template-rows: repeat(auto-fill, minmax(300px, 1fr));
  /* background-color: white; */
  border-radius: 30px;
  margin: auto;
  margin-bottom: 20px;
  justify-content: center;
}

.detailed-info-destination {
  width: 90%;
  padding: 10px 20px 10px 20px;
  background-color: #ffffff;
  border-radius: 20px;
  color: #1e1e1e;
  margin: 10px;
}

.detailed-info-destination p {
  color: #1e1e1e;
  text-align: left;
  font-size: large;
}

.event {
  background-color: #6243a0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.rules {
  background-color: #3d1e7b;
}

img:hover {
  cursor: pointer;
}

/* arrows */
.leftArrow {
  place-self: center;
  display: flex;
  flex-direction: row-reverse;
  grid-area: left;
  cursor: pointer;
  position: absolute;
  z-index: 1;
  top: -170px;
  left: 25px;
}

.rightArrow {
  place-self: center;
  display: flex;
  grid-area: right;
  cursor: pointer;
  position: absolute;
  top: -170px;
  right: 25px;
}

.leftArrow span {
  display: block;
  width: 20px;
  height: 20px;
  border-bottom: 5px solid white;
  border-left: 5px solid white;
  margin: -5px;
  transform: rotate(45deg);
  animation: scroll 2s infinite;
}
.rightArrow span {
  display: block;
  width: 20px;
  height: 20px;
  border-top: 5px solid white;
  border-right: 5px solid white;
  margin: -5px;
  transform: rotate(45deg);
  animation: scroll 2s infinite;
}
.leftArrow span:nth-child(2),
.rightArrow span:nth-child(2) {
  animation-delay: 0.2s;
}
.leftArrow span:nth-child(3),
.rightArrow span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes scroll {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(0px, 0px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(0px, 0px);
  }
}

.links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.mobile-book {
  display: none;
}

@media screen and (max-width: 700px) {
  .desktop {
    display: none;
  }

  .event-detailed-container {
    grid-template-rows: repeat(auto-fill, minmax(150px, 1fr));
  }

  .detailed-banner {
    position: relative;
    width: 100vw;
    min-height: 25vh;
    display: flex;
    flex-direction: column;
  }
  .detailed-banner button {
    width: 76%;
    max-width: 76%;
  }
  .detailed-banner h1 {
    align-self: center;
  }

  .book-now h3 {
    width: 92%;
    border-radius: 7px;
  }
  .book-now button {
    width: 94%;
  }

  .mobile-book {
    display: flex;
    flex-direction: column;
  }
}
@media screen and (max-width: 600px) {
  .event-detailed-container {
    grid-template-columns: repeat(auto-fit, minmax(200px, 600px));
  }
  .detailed-info-destination {
    width: unset;
  }
}
</style>