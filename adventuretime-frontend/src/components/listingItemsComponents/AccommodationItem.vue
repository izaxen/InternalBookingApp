<template class="comp">
  <div class="delete" @click="deleteAcc">+</div>
  <div class="itemContainer">
    <div class="header">
      <p class="title">Accommodation:</p>
      <p class="text" @click="showThisAcc">
        {{
          stringSizeCheck(acc.accommodationTitle, 20) +
          " (" +
          acc.rooms.length +
          " rooms)"
        }}
      </p>
    </div>
    <div class="childItemContainer">
      <div class="item" v-for="(room, index) in acc.rooms" :key="room">
        <div class="deleteInList" @click="deleteRoom(index)">+</div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3837/3837750.png"
          alt=""
          @click="showThisRoom(index)"
        />

        <div
          v-if="room.roomTitle != ''"
          class="itemContainer1"
          @click="showThisRoom(index)"
        >
          {{ stringSizeCheck(room.roomTitle, 7) }}
        </div>
        <div :style="{ 'font-Size': 'small' }" @click="showThisRoom(index)">
          ({{ room.beds.length + " " }}Beds)
        </div>
      </div>
      <div class="item" @click="addRoom()">
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
  emits: ["showThisRoom", "showThisAcc", "deleteAcc", "deleteRoom", "addRoom"],
  props: ["accommodationProp"],

  data() {
    return {
      acc: this.$props.accommodationProp,
    };
  },

  created() {},

  watch: {
    accommodationProp(newValue) {
      this.acc = newValue;
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

    deleteAcc() {
      this.$emit("deleteAcc");
    },

    deleteRoom(index) {
      this.$emit("deleteRoom", index);
    },

    showThisRoom(index) {
      this.$emit("showThisRoom", index);
    },

    showThisAcc() {
      this.$emit("showThisAcc");
    },

    addRoom() {
      this.$emit("addRoom");
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
  /* height: 2rem; */
  display: flex;
  place-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
  height: 4.5rem;
}

img {
  height: 2em;
  width: 2em;
  align-self: center;
}
</style>