<template>
  <div class="main-container border-radius">
    <!-- <div class="close" @click="saveOrNot">+</div> -->
    <div class="draftNotification" v-if="showDraftNoti === true">
      <p>Saved Draft</p>
    </div>
    <div class="addEventTitleContainer">
      <h1>Create Event</h1>
    </div>
    <div class="eventCard">
      <div
        class="errorContainer"
        v-if="hasError && showTab === 'basicInfoContainer'"
        id="errorContainer"
        ref="errorContainer"
      >
        <div class="errorMessage" v-for="eMessage in eMessages" :key="eMessage">
          <p>{{ eMessage }}</p>
        </div>
      </div>
      <form @submit.prevent="addEventToDB" class="eventF">
        <BasicInfo
          v-if="showTab === 'basicInfoContainer'"
          :eventProp="event"
          @updateEvent="updateEvent($event)"
          @hasDeletedItem="removeDeletedItemFromErrorCSS($event)"
          ref="myBasicInfo"
        />

        <!-- accommodations tag starts here! -->
        <AccommodationItemList
          v-if="showTab === 'showApartmentInfo'"
          :accommodations="event.accommodations"
          @addAcc="addAcc($event)"
          @addRoom="addRoom($event)"
          @showThisAcc="showThisAcc($event)"
          @showThisRoom="showThisRoom($event)"
          @hasDeletedItem="updateEvent($event)"
        />

        <!-- accommodation starts here! -->
        <Accommodation
          v-if="showTab === 'addAccommodation'"
          :accommodationProp="event.accommodations[apartmentIndex]"
          @updateEvent="updateEvent($event)"
          @backToPrevStep="backToPrevStep($event)"
          @addRoom="addRoom"
          @showThisRoom="showThisRoom($event)"
          @addBed="addBed($event)"
          @showThisBed="showThisBed($event)"
          ref="myAccommodation"
        />

        <!-- room starts here! -->
        <div v-if="showTab === 'addRoom'">
          <Room
            :roomProp="event.accommodations[apartmentIndex].rooms[roomIndex]"
            :roomIndexProp="roomIndex"
            @updateEvent="updateEvent($event)"
            @backToPrevStep="backToPrevStep($event)"
            @addBed="addBed($event)"
            @showThisBed="showThisBed($event)"
            ref="myRoom"
          />
        </div>

        <!-- beds start here! -->
        <Bed
          v-if="showTab === 'addBed'"
          :bedProp="
            event.accommodations[apartmentIndex].rooms[roomIndex].beds[bedIndex]
          "
          :bedIndex="bedIndex"
          @updateEvent="updateEvent($event)"
          @backToPrevStep="backToPrevStep($event)"
        />

        <Confirmation v-if="showTab === 'confirm'" :event="event" />
      </form>
    </div>

    <Nav
      v-if="showTab"
      :showAccommodation="showAccommodation"
      :showOverView="showOverView"
      :showTab="showTab"
      @setStep="setStep($event)"
    />

    <div class="updateEventBtnContainer" v-if="showTab">
      <button class="button-styled-2" @click="undoChanges">Reset</button>
      <button class="button-styled-2" @click="showPrev">Back</button>
      <button class="button-styled-2" @click="showNext">Next</button>
    </div>
  </div>

  <!-- modals starts here -->
  <div class="confirmationModalBackGround BG" ref="confirmModal">
    <div class="confirmationModal" v-if="!finishedSaving">
      <p>Saving............</p>
      <div class="loader"></div>
    </div>
    <div class="confirmationModal" v-if="finishedSaving">
      <p>Event has been saved!</p>
      <div class="close" @click="closeModal">+</div>
    </div>
  </div>
  <!-- <div class="exitModalBackGround BG" ref="exitConfirmModal">
    <div class="exitConfirmationModal">
      <p class="exitModalText">Would you like to save your changes?</p>
      <button class="withSave button-styled-2" @click="tryToSave">Yes</button>
      <button class="withoutSave button-styled-2" @click="leaveWithoutSaving">
        No
      </button>
      <button class="cancelAction button-styled-2" @click="cancelAction">
        Cancel
      </button>
    </div> -->
  <!-- </div> -->
  <div class="selectOriginBackGround BG" ref="selectOrigin">
    <div class="selectOriginnModal">
      <p class="undoModalText">Would you like to load saved draft?</p>
      <button class="runUndo button-styled-2" @click="loadOrigin(true)">
        Yes
      </button>
      <button class="notRunUndo button-styled-2" @click="loadOrigin(false)">
        No
      </button>
    </div>
  </div>
  <div class="undoModalBackGround BG" ref="undoConfirmModal">
    <div class="undoConfirmationModal">
      <p class="undoModalText">Are you sure you want to undo changes?</p>
      <button class="runUndo button-styled-2" @click="undoEdit(true)">
        Yes
      </button>
      <button class="notRunUndo button-styled-2" @click="undoEdit(false)">
        No
      </button>
    </div>
  </div>
