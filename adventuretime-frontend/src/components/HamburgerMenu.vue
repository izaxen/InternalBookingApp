<template>
  <div class="hamburger-menu-wrapper">
    <div class="hamburger-menu shadow">
      <router-link to="/" class="ham-item" @click="toggleHamburgerMenu"
        >Nomadplaces</router-link
      >
      <router-link to="/my-page" class="ham-item" @click="toggleHamburgerMenu"
        >My page</router-link
      >
      <router-link
        to="/admin"
        class="ham-item"
        @click="toggleHamburgerMenu"
        v-if="isAdmin"
        >Admin</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  emits: ["toggleHamburgerMenu"],
  data() {
    return {
      admin: this.$store.getters['eventStore/admin']
    };
  },
  computed: {
    isAdmin() {
      return this.admin;
    },
  },
  
  methods: {
    toggleHamburgerMenu() {
      this.$emit("toggleHamburgerMenu");
    },
  },
};
</script>

<style scoped>
.hamburger-menu-wrapper {
  position: fixed;
  z-index: 999;
  display: flex;
  width: 65%;
  top: 70px;
  right: 0;
}
.hamburger-menu {
  display: flex;
  flex-direction: column;
  /* background-color: aqua; */
  width: 100%;
  background-image: linear-gradient(180deg, #1e1e1e, #3d1e7b);
  padding-bottom: 15px;
  border-radius: 0px 0 0 10px;
}

.hamburger-menu a {
  font-size: x-large;
  text-decoration: none;
  font-weight: bold;
  color: white;
  text-align: end;
  margin: 15px;
}

@media screen and (max-width: 550px) {
  .links {
    display: none;
  }
}
@media screen and (max-width: 550px) {
  .hamburger-icon {
    display: flex;
    justify-content: flex-end;
  }
}
</style>