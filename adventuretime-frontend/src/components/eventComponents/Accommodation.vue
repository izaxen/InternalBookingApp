<template>
  <h1>
    <span class="headingHighlight">3. Accommodation</span>
  </h1>
  <div class="accommodationTitleContainer">
    <p>* Title:</p>
    <input
      type="text"
      v-model="acc.accommodationTitle"
      required
      @change="updateEvent"
      ref="titleInput"
    />
  </div>
  <div class="accommodationDescriptionContainer">
    <p>Description:</p>
    <textarea
      cols="35"
      rows="5"
      v-model="acc.accommodationDescription"
      @change="updateEvent"
    />
  </div>
  <RoomItemList
    :rooms="acc.rooms"
    @addRoom="addRoom"
    @showThisRoom="showThisRoom($event)"
    @deleteRoom="deleteRoom($event)"
    @addBed="addBed($event)"
    @showThisBed="showThisBed($event)"
  />
  <!-- <div class="buttonContainer">
    <button class="button-styled-2" type="button" @click="backToPrevStep">
      ↩
    </button>
  </div> -->
</template>

<script>
import RoomItemList from "../listingItemsComponents/RoomItemList.vue";
export default {
  emits: [
    "updateEvent",
    "backToPrevStep",
    "addRoom",
    "showThisRoom",
    "deleteRoom",
    "addBed",
    "showThisBed",
  ],
  props: ["accommodationProp"],

  components: {
    RoomItemList,
  },

  data() {
    return {
      acc: this.$props.accommodationProp,
    };
  },

  watch: {
    accommodationProp(newValue) {
      this.acc = newValue;
    },
  },

  methods: {
    addRoom() {
      this.$emit("addRoom");
    },

    // when user changed anything, emit the change to parent to make live update without having to click save
    updateEvent() {
      let tempObj = {
        accommodationTitle: this.acc.accommodationTitle,
        accommodationDescription: this.acc.accommodationDescription,
        rooms: this.acc.rooms,
        type: "accommodation",
      };

      this.$emit("updateEvent", tempObj);
    },

    backToPrevStep() {
      // this.restoreCSS();
      // if (this.acc.accommodationTitle) {
      let tempObj = {
        type: "accommodation",
      };

      //   this.$emit("backToPrevStep", tempObj);
      // } else {
      //   // this.$refs.titleInput.style.borderWidth = "2px";
      //   this.$refs.titleInput.style.borderColor = "red";
      // }

      this.$emit("backToPrevStep", tempObj);
    },

    showThisRoom(roomIndex) {
      let obj = {
        roomIndex: roomIndex,
      };
      this.$emit("showThisRoom", obj);
    },

    deleteRoom(roomIndex) {
      this.acc.rooms.splice(roomIndex, 1);
      this.updateEvent();
    },

    addBed(roomIndex) {
      this.$emit("addBed", roomIndex);
    },

    showThisBed(bedAndRoomIndexObj) {
      this.$emit("showThisBed2", bedAndRoomIndexObj);
    },
  },
};
</script>

<style scoped>
p {
  color: purple;
}

.headingHighlight {
  margin-bottom: 20px;
  color: white;
}
</style>