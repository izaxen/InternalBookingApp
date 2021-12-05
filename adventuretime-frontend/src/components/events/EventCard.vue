<template>
  <div class="eventCard-container" @click="goTo">
    <img
      :src="
        event.images.length > 0
          ? event.images[0]
          : 'http://res.cloudinary.com/simpleview/image/upload/v1597924305/clients/norway/alpine_voss_resort_vestland_fjord_norway_credits_hunnalvatn_media_2_1_2df89176-d7c8-4bb7-b7f4-88cd1ba7daf4.jpg'
      "
      alt="cover"
      class="cover"
    />
    <h1 class="book">
      <span class="headingHighlight">{{ event.city }}</span>
    </h1>
    <h3 class="date-range shadow">
      {{ returnDate(event.startDate, event.endDate) }}
    </h3>
  </div>
</template>

<script>
export default {
  props: ["event"],

  components: {},

  methods: {
    goTo() {
      this.$router.push("/event/" + this.event.id);
    },
    returnDate(date, date2) {
      let x = new Date(date);
      let y = new Date(date2);
      return `${x.getDate()}/${x.getMonth() + 1} - ${y.getDate()}/${
        y.getMonth() + 1
      } ${y.getFullYear()} `;
    },
  },
};
</script>

<style scoped>
.eventCard-container {
  position: relative;
  width: 100vw;
  min-height: 600px;
  background-size: cover;
  background-position: center;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  margin-top: 15px;
  margin-bottom: 15px;
}

.cover {
  height: 100%;
  position: absolute;
  width: 100%;
  object-fit: cover;
}

.book {
  grid-column-start: 3;
  grid-row-start: 3;
  align-self: center;
  margin-right: 10px;
}

.date-range {
  /* align-self: center; */
  z-index: 1;
  background-color: #7f619d;
  width: 325px;
  height: 35px;
  justify-self: center;
  padding: 0;
  margin: 0;
  margin-top: 15px;
  margin-left: 10px;
  color: #ffffff;
  font-size: xx-large;
  border-radius: 5px;
}

.book:hover {
  cursor: pointer;
}

h1 {
  font-size: 50px;
}

@media screen and (max-width: 800px) {
  .eventCard-container {
    position: relative;
    width: 100vw;
    min-height: 600px;
    display: flex;
    flex-direction: column;
  }

  .book {
    font-size: 70px;
    margin-right: 0;
  }

  .date-range {
    align-self: center;
    font-size: 50px;
    width: 325px;
    height: 100%;
    margin-top: 325px;
  }

  .headingHighlight {
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>