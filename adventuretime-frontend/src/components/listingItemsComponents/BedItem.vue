<template>
  <div class="itemHolder">
    <div class="header">
      <p class="title">Beds:</p>
      <p class="text">{{ "(" + beds.length + " beds)" }}</p>
    </div>

    <div class="childItemContainer">
      <div class="item" v-for="(bed, index) in beds" :key="bed">
        <div class="deleteInList" @click="deleteBed(index)">+</div>

        <img
          v-if="bed.bedSize === 'SingleBed'"
          src="https://cdn-icons-png.flaticon.com/512/3837/3837744.png"
          alt=""
          @click="showThisBed(index)"
        />

        <img
          v-if="bed.bedSize === 'DoubleBed'"
          src="https://cdn-icons-png.flaticon.com/512/3837/3837739.png"
          alt=""
          @click="showThisBed(index)"
        />

        <div @click="showThisBed(index)">
          {{ bed.bedSize === "SingleBed" ? "Single Bed" : "Double Bed" }}
        </div>

        <div
          v-if="bed.bedSize === 'DoubleBed'"
          :style="{ 'font-size': 'small' }"
          @click="showThisBed(index)"
        >
          {{ bed.isShareable === false ? "Not Shareable" : "Shareable" }}
        </div>
      </div>

      <div class="item" @click="addBed()">
        <img
          src="https://cdn-icons-png.flaticon.com/512/875/875515.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ["showThisBed", "addBed"],
  props: ["bedsProp", "bedIndexProp"],

  data() {
    return {
      beds: this.$props.bedsProp,
      // bedIndex: this.$props.bedIndexProp,
    };
  },

  watch: {
    bedProp(newValue) {
      this.beds = newValue;
    },
    // bedIndexProp(n) {
    //   this.bedIndex = n;
    // },
  },

  methods: {
    showThisBed(index) {
      this.$emit("showThisBed", index);
    },

    deleteBed(index) {
      this.beds.splice(index, 1);
    },

    addBed() {
      this.$emit("addBed");
    },
  },
};
</script>

<style scoped>
p {
  color: black;
}
.delete {
  position: absolute;
  font-size: 25px;
  top: -6px;
  right: 2px;
  color: black;
  padding: 3px;
  cursor: pointer;
  transform: rotate(45deg);
}

.deleteInList {
  position: absolute;
  font-size: 20px;
  top: -10px;
  right: -1px;
  color: black;
  padding: 3px;
  cursor: pointer;
  transform: rotate(45deg);
}

.itemHolder p {
  margin: 0.2rem;
  min-height: 1rem;
}

.childItemContainer {
  display: grid;
  gap: 0.5rem;
  margin: 0.1rem 1rem 0.4rem 1rem;
  /* grid-template-rows: repeat(2, 1fr); */
  grid-template-columns: repeat(5, 1fr);
}

.header {
  display: flex;
  justify-content: center;
  margin: 0.2em;
  border-bottom-style: groove;
}

.header .title {
  left: 1rem;
  position: absolute;
}

.item {
  border: outset;
  display: flex;
  flex-direction: column;
  height: 4.5rem;
  justify-content: center;
  position: relative;
}

img {
  height: 2em;
  width: 2em;
  align-self: center;
}
</style>