</template>

<script>
import BasicInfo from "../eventComponents/BasicInfo.vue";
import Accommodation from "../eventComponents/Accommodation.vue";
import Room from "../eventComponents/Room.vue";
import Bed from "../eventComponents/Bed.vue";
import AccommodationItemList from "../listingItemsComponents/AccommodationItemList.vue";
import Nav from "../listingItemsComponents/AddEditEventNav.vue";
import Confirmation from "../eventComponents/Confirmation.vue";
import * as MyHelper from "../eventComponents/methods/eventValidation.js";

export default {
  emits: [
    "updateEvent",
    "backToPrevStep",
    // "closeModal",
    "showThisBed",
    "setStep",
    "addAcc",
    "addBed",
    "showThisAcc",
    "showThisRoom",
    "addRoom",
    "hasDeletedItem",
  ],

  data() {
    return {
      event: {
        country: "",
        city: "",
        customFields: [],
        eventDescription: "",
        destinationDescription: "",
        endDate: "",
        startDate: new Date().toISOString().slice(0, 10),
        deadLine: "",
        surveys: [],
        accommodations: [],
        links: [],
        images: [],
      },
      showTab: "basicInfoContainer",
      saveDraftInterval: null,
      apartmentIndex: null,
      roomIndex: null,
      bedIndex: null,
      timer: null,
      showAccommodation: false,
      showOverView: false,
      hasError: false,
      eMessages: [],
      fieldsWithErrorCSSArray: [],
      finishedSaving: false,
      selectedDetailEvent: "",
      showDraftNoti: false,
    };
  },

  components: {
    BasicInfo,
    Accommodation,
    Room,
    Bed,
    AccommodationItemList,
    Nav,
    Confirmation,
  },

  created() {
    this.selectedDetailEvent = JSON.parse(JSON.stringify(this.event));
  },

  mounted() {
    this.checkBeforeLoad();
  },

  async beforeUnmount() {
    clearTimeout(this.timer);
    clearInterval(this.saveDraftInterval);
  },

  watch: {
    showTab(n) {
      if (n == "basicInfoContainer") {
        setTimeout(() => {
          MyHelper.changeCSS(this.event, this);
        }, 50);
      }
    },
  },

  methods: {
    tryToSave() {
      // this.$refs.exitConfirmModal.style.display = "none";
      MyHelper.resetAllIndex(this);
      this.showTab = "basicInfoContainer";
      // check if form is valid before trying to save, if not, display error messages box
      MyHelper.checkBeforeSave(this.event, this);
    },

    async checkBeforeLoad() {
      this.showTab = "";
      this.hasError = false;
      this.showNavAndBtn = false;
      // check if this event has draft, if yes, ask if user wants to load draft
      if (this.hasDraft()) {
        this.$refs.selectOrigin.style.display = "flex";
      } else {
        this.showTab = "basicInfoContainer";
        this.activeDraft();
      }
    },

    hasDraft() {
      let loadDraft = localStorage.getItem("draft" + "newEvent");
      if (loadDraft) {
        return true;
      } else {
        return false;
      }
    },

    activeDraft() {
      clearInterval(this.saveDraftInterval);
      this.saveDraftInterval = setInterval(() => {
        MyHelper.saveDraft(
          this.event,
          this.selectedDetailEvent,
          this,
          "newEvent"
        );
      }, 30000);
    },

    loadOrigin(loadFromDraft) {
      if (loadFromDraft) {
        this.getDraft();
        this.$refs.selectOrigin.style.display = "none";
      } else {
        this.$refs.selectOrigin.style.display = "none";
        this.showTab = "basicInfoContainer";
      }
      this.activeDraft();
    },

    getDraft() {
      this.event = MyHelper.getDraft("newEvent", this.event, this);
    },

    // If an item has been deleted, check and remove it from fieldsWithErrorCSSArray
    removeDeletedItemFromErrorCSS(deletedItem) {
      MyHelper.removeDeletedItemFromErrorCSS(deletedItem, this);
    },

    async saveEventToDB() {
      let newEvent = {
        country: this.event.country,
        eventDescription: this.event.eventDescription,
        startDate: this.event.startDate,
        endDate: this.event.endDate,
        deadLine: this.event.deadLine,
        accommodations: this.event.accommodations,
        customFields: this.event.customFields,
        city: this.event.city,
        surveys: this.event.surveys,
        destinationDescription: this.event.destinationDescription,
        links: this.event.links,
        images: this.event.images,
      };

      clearInterval(this.saveDraftInterval);
      window.scrollTo(0, 0);
      // show saving modal
      this.$refs.confirmModal.style.display = "flex";
      document.querySelector("body").style.overflow = "hidden";
      // save to DB
      await this.$store.dispatch("eventStore/addNewEvent", newEvent);
      // load the newest version of events
      await this.$store.dispatch("eventStore/getEvents");
      // change text in confirmationModal to let user know saving succeeded
      this.finishedSaving = true;
      localStorage.removeItem("draft" + "newEvent");
      clearTimeout(this.timer);
    },

    undoEdit(wantsReset) {
      MyHelper.resetEdit(wantsReset, this, this.event);
    },

    // saveOrNot() {
    //   if (
    //     this.event.country === "" &&
    //     this.event.city === "" &&
    //     this.event.customFields.length === 0 &&
    //     this.event.eventDescription === "" &&
    //     this.event.destinationDescription === "" &&
    //     this.event.endDate === "" &&
    //     this.event.startDate === "" &&
    //     this.event.deadLine === "" &&
    //     this.event.surveys.length === 0 &&
    //     this.event.accommodations.length === 0 &&
    //     this.event.links.length === 0 &&
    //     this.event.images.length === 0
    //   ) {
    //     this.leaveWithoutSaving();
    //   } else if (
    //     MyHelper.checkIfObjectsAreIdentical(
    //       this.event,
    //       this.selectedDetailEvent
    //     )
    //   ) {
    //     this.leaveWithoutSaving();
    //   } else {
    //     // this.showTab = "basicInfoContainer";
    //     this.$refs.exitConfirmModal.style.display = "flex";
    //   }
    // },

    // leaveWithoutSaving() {
    //   this.$emit("closeModal", false);
    // },

    // cancelAction() {
    //   this.$refs.exitConfirmModal.style.display = "none";
    // },

    closeModal() {
      this.$refs.confirmModal.style.display = "none";
      document.querySelector("body").style.overflow = "";
    },

    addAcc() {
      MyHelper.addAcc(this);
    },

    addRoom(obj) {
      MyHelper.addRoom(this, obj);
    },

    addBed(roomIndex) {
      MyHelper.addBed(this, roomIndex);
    },

    // update event when there user made changes in child components
    updateEvent(tempObj) {
      MyHelper.updateEvent(tempObj, this.event, this);
    },

    backToPrevStep(tempObj) {
      MyHelper.backToPrevStep(tempObj, this);
    },

    showThisAcc(accIndex) {
      this.apartmentIndex = accIndex;
      this.showTab = "addAccommodation";
    },

    showThisRoom(indexObj) {
      this.roomIndex = indexObj.roomIndex;
      if (indexObj.accIndex || indexObj.accIndex == 0) {
        this.apartmentIndex = indexObj.accIndex;
      }
      this.showTab = "addRoom";
    },

    showThisBed(indexObj) {
      this.bedIndex = indexObj.bedIndex;
      if (indexObj.roomIndex) {
        this.roomIndex = indexObj.roomIndex;
      }
      this.showTab = "addBed";
    },

    showNext() {
      MyHelper.showNext(this);
    },

    showPrev() {
      MyHelper.showPrev(this);
    },

    setStep(e) {
      this.showTab = e;
    },

    undoChanges() {
      this.$refs.undoConfirmModal.style.display = "flex";
      this.showTab = "";
    },
  },
};
</script>

