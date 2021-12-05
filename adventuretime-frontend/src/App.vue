<template>
  <div v-if="{ accountName } && getEvents">
    <div v-if="isAdmin">
      <Navbar-admin />
    </div>
    <div v-else>
      <Navbar />
    </div>

    <div class="main-container">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import NavbarAdmin from "./components/NavbarAdmin.vue";

export default {
  data() {
    return {
      accountName: this.$store.getters["eventStore/accountName"],
      admin: false,
    };
  },

  async beforeMount() {
    await this.$store.dispatch("eventStore/adminAuth");
    this.admin = this.$store.getters["eventStore/admin"];
  },

  computed: {
    getEvents() {
      return this.$store.getters["eventStore/events"];
    },
    isAdmin() {
      return this.admin;
    },
  },

  components: {
    Navbar,
    NavbarAdmin,
  },
  created() {
    this.$store.dispatch("eventStore/getAccountName");
    this.$store.dispatch("eventStore/getEvents");
  },
  methods: {
    scrollToTop() {
      window.scrollTo(0, 0);
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Anton&family=Saira+Condensed:wght@400;700&family=Teko&display=swap");

#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif; */
  font-family: "Saira Condensed";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #ffffff;
  overflow-x: hidden;
  overflow-y: hidden;
  min-height: 100vh;
  background-image: linear-gradient(180deg, #1e1e1e, #3d1e7b);
  box-sizing: border-box;
}

.main-container {
  margin-top: 100px;
}

/* input,
textarea {
  border-radius: 10px;
  text-decoration: none;
  border: none;
  padding: 10px;
} */

.headingHighlight {
  position: relative;
  color: var(--color, #fff);
  display: inline-block;
  padding-right: 30px;
  padding-left: 30px;
  padding-top: 10px;
  padding-bottom: 10px;
  z-index: 1;
  text-shadow: 2px 2px 0 #000;
  background: #3d1e7b;
  color: #fff;
  text-transform: uppercase;
}
.headingHighlight:before,
.headingHighlight:after {
  content: "";
  position: absolute;
  display: block;
  background: #3d1e7b;
  height: 100%;
  width: 100%;
  margin-left: -3px;
  margin-right: -5px;
  padding-left: 0;
  padding-right: 0;
  z-index: -1;
}

.headingHighlight:before {
  transform: rotate(1.5deg);
  opacity: 0.7;
  top: -1px;
  left: -1px;
}

.headingHighlight:after {
  transform: rotate(-1deg);
  opacity: 0.6;
  top: 3px;
  right: 4px;
}

button {
  border-radius: 10px;
  padding: 0px 10px 0px 10px;
  border: none;
  background-color: #b12e2e;
}

button text,
h1,
h2,
p {
  color: white;
}

button:hover {
  cursor: pointer;
}

/* --------------- POP UP & MODAL --------------------- */

.popup {
  height: 85vh;
  width: 85vw;
  max-width: 1200px;
  background-color: white;
  border-radius: 20px;
  box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px 1px, rgb(0 0 0 / 14%) 0px 2px 2px 0px,
    rgb(0 0 0 / 12%) 0px 1px 5px 0;
}

.modal-open {
  overflow: hidden;
  margin: 0;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
}

.modal-wrapper {
  height: 100vh;
  width: 100vw;
  display: flex;
  vertical-align: middle;
  justify-content: center;
  align-items: center;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  font-family: Helvetica, Arial, sans-serif;
}

.editEvent *,
.addEvent * {
  color: black;
  text-align: center;
  /* margin-block-start: 0.5rem;
  margin-block-end: 0.5rem; */
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  display: block;
  margin-top: 1rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.5s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* --------------- END OF POP UP MODAL --------------------- */

.loader {
  border: 16px solid #000000; /* Light grey */
  border-top: 16px solid #3d1e7b; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.material-icons {
  font-family: "Material Icons";
  font-weight: normal;
  font-style: normal;
  font-size: 24px; /* Preferred icon size */
  display: inline-block;
  line-height: 1;
  text-transform: none;
  letter-spacing: normal;
  word-wrap: normal;
  white-space: nowrap;
  direction: ltr;
  color: #000;

  /* Support for all WebKit browsers. */
  -webkit-font-smoothing: antialiased;
  /* Support for Safari and Chrome. */
  text-rendering: optimizeLegibility;

  /* Support for Firefox. */
  -moz-osx-font-smoothing: grayscale;

  /* Support for IE. */
  font-feature-settings: "liga";
}

.shadow {
  box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px 1px, rgb(0 0 0 / 14%) 0px 2px 2px 0px,
    rgb(0 0 0 / 12%) 0px 1px 5px 0;
}

.scroll-div {
  border-radius: 10px 0px 0px 10px;
}

/* ------------ CUSTOM SCROLLBAR ----------- */

/* width */
::-webkit-scrollbar {
  width: 5px;
  border-radius: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #2c1e47;
  border-radius: 10px;
  max-height: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #705a9b;

  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #7d6f97;
}

/* ------------ END CUSTOM SCROLLBAR ----------- */

.border-radius {
  border-radius: 15px;
}
.background-color {
  background-color: #a71881;
  padding: 15px;
  color: white;
}
.border-bottom-grey {
  border-bottom: 1px solid grey;
}
.mg-rh-10 {
  margin-right: 10px;
}

.mg-10 {
  margin: 10px;
}
.width-95 {
  width: 95%;
  margin: 0 auto;
}

.button-styled-1 {
  color: white;
  background-color: #3d1e7b;
  border-radius: 10px;
  border: 1px solid black;
  padding: 8px 15px;
  font-family: "Saira Condensed";
}
.button-styled-2 {
  color: white;
  background-color: #3d1e7b;
  border-radius: 10px;
  border: 1px solid black;
  padding: 15px 20px;
  font-family: "Saira Condensed";
}
.button-styled-3 {
  color: white;
  background-color: #705a9b;
  border-radius: 10px;
  border: 1px solid black;
  padding: 8px 15px;
  font-family: "Saira Condensed";
}

.button-1 {
  color: white;
  background-color: #705a9b;
  border-radius: 10px;
  padding: 10px 20px;
  font-family: "Saira Condensed";
  box-shadow: rgb(0 0 0 / 20%) 0px 3px 1px 1px, rgb(0 0 0 / 14%) 0px 2px 2px 0px,
    rgb(0 0 0 / 12%) 0px 1px 5px 0;
}

p.bold {
  font-size: large;
  font-weight: bolder;
  margin: auto 5px;
  text-align: center;
  color: black;
  font-family: "Saira Condensed";
}
p{
  font-family: "Saira Condensed";
}
</style>
