<template>
  <p>Custom Fields:</p>

  <div
    class="customField"
    v-for="(customField, index) in this.customFields"
    :key="customField"
  >
    <textarea
      cols="35"
      rows="5"
      v-model="customField.customFieldDescription"
      placeholder="Field Description"
      :ref="'text' + index"
    />
  </div>
  <div class="btnContainer">
    <img
      src="https://img.icons8.com/color/48/000000/add--v2.png"
      @click="addField"
    />
    <img
      src="https://img.icons8.com/color/48/000000/minus.png"
      @click="deleteField"
    />
  </div>
</template>

<script>
export default {
  props: ["customFields"],
  emits: ["addField", "deleteField", "deletedItem"],

  data() {
    return {};
  },

  methods: {
    addField() {
      this.$emit("addField", "customField");
    },
    deleteField() {
      this.$emit("deleteField", "customField");

      let index = this.$props.customFields.length - 1;
      let obj = {
        type: "customFields",
        ref: "text" + index,
      };

      // sending this deleted customField's ref to parent to check and remove it from fieldsWithErrorCSSArray
      this.$emit("deletedItem", obj);
    },
  },
};
</script>

<style scoped>
p {
  color: purple;
  font-size: x-large;
}

input {
  max-width: 26vw;
  min-width: 26vw;
}

textarea {
  min-width: 0;
  width: -webkit-fill-available;
}

.title {
  min-width: 10vw;
  max-height: 2vw;
  margin-right: 8px;
}

.customField {
  margin: 0;
  margin-bottom: 8px;
  display: flex;
  /* justify-content: space-between; */
  justify-content: center;
}

.btnContainer {
  justify-content: space-around;
  display: flex;
}

button {
  margin: auto;
}

img {
  cursor: pointer;
}
</style>