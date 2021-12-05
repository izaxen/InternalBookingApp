<template>
  <h1>
    <span class="headingHighlight">3. Confirmation</span>
  </h1>
  <div class="infoContainer">
    <div
      class="basicInfo"
      v-if="
        event.country ||
        event.city ||
        event.destinationDescription ||
        event.startDate ||
        event.endDate ||
        event.eventDescription ||
        event.deadLine
      "
    >
      <h1>Basic Info:</h1>
      <p v-if="event.country" class="title">Country:</p>
      <p v-if="event.country">{{ event.country }}</p>
      <p v-if="event.city" class="title">City:</p>
      <p v-if="event.city">{{ event.city }}</p>
      <p v-if="event.destinationDescription" class="title">
        Destination description:
      </p>
      <p v-if="event.destinationDescription">
        {{ event.destinationDescription }}
      </p>
      <p v-if="event.startDate" class="title">Start date:</p>
      <p v-if="event.startDate">{{ event.startDate }}</p>
      <p v-if="event.endDate" class="title">End date:</p>
      <p v-if="event.endDate">{{ event.endDate }}</p>
      <p v-if="event.eventDescription" class="title">Event description:</p>
      <p v-if="event.eventDescription">{{ event.eventDescription }}</p>
      <p v-if="event.deadLine" class="title">Application deadline:</p>
      <p v-if="event.deadLine">{{ event.deadLine }}</p>
    </div>

    <div class="customFields" v-if="event.customFields.length != 0">
      <h1>Custom Fields:</h1>
      <p v-for="customfield in event.customFields" :key="customfield">
        {{ customfield.customFieldDescription }}
      </p>
    </div>

    <div class="surveys" v-if="event.surveys.length != 0">
      <h1>Custom Survey:</h1>
      <div
        class="surveyContainer"
        v-for="survey in event.surveys"
        :key="survey"
      >
        <p class="title">Question:</p>
        <p>{{ survey.questionTitle }}</p>
        <p class="title" v-if="survey.type === 'select'">Options:</p>
        <p v-if="survey.type === 'select'">{{ survey.options }}</p>
      </div>
    </div>

    <div class="links" v-if="event.links.length != 0">
      <h1>Links:</h1>
      <p v-for="link in event.links" :key="link">
        {{ link.linkTitle ? link.linkTitle : "Empty Title" }} :
        {{ link.linkDescription ? link.linkDescription : "Empty Link" }}
      </p>
    </div>

    <div class="accommodations" v-if="event.accommodations.length != 0">
      <h1>Accommodations:</h1>
      <div
        class="accContainer"
        v-for="(acc, accIndex) in event.accommodations"
        :key="acc"
      >
        <p>Title: {{ acc.accommodationTitle }}</p>
        <p v-if="acc.accommodationDescription">
          Description: {{ acc.accommodationDescription }}
        </p>
        <p>Rooms: {{ acc.rooms.length }}</p>
        <div
          class="roomsContianer"
          v-if="event.accommodations[accIndex].rooms.length != 0"
        >
          Rooms of {{ acc.accommodationTitle }}:
          <div
            class="room"
            v-for="(room, roomIndex) in event.accommodations[accIndex].rooms"
            :key="room"
          >
            <p>Room: {{ room.roomTitle }}</p>
            <p>Description: {{ room.roomDescription }}</p>
            <p>
              Beds:
              {{ event.accommodations[accIndex].rooms[roomIndex].beds.length }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["event"],

  data() {
    return {};
  },

  methods: {},
};
</script>

<style scoped>
* {
  color: black;
}
p,
h1 {
  color: black;
}
.title {
  font-weight: 600;
}

.headingHighlight {
  margin-bottom: 20px;
  color: white;
}

.basicInfo,
.customFields,
.surveys,
.links,
.accommodations {
  border: double;
  margin: 30px 0 30px 0;
  gap: 15px;
}

.surveyContainer {
  margin: 2rem 1rem 2rem 1rem;
}

/* .accommodations {
  display: flex;
  flex-direction: column;
  gap: 15px;
} */

.accContainer {
  border: double;
  text-align-last: left;
}

.room {
  margin: 2vh 0 4vh 6vw;
}
</style>