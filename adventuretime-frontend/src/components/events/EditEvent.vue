<template>
  <div class="main-container border-radius">
    <!-- <div class="close" @click="saveOrNot">+</div> -->
    <div class="draftNotification" v-if="showDraftNoti === true">
      <p>Saved Draft</p>
    </div>
    <div class="editEventTitleContainer">
      <h1>Edit Event</h1>
    </div>
    <div class="selectEvent">
      <select name id v-if="allEvents" v-model="selectedEvent">
        <option v-for="event in allEvents" :value="event.id" :key="event.id">
          {{ event.country }}-{{ event.city }}
        </option>
      </select>
      <button
        class="button-styled-2"
        @click="checkBeforeLoad"
        :disabled="!selectedEvent"
      >
        edit this event
      </button>
      <button
        class="button-styled-2"
        :disabled="!selectedEvent"
        @click="openDeleteModal"
      >
        delete event
      </button>
    </div>
    <div v-if="loading" class="loader"></div>
    <div v-if="selectedDetailEvent && loading == false" class="eventCard">
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

      <form @submit.prevent class="eventF" ref="form" id="formUpdate">
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
        <Room
          v-if="showTab === 'addRoom'"
          :roomProp="event.accommodations[apartmentIndex].rooms[roomIndex]"
          :roomIndexProp="roomIndex"
          @updateEvent="updateEvent($event)"
          @backToPrevStep="backToPrevStep($event)"
          @addBed="addBed($event)"
          @showThisBed="showThisBed($event)"
          ref="myRoom"
        />

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
      v-if="showNavAndBtn"
      :showAccommodation="showAccommodation"
      :showOverView="showOverView"
      :showTab="showTab"
      @setStep="setStep($event)"
    />

    <div class="updateEventBtnContainer" v-if="selectedDetailEvent">
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
      <p>Event has been updated!</p>
      <div class="close" @click="closeModal">+</div>
    </div>
  </div>
  <div class="deleteModalBackGround BG" ref="deleteModal">
    <div class="confirmationModal">
      <p>Event has been deleted!</p>
      <div class="close" @click="closeDeleteModal">+</div>
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
    </div>
  </div> -->
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
  <div class="deleteEventBackGround delted BG" ref="deleteEvent">
    <div class="deleteEventModal">
      <p class="deleteEventText">Are sure you want to delete selected event?</p>
      <button class="runDelete button-styled-2" @click="deleteEvent">
        Yes
      </button>
      <button class="notRunDelete button-styled-2" @click="closeDeleteModal">
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
    "showThisAcc",
    "showThisRoom",
    "addRoom",
    "addBed",
    "hasDeletedItem",
  ],
  data() {
    return {
      allEvents: [],
      selectedEvent: "",
      selectedDetailEvent: "",
      showTab: "basicInfoContainer",
      apartmentIndex: null,
      roomIndex: null,
      bedIndex: null,
      event: null,
      saveDraftInterval: null,
      showDraftNoti: false,
      timer: null,
      showAccommodation: false,
      showOverView: false,
      showNavAndBtn: false,
      hasError: false,
      eMessages: [],
      fieldsWithErrorCSSArray: [],
      finishedSaving: false,
      loading: false,
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
    this.getEvents();
  },

  beforeUnmount() {
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

    async getEvents() {
      this.loading = true;
      this.allEvents = await this.$store.dispatch("eventStore/getEventsDTO");
      this.loading = false;
    },

    async checkBeforeLoad() {
      this.showTab = "";
      this.hasError = false;
      this.showNavAndBtn = false;
      // check if this event has draft, if yes, ask if user wants to load draft
      if (this.hasDraft()) {
        this.$refs.selectOrigin.style.display = "flex";
      } else if (await this.hasBooking()) {
        alert("You can not edit an event if there are bookings on this event");
      } else {
        this.getSelectedEvent();
      }
    },

    async getSelectedEvent() {
      this.loading = true;
      let tempObj = {
        selectedEvent: this.selectedEvent,
      };
      // fetch eventInfo base on eventID(selectedEvent)
      this.selectedDetailEvent = await this.$store.dispatch(
        "eventStore/getSelectedEvent",
        tempObj
      );

      // reset everything to have fresh start
      this.eMessages = [];
      this.fieldsWithErrorCSSArray = [];
      MyHelper.resetAllIndex(this);
      MyHelper.resetCSS(this.event, this);

      // making a copy of this event from DB for later use of reset and draft
      this.event = JSON.parse(JSON.stringify(this.selectedDetailEvent));
      this.loading = false;

      // if there is any accommodation, show tab in navMap
      if (this.event.accommodations.length > 0) {
        this.showAccommodation = true;
      }
      this.showNavAndBtn = true;
      this.showTab = "basicInfoContainer";
      clearInterval(this.saveDraftInterval);

      // run saveDraft every 30 sec
      this.saveDraftInterval = setInterval(() => {
        MyHelper.saveDraft(
          this.event,
          this.selectedDetailEvent,
          this,
          this.selectedEvent
        );
      }, 30000);
    },

    async hasBooking() {
      let bookings = await this.$store.dispatch(
        "bookingStore/getBookingsByEvent",
        this.selectedEvent
      );
      return bookings.length > 0;
    },

    async saveEventToDB() {
      let tempObj = {
        country: this.event.country,
        city: this.event.city,
        destinationDescription: this.event.destinationDescription,
        eventDescription: this.event.eventDescription,
        startDate: this.event.startDate,
        endDate: this.event.endDate,
        deadLine: this.event.deadLine,
        eventDocID: this.selectedEvent,
        accommodations: this.event.accommodations,
        customFields: this.event.customFields,
        surveys: this.event.surveys,
        links: this.event.links,
        images: this.event.images,
      };

      clearInterval(this.saveDraftInterval);
      window.scrollTo(0, 0);
      // show saving modal
      this.$refs.confirmModal.style.display = "flex";
      document.querySelector("body").style.overflow = "hidden";
      // document.querySelector("body").style.overflow = "hidden";
      // save to DB
      await this.$store.dispatch("eventStore/updateSelectedEvent", tempObj);
      // load the newest version of events
      await this.$store.dispatch("eventStore/getEventsDTO");
      // change text in confirmationModal to let user know saving succeeded
      this.finishedSaving = true;
      // remove savedDraft for this event
      localStorage.removeItem("draft" + this.selectedEvent);
      clearTimeout(this.timer);
    },

    closeModal() {
      this.$refs.confirmModal.style.display = "none";
      document.querySelector("body").style.overflow = "";
    },

    // saveOrNot() {
    //   if (this.selectedDetailEvent === "") {
    //     this.leaveWithoutSaving();
    //   } else if (
    //     MyHelper.checkIfObjectsAreIdentical(
    //       this.event,
    //       this.selectedDetailEvent
    //     )
    //   ) {
    //     this.leaveWithoutSaving();
    //   } else {
    //     this.$refs.exitConfirmModal.style.display = "flex";
    //   }
    // },

    // leaveWithoutSaving() {
    //   this.$emit("closeModal", false);
    // },

    // cancelAction() {
    //   this.$refs.exitConfirmModal.style.display = "none";
    // },

    undoChanges() {
      this.$refs.undoConfirmModal.style.display = "flex";
      this.showTab = "";
      this.showNavAndBtn = false;
    },

    undoEdit(wantsReset) {
      MyHelper.resetEdit(wantsReset, this, this.event);
    },

    openDeleteModal() {
      window.scrollTo(0, 0);
      document.querySelector("body").style.overflow = "hidden";
      this.$refs.deleteEvent.style.display = "flex";
    },

    closeDeleteModal() {
      this.$refs.deleteEvent.style.display = "none";
      this.$refs.deleteModal.style.display = "none";
      document.querySelector("body").style.overflow = "";
    },

    getDraft() {
      this.loading = true;
      this.event = MyHelper.getDraft(this.selectedEvent, this.event, this);
      this.loading = false;
    },

    hasDraft() {
      let loadDraft = localStorage.getItem("draft" + this.selectedEvent);
      if (loadDraft) {
        return true;
      } else {
        return false;
      }
    },

    loadOrigin(loadFromDraft) {
      if (loadFromDraft) {
        this.getDraft();
        this.$refs.selectOrigin.style.display = "none";
      } else {
        this.$refs.selectOrigin.style.display = "none";
        this.getSelectedEvent();
      }
    },

    // update event when there user made changes in child components
    updateEvent(tempObj) {
      MyHelper.updateEvent(tempObj, this.event, this);
    },

    backToPrevStep(tempObj) {
      MyHelper.backToPrevStep(tempObj, this);
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

    async deleteEvent() {
      this.$refs.deleteEvent.style.display = "none";
      let obj = {
        eventID: this.selectedEvent,
      };
      await this.$store.dispatch("eventStore/deleteEvent", obj);
      this.$refs.deleteModal.style.display = "flex";
      this.selectedEvent = "";
      this.selectedDetailEvent = "";
      this.event = "";
      this.showNavAndBtn = false;
      this.getEvents();
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

    removeDeletedItemFromErrorCSS(deletedItem) {
      MyHelper.removeDeletedItemFromErrorCSS(deletedItem, this);
    },
  },
};
</script>

<style scoped>
p,
h1 {
  color: purple;
  margin-block-start: 0.5rem;
  margin-block-end: 0.5rem;
}

.BG {
  z-index: 1;
}

.errorContainer {
  border-style: dashed;
  border-color: red;
  border-width: 3px;
}

.main-container .errorContainer p {
  color: red;
}

.main-container {
  width: 80vw;
  margin: 20px auto;
  padding: 30px;
  background: white;
  margin-top: 35px;
  display: grid;
  grid-template:
    "header header header"
    "a a a"
    "nav nav nav"
    "b b b"
    ". save save";
  grid-template-columns: repeat(3, 1fr);
}

.editEventTitleContainer {
  grid-area: header;
}

.selectEvent {
  grid-area: a;
  align-self: center;
  margin: 1rem;
}

.selectEvent .button-styled-2 {
  padding: 4px 19px;
  width: 7.5rem;
  margin: 0.2rem;
}

.eventCard {
  padding: 20px 10px;
  grid-area: b;
  overflow: auto;
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

.apartmentInfoContainer div {
  display: flex;
  margin: 0.5rem;
}

.eventCard p {
  color: purple;
  flex: auto;
  min-width: 10vw;
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

select {
  text-align: center;
  margin: 0.3rem;
}

.editEvent.popup {
  background-color: white;
  border-radius: 25px;
  position: relative;
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

.deleteEventBackGround {
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

.deleteEventBackGround .deleted display none,
.undoConfirmationModal,
.deleteEventModal {
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

.undoModalText,
.deleteEventText {
  grid-area: t;
  padding: 10px;
}

.runUndo,
.runDelete {
  grid-area: y;
  margin: 10px;
  min-width: 7vw;
}

.notRunUndo,
.notRunDelete {
  grid-area: n;
  margin: 10px;
  min-width: 7vw;
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

.deleteModalBackGround {
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

.confirmationModal {
  width: 500px;
  height: 300px;
  background-color: white;
  border-radius: 25px;
  position: relative;
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

.addCFbtn {
  margin-inline-start: auto;
}

.customFieldContainer {
  flex-direction: column;
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