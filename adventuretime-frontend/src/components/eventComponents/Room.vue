<template>
  <h1>
    <span class="headingHighlight">4. Rooms</span>
  </h1>
  <div class="roomTitleContainer">
    <p>* Title:</p>
    <input
      type="text"
      v-model="room.roomTitle"
      required
      @change="updateEvent"
      ref="titleInput"
    />
  </div>
  <div class="roomDescriptionContainer">
    <p>Description:</p>
    <textarea
      cols="35"
      rows="5"
      v-model="room.roomDescription"
      @change="updateEvent"
    />
  </div>

  <BedItemList
    :beds="room.beds"
    @addBed="addBed()"
    @showThisBed="showThisBed($event)"
    ref="bed"
    id="bed"
  />
  <!-- <div class="buttonContainer">
    <button class="button-styled-2" type="button" @click="backToPrevStep">
      ↩
    </button>
  </div> -->
</template>

<script>
import BedItemList from "../listingItemsComponents/BedItemList.vue";
export default {
  emits: ["updateEvent", "backToPrevStep", "addBed", "showThisBed"],
  props: ["roomProp", "roomIndexProp"],
  components: {
    BedItemList,
  },

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
    addBed() {
      this.$emit("addBed", this.$props.roomIndexProp);
    },

    showThisBed(bedIndex) {
      let obj = {
        bedIndex: bedIndex,
      };
      this.$emit("showThisBed", obj);
    },

    updateEvent() {
      let tempObj = {
        roomTitle: this.room.roomTitle,
        roomDescription: this.room.roomDescription,
        beds: this.room.beds,
        type: "room",
      };

      this.$emit("updateEvent", tempObj);
    },

    backToPrevStep() {
      let tempObj = {
        type: "room",
      };
      this.$emit("backToPrevStep", tempObj);
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