<style scoped>
.main-container {
  width: 80vw;
  margin: 20px auto;
  padding: 30px;
  background: white;
  margin-top: 35px;
  display: grid;
  grid-template:
    "a a a"
    "nav nav nav"
    "b b b"
    ". save save";
  grid-template-columns: repeat(3, 1fr);
  /* grid-template-rows: 10% 5% 80% 5%; */
}

.main-container p,
h1 {
  color: purple;
  margin-block-start: 0.5rem;
  margin-block-end: 0.5rem;
}

.errorContainer {
  border-style: dashed;
  border-color: red;
  border-width: 3px;
}

.errorContainer p {
  color: red;
}

.BG {
  z-index: 1;
}

.addEventTitleContainer {
  grid-area: a;
  align-self: center;
}

.eventCard {
  padding: 20px 10px;
  grid-area: b;
  background-color: #ffffff;
  border-radius: 20px;
  margin: 0 0 1rem 0;
}

.navigation-steps-container {
  grid-area: nav;
  height: 2.5rem;
}

.updateEventBtnContainer {
  grid-area: save;
  align-self: end;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-right: 16px;
  padding-right: 10px;
  grid-gap: 0.5rem;
}

textarea {
  max-width: 25vw;
  min-width: 25vw;
  text-align: -webkit-center;
  padding: 0;
}

