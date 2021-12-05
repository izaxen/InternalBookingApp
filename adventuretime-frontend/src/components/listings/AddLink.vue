<template>
  <p>Links:</p>
  <div class="linksContainer">
    <div class="customField" v-for="(link, index) in links" :key="link">
      <div class="titleField">
        <input
          class="title"
          type="text"
          v-model="link.linkTitle"
          placeholder="Field Name"
          required
          :ref="'title' + index"
        />
      </div>
      <div class="linkField">
        <input
          v-model="link.linkDescription"
          placeholder="Field Description"
          :ref="'link' + index"
        />
      </div>
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
  </div>
</template>

<script>
export default {
  props: ["links"],
  emits: ["addField", "deleteField", "deletedItem"],

  data() {
    return {};
  },

  methods: {
    addField() {
      this.$emit("addField", "link");
    },
    deleteField() {
      this.$emit("deleteField", "link");

      let index = this.$props.links.length - 1;
      let obj = {
        type: "links",
        ref: "title" + index,
        ref2: "link" + index,
      };

      // sending this deleted LINK's title and link ref to parent to check and remove it from fieldsWithErrorCSSArray
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

.customField {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

input {
  width: -webkit-fill-available;
}

.titleField {
  grid-column-start: 1;
  width: -webkit-fill-available;
  margin: 0.5rem;
}

.linkField {
  grid-column-start: span 2;
  width: -webkit-fill-available;
  margin: 0.5rem;
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