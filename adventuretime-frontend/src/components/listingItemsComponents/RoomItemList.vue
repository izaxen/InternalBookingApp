<template>
  <div class="itemContainer" v-for="(room, index) in rooms" :key="room">
    <div class="item" v-if="room.roomTitle || room.beds.length > 0">
      <RoomItem
        :roomProp="room"
        @showThisRoom="showThisRoom(index)"
        @deleteRoom="deleteRoom(index)"
        @addBed="addBed(index)"
        @showThisBed="showThisBed($event, index)"
        @deleteBed="deleteBed($event, index)"
      />
    </div>
  </div>
  <div class="addItem" @click="addRoom">
    <img src="https://cdn-icons-png.flaticon.com/512/875/875515.png" alt="" />
  </div>
  <!-- <div class="addItem">
    <button class="button-styled-2" type="submit" @click="addRoom">
      Add Room
    </button>
  </div> -->
</template>

<script>
import RoomItem from "./RoomItem.vue";
export default {
  emits: [
    "addRoom",
    "showThisRoom",
    "deleteRoom",
    "addBed",
    "showThisBed",
    "deleteBed",
  ],
  props: ["rooms"],

  components: {
    RoomItem,
  },

  data() {
    return {};
  },

  methods: {
    addRoom() {
      this.$emit("addRoom");
    },

    showThisRoom(index) {
      this.$emit("showThisRoom", index);
    },

    deleteRoom(index) {
      this.$emit("deleteRoom", index);
    },

    deleteBed(bedIndex, roomIndex) {
      this.$props.rooms[roomIndex].beds.splice(bedIndex, 1);
    },

    addBed(roomIndex) {
      this.$emit("addBed", roomIndex);
    },

    showThisBed(bedIndex, roomIndex) {
      let obj = {
        bedIndex: bedIndex,
        roomIndex: roomIndex,
      };

      this.$emit("showThisBed", obj);
    },
  },
};
</script>

<style scoped>
.item {
  border: outset;
  position: relative;
  margin: 1rem 0.5rem 1rem 0.5rem;
  color: black;
}

.addItem {
  display: flex;
  place-content: center;
}

img {
  height: 2em;
  width: 2em;
  align-self: center;
}
</style>