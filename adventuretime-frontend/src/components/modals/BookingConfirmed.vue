<template>
  <div v-if="deactivateLoader" class="loader"></div>

  <div v-else class="main-container-confirmed border-radius">
    <div class="close">
      
      <div v-if="bookingResponse">
        <p>Your booking is now processed and OK</p>
        <p>Have a nice trip!</p>
      </div>
      <div v-else>
        <p>Your booking has encountered a problem.</p>
        <p>Please redo your booking</p>
      </div>
      <label @click="closeModal()">Close &#10006;</label>
    </div>
  </div>
</template>

<script>
export default {
  props: ['bookingResponse'],
  emits: ['closeModal'],
  data() {
    return {
      loader: true,
    }
  },

  watch: {
    bookingResponse() {
      this.changeLoaderStatus();
    }
  },

  computed: {

    deactivateLoader() {
      return this.loader;
    }
  },

  methods: {
    changeLoaderStatus() {
      if (this.bookingResponse !== undefined) {
        this.loader = false;
      }
    },
    closeModal() {
      this.$store.dispatch("eventStore/getEvents");
      this.$store.dispatch("bookingStore/resetBookingAction");
      this.$emit("closeModal", false);
    },
  }
}
</script>

<style scoped>
.close{
  margin-top:25px;
}
.main-container-confirmed {
  width: 300px;
  height: 160px;
  background-color: rgb(255, 255, 255);
  border: solid 2px #3d1e7b;
  
}
p, label{
  color: black;
  font-family: "Saira Condensed";
  font-size: larger;
}
label{
  margin-top:35px;
}
</style>