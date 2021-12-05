<template>
  <div class="basicInfoComponent">
    <h1 class="title">
      <span class="headingHighlight">1. Basic Info</span>
    </h1>
    <div class="countryContainer">
      <p class="country">* Country:</p>
      <input
        class="countryInput"
        v-model="event.country"
        required
        @change="updateEvent"
        ref="country"
      />
    </div>
    <div class="cityContainer">
      <p class="city">* City:</p>
      <input v-model="event.city" required @change="updateEvent" ref="city" />
    </div>
    <div class="desDesciptionContainer">
      <p>Destination description:</p>
      <textarea
        cols="35"
        rows="5"
        v-model="event.destinationDescription"
        @change="updateEvent"
      />
    </div>
    <div class="startDateContainer">
      <p>* Start date:</p>
      <input
        v-model="event.startDate"
        required
        type="date"
        :min="today"
        @change="updateEvent"
        ref="startDate"
      />
    </div>
    <div class="endDateContainer">
      <p>* End date:</p>
      <input
        v-model="event.endDate"
        required
        type="date"
        :min="event.startDate"
        @change="updateEvent"
        ref="endDate"
      />
    </div>
    <div class="applicationDeadlineContainer">
      <p>* Application deadline:</p>
      <input
        v-model="event.deadLine"
        required
        :max="event.endDate"
        type="date"
        @change="updateEvent"
        ref="deadLine"
      />
    </div>
    <div class="eventDescriptionContainer">
      <p>Event description:</p>
      <textarea
        cols="35"
        rows="5"
        v-model="event.eventDescription"
        @change="updateEvent"
      />
    </div>

    <div class="addImageComponent">
      <AddImage
        :imagesProp="event.images"
        @uploadedImg="uploadedImg($event)"
        ref="addImage"
      />
    </div>

    <div class="btnsContainer">
      <div class="uploadBtnContainer">
        <button
          class="button-styled-2"
          type="button"
          @click="this.$refs.addImage.onAddImage"
        >
          Upload image
        </button>
      </div>

      <div
        class="addCustomFieldBtnContainer"
        v-if="event.customFields.length === 0"
      >
        <button class="button-styled-2" @click="addField('customField')">
          Add customField
        </button>
      </div>

      <div class="addCustomFieldBtnContainer" v-if="event.surveys.length === 0">
        <button class="button-styled-2" @click="addField('survey')">
          Add survey
        </button>
      </div>

      <div class="addCustomFieldBtnContainer" v-if="event.links.length === 0">
        <button class="button-styled-2" @click="addField('link')">
          Add link
        </button>
      </div>
    </div>

    <div class="customFieldContainer" v-if="event.customFields.length != 0">
      <AddCustomField
        :customFields="event.customFields"
        @addField="addField($event)"
        @deleteField="deleteField($event)"
        @deletedItem="hasDeletedItem($event)"
        ref="customFields"
      />
    </div>

    <div class="surveyContainer" v-if="event.surveys.length != 0">
      <AddSurveys
        :surveys="event.surveys"
        @addField="addField($event)"
        @deleteField="deleteField($event)"
        @deletedItem="hasDeletedItem($event)"
        ref="surveys"
      />
    </div>

    <div class="linkContainer" v-if="event.links.length != 0">
      <AddLink
        :links="event.links"
        @addField="addField($event)"
        @deleteField="deleteField($event)"
        @deletedItem="hasDeletedItem($event)"
        ref="links"
      />
    </div>
  </div>
</template>

<script>
import AddCustomField from "../listings/AddCustomField.vue";
import AddSurveys from "../listings/AddSurveys.vue";
import AddLink from "../listings/AddLink.vue";
import AddImage from "../AddImages.vue";
export default {
  emits: [
    "addField",
    "deleteField",
    "updateEvent",
    "deletedItem",
    "hasDeletedItem",
  ],
  props: ["eventProp"],

  data() {
    return {
      event: this.$props.eventProp,
      today:
        new Date().toISOString().slice(0, 10) < this.$props.eventProp.deadLine
          ? new Date().toISOString().slice(0, 10)
          : this.$props.eventProp.deadLine,
    };
  },

  components: {
    AddCustomField,
    AddSurveys,
    AddLink,
    AddImage,
  },

  watch: {
    eventProp(n) {
      this.event = n;
    },
  },

  methods: {
    updateEvent() {
      if (this.event.endDate) {
        if (this.event.deadLine > this.event.endDate) {
          this.event.deadLine = this.event.endDate;
        }
      }

      let obj = {
        country: this.event.country,
        city: this.event.city,
        startDate: this.event.startDate,
        endDate: this.event.endDate,
        destinationDescription: this.event.destinationDescription,
        customFields: this.event.customFields,
        surveys: this.event.surveys,
        deadLine: this.event.deadLine,
        eventDescription: this.event.eventDescription,
        links: this.event.links,
        type: "basicInfo",
        images: this.event.images,
      };

      this.$emit("updateEvent", obj);
    },

    // when user click on add button in child component, increase relative array length
    addField(fieldName) {
      if (fieldName === "customField") {
        this.event.customFields.push({});
      } else if (fieldName === "survey") {
        this.event.surveys.push({ type: "input" });
      } else {
        this.event.links.push({});
      }
      this.updateEvent();
    },

    // when user click on delete button in child component, delete last element from relative array
    deleteField(fieldName) {
      if (fieldName === "customField") {
        this.event.customFields.pop();
      } else if (fieldName === "survey") {
        this.event.surveys.pop();
      } else {
        this.event.links.pop();
      }
      this.updateEvent();
    },

    hasDeletedItem(deletedItem) {
      this.$emit("hasDeletedItem", deletedItem);
    },

    uploadedImg(images) {
      this.event.images = images;
      this.updateEvent();
    },
  },
};
</script>

<style scoped>
.basicInfoComponent {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.basicInfoComponent p {
  align-self: flex-start;
}

.basicInfoComponent div {
  display: flex;
  margin: 0.5rem;
  place-content: space-between;
  flex-direction: column;
}

.title {
  grid-column-start: span 2;
  grid-row-start: 1;
}

.countryContainer {
  grid-column-start: 1;
  grid-row-start: 2;
}

.cityContainer {
  grid-column-start: 2;
  grid-row-start: 2;
}

.desDesciptionContainer {
  grid-column-start: span 2;
  grid-row-start: 3;
}

.startDateContainer {
  grid-column-start: 1;
  grid-row-start: 4;
}

.endDateContainer {
  grid-column-start: 2;
  grid-row-start: 4;
}

.applicationDeadlineContainer {
  grid-column-start: span 2;
  grid-row-start: 5;
}

.eventDescriptionContainer {
  grid-column-start: span 2;
  grid-row-start: 6;
}

.addImageComponent {
  grid-column-start: span 2;
  grid-row-start: 7;
  width: -webkit-fill-available;
  grid-template-columns: repeat(2, 1fr);
  display: grid;
}

.basicInfoComponent .btnsContainer {
  grid-column-start: span 2;
  grid-row-start: 8;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.headingHighlight {
  margin-bottom: 20px;
  color: white;
}

.customFieldContainer,
.surveyContainer,
.linkContainer {
  flex-direction: column;
  grid-column-start: span 2;
}

.main-container p {
  color: purple;
  margin-block-start: 0.5rem;
  margin-block-end: 0.5rem;
}

.basicInfoComponent .addCustomFieldBtnContainer {
  place-content: center;
}
</style>