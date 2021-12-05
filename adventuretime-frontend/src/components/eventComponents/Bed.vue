<template>
  <h1>
    <span class="headingHighlight">5. Beds</span>
  </h1>
  <div class="bedDescriptionContainer">
    <p>* Bed Size:</p>

    <select v-model="size" class="bedSizeSelect" required @change="updateEvent">
      <option value="SingleBed">Single-Bed</option>
      <option value="DoubleBed">Double-Bed</option>
    </select>
  </div>

  <div class="shareableContainer" v-if="size === 'DoubleBed'">
    <p>Shareable:</p>
    <div class="checkBoxContainer">
      <input
        value="true"
        type="checkbox"
        v-model="isShareable"
        @change="updateEvent"
      />
    </div>
  </div>

  <!-- <div class="buttonContainer">
    <button class="button-styled-2" @click="backToPrevStep">↩</button>
  </div> -->
</template>

<script>
export default {
  emits: ["updateEvent", "backToPrevStep"],
  props: ["bedProp", "bedIndex"],
  data() {
    return {
      size: this.$props.bedProp.bedSize,
      isShareable: this.$props.bedProp.isShareable,
    };
  },

  watch: {
    bedProp() {
      this.size = this.$props.bedProp.bedSize;
      this.isShareable = this.$props.bedProp.isShareable;
    },
  },

  methods: {
    updateEvent() {
      if (!this.isShareable && this.size == "DoubleBed") {
        this.isShareable = false;
      }
      let tempObj = {
        size: this.size,
        shareable: this.isShareable,
        type: "bed",
      };

      this.$emit("updateEvent", tempObj);
    },

    backToPrevStep() {
      let tempObj = {
        type: "bed",
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