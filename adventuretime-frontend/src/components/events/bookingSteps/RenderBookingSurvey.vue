<template>
  <div class="survey-full-container">
    <div class="surveys-container shadow scroll-div">
      <div class="surveys" v-for="(survey, index) in surveyList" :key="index">
        <div class="type-select" v-if="survey.type == 'input'">
          <h3>{{ index + 1 }}. {{ survey.questionTitle }}</h3>
          <textarea
            rows="3"
            cols="30"
            v-model="radioBox[survey.questionTitle]"
            :name="survey.questionTitle"
          ></textarea>
        </div>

        <div class="type-select" v-if="survey.type == 'select'">
          <h3>{{ index + 1 }}. {{ survey.questionTitle }}</h3>
          <div class="radio-container">
            <div
              class="selected-answers"
              v-for="(answer, i) in survey.options"
              :key="answer"
            >
              <label>
                <input
                  type="radio"
                  :id="i"
                  :value="answer"
                  :name="survey.questionTitle"
                  v-model="radioBox[survey.questionTitle]"
                />
                {{ answer }}</label
              >
            </div>
          </div>
        </div>
      </div>
      <button @click="goContinue"><p>Continue</p></button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["surveyList", "step"],
  emits: ["setStep"],
  data() {
    return {
      radioBox: this.$store.getters["bookingStore/booking"]?.radioBox
        ? this.$store.getters["bookingStore/booking"]?.radioBox
        : {},
      additionalInfo: this.$store.getters["bookingStore/booking"]
        ?.additionalInfo
        ? this.$store.getters["bookingStore/booking"]?.additionalInfo
        : [],
    };
  },

  computed: {
    getBooking() {
      return this.$store.getters["bookingStore/booking"];
    },
  },

  watch: {
    radioBox: {
      deep: true,
      handler: function (val) {
        /* this.$emit("additionalInfo", this.createNewArrayList(val)); */
        this.additionalInfo = this.createNewArrayList(val);
      },
    },
  },

  methods: {
    createNewArrayList(val) {
      const newArray = [];
      for (const [key, value] of Object.entries(val)) {
        newArray.push({ [key]: value });
      }
      return newArray;
    },

    goContinue() {
      this.$store.dispatch("bookingStore/updateBooking", {
        ...this.$store.getters["bookingStore/booking"],
        additionalInfo: this.additionalInfo,
        radioBox: this.radioBox,
      });
      if (this.step === 11) {
        this.$emit("setStep", 12);
      } else {
        this.$emit("setStep", 5);
      }
    },
  },
};
</script>

<style scoped>
p,
h4,
h3 {
  color: rgb(255, 255, 255);
  font-weight: lighter;
}
h4 {
  margin: 0 15px 0 0;
  align-self: flex-start;
}
p {
  font-weight: lighter;
}

.survey-full-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.surveys-container {
  display: flex;
  width: 60%;
  max-width: 800px;
  flex-direction: column;
  background-color: #9538b3;
  border-radius: 10px;
  overflow: auto;
  align-items: center;
  padding: 20px;
  margin-bottom: 30px;
}

.surveys {
  display: flex;
  width: 90%;
  text-align: left;
  /* justify-content: center; */
}

.type-select {
  width: 100%;
  column-gap: 10px;
  border-radius: 10px;
  padding: 10px;
}

.selected-answers {
  color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
}
.selected-answers label {
  font-size: 30px;
}

textarea {
  border-radius: 10px;
  padding: 10px;
  width: 90%;
  font-size: x-large;
}

[type="radio"] {
  width: 25px;
  height: 25px;
  margin-right: 10px;
  margin: 5px 5px 5px 0px;
}

button {
  /* position: absolute; */
  width: 90%;
  height: 40px;
  background-color: white;
  align-self: center;
  bottom: 0;
  /* margin-bottom: 25px; */
  max-width: 400px;
  margin-top: 30px;
}

button p {
  color: black;
  padding: 0;
  margin: 0;
  font-weight: lighter;
  font-size: x-large;
}

@media screen and (max-width: 600px) {
  .surveys-container {
    width: 85%;
    margin: auto;
  }
  .surveys {
    margin: 0px;
  }
}
</style>