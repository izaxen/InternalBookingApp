/* eslint-disable no-unused-vars */
<template>
  <div class="home-container">
    <h1>
      <!-- <span class="headingHighlight">WELCOME TO ***** NOMAD PORTAL</span> -->
      WELCOME TO **** NOMAD PORTAL
    </h1>
    <!-- <div class="banner"><h1>WELCOME TO ***** NOMAD PORTAL</h1></div> -->
    <div v-for="event in updateEvents" :key="event.id">
      <EventCard v-if="checkDate(event.endDate)" class="event-card" :event="event" />
    </div>
   
      <div class="border-bottom-grey width-95"></div>
      
    <div  v-if="!showOldEvent" class="place-rh" @click="expandOld()">Show old events +</div>
    <div  v-if="showOldEvent" class="place-rh" @click="expandOld()">Hide old events -</div>
      <div v-show="showOldEvent">
        <div v-for="event in updateEvents" :key="event.id">
          <EventCard v-if="loopOldEvent(event.endDate)" class="event-card" :event="event" />
        </div>
      </div>
   
    </div>
</template>

<script>
import EventCard from "../components/events/EventCard.vue";

export default {
  name: "Home",
  data() {
    return {
      outDatedEvent: false,
      events: this.$store.getters["eventStore/events"],
    };
  },

  computed: {
    updateEvents() {
      return this.$store.getters["eventStore/events"];
    },
    showOldEvent() {
      return this.outDatedEvent;
    }

  },
  methods: {
    checkDate(eventDate) {
      return eventDate >= new Date().toLocaleDateString();
    },
    loopOldEvent(eventDate) {
      return new Date().toLocaleDateString() > eventDate;
    },
    expandOld() {
      this.outDatedEvent ? this.outDatedEvent = false : this.outDatedEvent = true;
    }
  },

  components: {
    EventCard,
  },
};
</script>

<style scoped>
.place-rh {
  float: right;
  
  margin: 20px 5%;
  
}
.headingHighlight {
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: xxx-large;
}
.home-container h1 {
  font-size: 6rem;
  font-family: "Saira Condensed";
  color: white;
}
.event-card:hover {
  cursor: pointer;
}

@media screen and (min-width: 1920px) {
  .home-container h1 {
    font-size: 8rem;
  }
}
@media screen and (max-width: 800px) {
  .home-container h1 {
    font-size: 5rem;
  }
}
@media screen and (max-width: 490px) {
  .home-container h1 {
    font-size: 4rem;
  }
}
</style>