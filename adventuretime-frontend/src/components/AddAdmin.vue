<template>
  <div class="main-container">
    <form class="adder" @submit.prevent="addNewAdmin">
      <input type="email" placeholder="Enter new admin email" v-model="newAdmin" required size="30" />
      <button class="button-styled-1">Save new admin</button>
    </form>
    <div class="new-User" v-show="showResponse">{{ response }}</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newAdmin: "",
      response: "",
    }
  },

  computed: {
    showResponse() {
      return this.response;
    }
  },

  methods: {
    async addNewAdmin() {
      const query = new URLSearchParams();
      query.append("email", this.newAdmin)
      this.response = await this.$store.dispatch('eventStore/addAdmin', query);
      this.clearscreen();

    },

    clearscreen() {
      this.newAdmin = ""
    }
  },


}
</script>

<style scoped>
.adder {
  margin: 30px;
}
input{
  box-shadow: 0 8px 8px black;
  margin-right:15px;
}

</style>