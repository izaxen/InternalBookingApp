<template>
  <div class="main-container border-radius">
    <div class="close">
      <label @click="closeModal">&#10006;</label>
    </div>
    <ListAllBookings :listAll="true" :event="event" />
  </div>
</template>

<script>
import ListAllBookings from '../ListAllBookings.vue'
export default {
  props: ['event'],
  components: {
    ListAllBookings
  },
  methods: {
    closeModal() {
      this.$emit("closeModal", false)
    }

  },
}
</script>

<style scoped>
label {
  margin: 15px;
  color: black;
  font-size: 30px;
}

.close {
  display: flex;
  justify-content: flex-end;
  margin-bottom: -40px;
}
.main-container {
  background-color: white;
}
</style>