input {
  max-width: 25vw;
  min-width: 25vw;
  text-align: -webkit-center;
  flex: auto;
  padding: 0;
  border-width: 1px;
}

.apartmentInfoContainer div {
  display: flex;
  margin: 0.5rem;
}

.roomInfoContainer div {
  display: flex;
  margin: 0.5rem;
}

.bedInfoContainer div {
  display: flex;
  margin: 0.5rem;
}

.bedInfoContainer {
  width: 90%;
}

.close {
  position: absolute;
  font-size: 30px;
  top: 0;
  right: 10px;
  color: black;
  padding: 5px;
  cursor: pointer;
  transform: rotate(45deg);
}

.buttons .plusMinus {
  flex-direction: row;
  place-content: space-evenly;
}

.plusMinus img {
  height: 25px;
  margin: 0;
}

.btnContainer img {
  height: 40px;
}

.confirmationModalBackGround {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
}

.confirmationModalBackGround p {
  color: purple;
}

.confirmationModal {
  width: 500px;
  height: 300px;
  background-color: white;
  border-radius: 25px;
  position: relative;
}

.exitModalBackGround {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
}

.exitConfirmationModal {
  width: 15vw;
  height: 15vh;
  background-color: white;
  border-radius: 25px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template:
    "t t t"
    "t t t"
    "y n c";
  inline-size: fit-content;
}

.exitConfirmationModal button {
  margin: 10px;
  min-width: 7vw;
}

.exitModalText {
  grid-area: t;
  padding: 10px;
  color: purple;
}

.withSave {
  grid-area: y;
}

.withoutSave {
  grid-area: n;
}

.cancelAction {
  grid-area: c;
}

.undoModalBackGround {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
}

.undoModalText {
  grid-area: t;
  padding: 10px;
  color: purple;
}

.runUndo {
  grid-area: y;
  margin: 10px;
  min-width: 7vw;
}

.notRunUndo {
  grid-area: n;
  margin: 10px;
  min-width: 7vw;
}

.selectOriginBackGround {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
}

.selectOriginnModal {
  width: 15vw;
  height: 15vh;
  background-color: white;
  border-radius: 25px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template:
    "t t"
    "t t"
    "y n";
  inline-size: fit-content;
}

.undoConfirmationModal {
  width: 15vw;
  height: 15vh;
  background-color: white;
  border-radius: 25px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template:
    "t t"
    "t t"
    "y n";
  inline-size: fit-content;
}

.fillModalBackGround {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
}

.fillModal {
  width: 300px;
  height: 100px;
  background-color: white;
  border-radius: 25px;
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-template:
    "t t"
    "t t"
    "y n";
  inline-size: fit-content;
}

.addCFbtn {
  margin-inline-start: auto;
}

.customFieldContainer {
  flex-direction: column;
}

.infoItemContainer {
  overflow: auto;
}

.infoBtnContainer {
  min-height: 16vh;
  max-height: 16vh;
}

.checkBoxContainer {
  margin: 0;
  align-items: center;
}

.checkBoxContainer input {
  min-width: 7vw;
}

.draftNotification {
  position: absolute;
  top: 0;
  left: 30px;
  padding: 5px;
  -webkit-animation: fadeinout 4s linear forwards;
  animation: fadeinout 4s linear forwards;
}

@-webkit-keyframes fadeinout {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fadeinout {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.loader {
  margin: 50px auto;
  grid-column-start: 2;
}
</style>
