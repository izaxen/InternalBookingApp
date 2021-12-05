<template>
  <div class="delete" @click="deleteRoom">+</div>
  <div class="itemContainer">
    <div class="header">
      <p class="title">Room:</p>
      <p class="text" @click="showThisRoom">
        {{
          stringSizeCheck(room.roomTitle, 20) +
          " (" +
          room.beds.length +
          " beds)"
        }}
      </p>
    </div>
    <div class="childItemContainer">
      <div class="item" v-for="(bed, index) in room.beds" :key="bed">
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
          @click="showThisBed(index)"
          v-if="bed.bedSize === 'DoubleBed'"
          :style="{ 'font-size': 'small' }"
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
  emits: ["showThisRoom", "deleteRoom", "addBed", "showThisBed", "deleteBed"],
  props: ["roomProp"],

  data() {
    return {
      room: this.$props.roomProp,
    };
  },

  watch: {
    roomProp(newValue) {
      this.room = newValue;
    },
  },

  methods: {
    stringSizeCheck(string, size) {
      if (string.length > size) {
        return string.slice(0, size - 3) + "...";
      } else {
        return string;
      }
    },

    showThisRoom() {
      this.$emit("showThisRoom");
    },

    deleteRoom() {
      this.$emit("deleteRoom");
    },

    deleteBed(index) {
      this.$emit("deleteBed", index);
    },

    showThisBed(index) {
      this.$emit("showThisBed", index);
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

.itemContainer p {
  margin: 0.2rem;
  min-height: 1rem;
  position: relative;
}

.itemContainer {
  display: grid;
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
  position: absolute;
  left: 1rem;
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