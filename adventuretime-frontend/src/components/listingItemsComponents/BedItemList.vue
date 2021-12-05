<template>
  <div class="itemContainer">
    <BedItem
      :bedsProp="beds"
      @showThisBed="showThisBed($event)"
      @addBed="addBed"
    />
  </div>
</template>

<script>
import BedItem from "./BedItem.vue";
export default {
  emits: ["showThisBed", "addBed"],
  props: ["beds"],

  components: {
    BedItem,
  },

  data() {
    return {};
  },

  watch: {
    // accommodationProp(newValue) {
    //   this.acc = newValue;
    // },
  },

  methods: {
    addBed() {
      this.$emit("addBed");
    },

    showThisBed(bedIndex) {
      this.$emit("showThisBed", bedIndex);
    },
  },
};
</script>

<style scoped>
* {
  color: black;
}
.item {
  border: outset;
  position: relative;
  margin: 1rem 0.5rem 1rem 0.5rem;
}

.itemContainer {
  border: outset;
  /* height: 7.5rem; */
  position: relative;
  margin: 1rem 0.5rem 1rem 0.5rem;
}
</style>