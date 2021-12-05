<template>
  <h1>
    <span class="headingHighlight">2. Accommodations</span>
  </h1>
  <div
    class="itemContainer"
    v-for="(accommodation, index) in accommodationList"
    :key="accommodation"
  >
    <div class="item" @click.self="showThisAcc(index)">
      <AccommodationItem
        :accommodationProp="accommodation"
        @deleteRoom="deleteRoom($event, index)"
        @showThisRoom="showThisRoom($event, index)"
        @showThisAcc="showThisAcc(index)"
        @deleteAcc="deleteAcc(index)"
        @addRoom="addRoom(index)"
      />
    </div>
  </div>
  <div class="addItem">
    <img
      @click="addAcc"
      src="https://cdn-icons-png.flaticon.com/512/875/875515.png"
      alt=""
    />
    <!-- <button class="button-styled-2" type="submit" @click="addAcc">
      Add Accommodation
    </button> -->
  </div>
</template>

<script>
import AccommodationItem from "./AccommodationItem.vue";
export default {
  emits: [
    "addAcc",
    "showThisAcc",
    "showThisRoom",
    "addRoom",
    "deleteAcc",
    "deleteRoom",
    "hasDeletedItem",
  ],
  props: ["accommodations"],

  components: {
    AccommodationItem,
  },

  data() {
    return {
      accommodationList: this.$props.accommodations,
    };
  },

  methods: {
    addAcc() {
      this.$emit("addAcc", "addAccommodation");
    },

    showThisAcc(index) {
      this.$emit("showThisAcc", index);
    },

    showThisRoom(roomIndex, accIndex) {
      let ri = roomIndex;
      let ai = accIndex;

      let obj = {
        roomIndex: ri,
        accIndex: ai,
      };

      this.$emit("showThisRoom", obj);
    },

    updateEvent(type) {
      let obj = {
        type: type,
        accommodations: this.accommodationList,
      };
      this.$emit("hasDeletedItem", obj);
    },

    deleteAcc(index) {
      this.accommodationList.splice(index, 1);
      this.updateEvent("accommodations");
    },

    deleteRoom(roomIndex, accIndex) {
      this.accommodationList[accIndex].rooms.splice(roomIndex, 1);
      this.updateEvent("accommodations");
    },

    addRoom(accIndex) {
      let obj = {
        accIndex: accIndex,
      };
      this.$emit("addRoom", obj);
    },
  },
};
</script>

<style scoped>
.item {
  border: outset;
  /* height: 7.5rem; */
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

.headingHighlight {
  margin-bottom: 20px;
  color: white;
}
</style>