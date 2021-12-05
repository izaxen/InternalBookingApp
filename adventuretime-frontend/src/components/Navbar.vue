<template>
  <header>
    <div class="navbar-container">
      <div class="logo-navbar">
        <router-link to="/"><img src="../assets/logo.png" /></router-link>
      </div>
      <div class="links">
        <router-link to="/" class="nav">Nomadplaces</router-link>
        <router-link to="/my-page" class="nav">My page</router-link>
      </div>
      <div class="hamburger-icon" @click="toggleHamburgerMenu">
        <span class="material-icons">
          {{ showHamburgerMenu ? "close" : "menu" }}
        </span>
      </div>
    </div>
    <HamburgerMenu
      v-if="showHamburgerMenu"
      @toggleHamburgerMenu="toggleHamburgerMenu"
    />
  </header>
</template>

<script>
import HamburgerMenu from "./HamburgerMenu.vue";
export default {
  data() {
    return {
      showHamburgerMenu: false,
    };
  },

  methods: {
    toggleHamburgerMenu() {
      this.showHamburgerMenu = !this.showHamburgerMenu;
    },
  },

  components: {
    HamburgerMenu,
  },
};
</script>

<style scoped>
.navbar-container {
  width: 100vw;
  height: 70px;
  max-height: 70px;
  min-height: 40px;
  background-color: #1e1e1e;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
  align-content: center;
  align-items: center;
  justify-content: space-between;
  z-index: 998;
  position: fixed;
  top: 0;
  text-transform: uppercase;
}

.links {
  display: flex;
  height: 40px;
  margin: auto;
}

.hamburger-icon {
  display: none;
}

.material-icons {
  margin-right: 25px;
  color: rgb(255, 255, 255);
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

a {
  text-decoration: none;
  color: white;
  font-family: "Saira Condensed";
  font-size: 30px;
  font-weight: 600;
}
img {
  width: 65%;
  max-width: 150px;
  /* object-fit: cover; */
}

.nav {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 10px;
  padding-right: 10px;
}

.nav:hover {
  cursor: pointer;
  width: 100%;
  height: 100%;
  background-color: rgb(255, 255, 255);
  transform: scale(1.02);
  color: black;
}
</style>