<template>
  <div class="admin-container">
    <h1>
      <span class="headingHighlight">ADMIN PAGE</span>
    </h1>
    <button
      class="button-styled-2 mg-rh-10"
      @click="showComponent('addEvent')"
      id="scrollToWhenError"
    >
      Add event
    </button>
    <button
      class="button-styled-2 mg-rh-10"
      @click="showComponent('editEvent')"
    >
      Edit event
    </button>
    <button class="button-styled-2 mg-rh-10" @click="showAllBookings">
      Check all bookings
    </button>
    <button class="button-styled-2 mg-rh-10" @click="showAddAdminModule">
      Add new admin
    </button>
    <div v-if="whatComponentToShow == 'editEvent'">
      <EditEvent />
    </div>
    <div v-if="whatComponentToShow == 'addEvent'">
      <AddEvent />
    </div>
    <div v-if="showNewAdmin">
      <AddAdmin />
    </div>
    <div v-if="showListAllBookings">
      <ListAllBookings />
    </div>
  </div>
</template>

<script>
import AddEvent from "../components/events/AddEvent.vue";
import EditEvent from "../components/events/EditEvent.vue";
import ListAllBookings from "../components/ListAllBookings.vue";
import AddAdmin from "../components/AddAdmin.vue";
export default {
  name: "Admin",
  data() {
    return {
      whatComponentToShow: "",
      showListAllBookings: false,
      showAddAdmin: false,
    };
  },
  computed: {
    showNewAdmin() {
      return this.showAddAdmin;
    },
  },

  components: {
    AddEvent,
    EditEvent,
    ListAllBookings,
    AddAdmin,
  },
  methods: {
    showAddAdminModule() {
      this.showListAllBookings = false;
      this.showAddAdmin = true;
      this.whatComponentToShow = "";
    },

    showAllBookings() {
      this.showAddAdmin = false;
      this.showListAllBookings = true;
      this.whatComponentToShow = "";
    },

    showComponent(componentName) {
      this.showAddAdmin = false;
      this.showListAllBookings = false;
      this.whatComponentToShow = componentName;
    },
  },
};
</script>

<style scoped>
.admin-container {
}
h1 {
  margin-bottom: 70px;
}
</style>