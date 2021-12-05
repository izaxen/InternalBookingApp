<template>
  <p>Custom Survey:</p>

  <div
    class="customSurvey"
    v-for="(survey, index) in this.surveys"
    :key="survey"
  >
    <div class="questionContainer">
      <input
        :class="['title', 'title' + index]"
        type="text"
        v-model="survey.questionTitle"
        placeholder="Question Title"
        required
        :ref="'title' + index"
      />
    </div>
    <div class="selectContainer">
      <select v-model="survey.type" @change="activeOption(survey)">
        <option value="input">Open Answer</option>
        <option value="select">Select</option>
      </select>
    </div>
    <div class="customOptionsContainer" v-if="survey.type === 'select'">
      <div
        class="optionsContainer"
        v-for="(option, optionIndex) in survey.options"
        :key="optionIndex"
      >
        <input
          type="text"
          placeholder="Option"
          class="title"
          v-model="survey.options[optionIndex]"
          :ref="index + 'option' + optionIndex"
        />
      </div>
      <img
        class="addOptionContainer"
        src="https://img.icons8.com/color/48/000000/add--v2.png"
        @click="addCustomOption(survey)"
      />
      <img
        class="deleteOptionContainer"
        src="https://img.icons8.com/color/48/000000/minus.png"
        @click="removeCustomOption(survey, index + 'option')"
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
</template>

<script>
export default {
  props: ["surveys"],
  emits: ["addField", "deleteField", "deletedItem"],

  data() {
    return {};
  },

  watch: {},

  methods: {
    addField() {
      this.$emit("addField", "survey");
    },

    deleteField() {
      this.$emit("deleteField", "survey");
      let index = this.$props.surveys.length - 1;
      let obj = {
        type: "surveys",
        ref: "title" + index,
      };
      // sending this deleted SURVEY's ref to parent to check and remove it from fieldsWithErrorCSSArray
      this.$emit("deletedItem", obj);
    },

    activeOption(survey) {
      if (survey.type === "select") {
        survey.options = [];
        survey.options.push("");
      }
    },

    addCustomOption(survey) {
      survey.options.push("");
    },

    removeCustomOption(survey, ref) {
      if (survey.options.length > 1) {
        let optionIndex = survey.options.length - 1;
        let tempObj = {
          type: "surveys",
          ref: ref + optionIndex,
        };
        survey.options.pop();

        // sending this deleted OPTION's ref to parent to check and remove it from fieldsWithErrorCSSArray
        this.$emit("deletedItem", tempObj);
      }
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
  width: -webkit-fill-available;
}

.customSurvey {
  grid-template-columns: repeat(3, 1fr);
  display: grid;
}

.questionContainer {
  grid-column: 1 / span 2;
  align-self: center;
}

.selectContainer {
  grid-column: 3;
  align-self: center;
}

.customOptionsContainer {
  grid-column: 1 / span 3;
  align-self: center;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.3rem;
  margin-top: 0.6rem;
}

.addOptionContainer {
  grid-column: 1;
  justify-self: end;
}

.deleteOptionContainer {
  grid-column: 2;
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

/* .optionsContainer {
  display: flex;
  flex-direction: column;
  align-items: center;
} */

/* .customOptionsContainer {
  display: flex;
  flex-direction: column;
} */

.customOptionsContainer img {
  max-height: 30px;
}
</style>