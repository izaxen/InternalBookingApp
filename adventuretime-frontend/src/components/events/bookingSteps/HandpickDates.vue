<template>
  <div class="hand-picked-container">
    <div class="calendar" v-if="tempDate">
      <div class="accommodations-container">
        <div
          v-for="ac in getAccommodations"
          :class="
            ac.accommodationTitle === selectedAccTitle
              ? 'acco selectedAcco shadow'
              : 'acco shadow'
          "
          :key="ac"
          @click="clickOnAccomoddation(ac)"
        >
          <h2>{{ ac.accommodationTitle }}</h2>
        </div>
      </div>
    </div>

    <div class="date-room-bed-container shadow">
      <div class="date-slot-container">
        <div class="date-slot x" v-for="index in getDays" :key="index">
          <p>{{ index }}</p>
        </div>
      </div>

      <div class="render-rooms">
        <div class="rooms-b" v-for="room in getActiveRooms" :key="room">
          <div class="roomTitle">
            {{ room.roomTitle }}
          </div>
          <div class="bedsb" v-for="bed in room.beds" :key="bed">
            <div class="bedsize">
              <p class="bedsize-p">
                Bed: {{ getBedNumber(bed.bedID) }} {{ bed.bedSize }}
              </p>
            </div>
            <div class="render-bed-days">
              <div
                class="bed-days"
                v-for="(days, index) in getDays"
                :key="days"
              >
                <input
                  type="checkbox"
                  v-if="!disabledBed(bed.bedID + createListWithDate()[index])"
                  :value="
                    createBedObject(
                      bed.bedID,
                      createListWithDate()[index],
                      room.roomTitle
                    )
                  "
                  v-model="checkedDates"
                />
                <input
                  type="checkbox"
                  v-else
                  :value="bed.bedID + createListWithDate()[index]"
                  disabled
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      class="button-styled-2"
      v-if="checkedDates.length > 0"
      @click="createNewBookedDates()"
    >
      Continue
    </button>
  </div>
</template>

<script>
export default {
  emits: ["setStep"],
  data() {
    return {
      days: "",
      startDate: "",
      endDate: this.$store.getters["bookingStore/booking"].selectedEndDate,
      tempDate: new Date(),
      roomList:
        this.$store.getters["eventStore/selectedEvent"].accommodations[0].rooms,
      unAvailableBeds: [],
      usp: new URLSearchParams(),
      checkedDates: [],
      selectedAccTitle:
        this.$store.getters["eventStore/selectedEvent"].accommodations[0]
          .accommodationTitle,
    };
  },

  computed: {
    getAccommodations() {
      return this.$store.getters["eventStore/selectedEvent"].accommodations;
    },
    getDays() {
      return this.createListWithDate();
    },

    getActiveRooms() {
      return this.roomList;
    },
    getStartDate(){
      return this.startDate;
    }
  },

  mounted() {
    this.setStartDate();
    this.countDaysInEvent();
    this.filterAccommodations();
    
  },

  methods: {

     setStartDate(){
      if(new Date() > new Date(this.$store.getters["bookingStore/booking"].selectedStartDate)){
        this.startDate = new Date().toLocaleDateString();
      }
      else{
        this.startDate = this.$store.getters["bookingStore/booking"].selectedStartDate;
      }
    },
    createBedObject(bedID, date, roomTitle) {
      return {
        bedID: bedID,
        startDate: this.createDateString(date),
        endDate: this.createDateString(this.calcEndDate(date)),
        roomTitle: roomTitle,
        accommodationTitle: this.selectedAccTitle,
      };
    },

    disabledBed(id) {
      let status = false;
      this.unAvailableBeds.forEach((bedID) => {
        if (bedID === id) {
          status = true;
          return status;
        }
      });
      return status;
    },

    async filterAccommodations() {
      this.unAvailableBeds = await this.getUnavailableBedsDetailed();
    },

    async getUnavailableBedsDetailed() {
      this.usp.set(
        "startDate",
        this.$store.getters["bookingStore/booking"].selectedStartDate
      );
      this.usp.set(
        "endDate",
        this.$store.getters["bookingStore/booking"].selectedEndDate
      );
      this.usp.set("eventID", this.$route.params.id);
      return this.$store.dispatch(
        "eventStore/getUnAvailableBedsDetailed",
        this.usp.toString()
      );
    },

    countDaysInEvent() {
      let date1 = new Date(this.startDate);
      let date2 = new Date(this.endDate);
      let difference = date2.getTime() - date1.getTime();
      this.days = Math.ceil(difference / (1000 * 3600 * 24));
    },

    getNewDate() {
      Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    },

    getDate(daysToAdd) {
      this.getNewDate();
      var date = new Date(this.startDate);
      return date.addDays(daysToAdd).getDate();
    },

    getMonth(daysToAdd) {
      var date = new Date(this.startDate);
      return date.addDays(daysToAdd).getMonth();
    },

    createListWithDate() {
      let dateList = [];
      for (let i = 0; i < this.days + 1; i++) {
        dateList.push(this.getDate(i) + "/" + (this.getMonth(i) + 1));
      }
      return dateList;
    },

    getBedNumber(bedID) {
      var bednr = bedID.split("-");
      bednr = parseInt(bednr[3]) + 1;
      return bednr;
      
    },

    clickOnAccomoddation(current) {
      this.selectedAccTitle = current.accommodationTitle;
      this.roomList = current.rooms;
    },
    createNewBookedDates() {
      const tempListBeds = [...this.checkedDates];

      tempListBeds.sort(
        (date1, date2) =>
          new Date(date1.startDate).getTime() -
          new Date(date2.startDate).getTime()
      );

      let generatedDateList = [];
      let tempDateAndIDList = {
        bedID: "",
        startDate: "",
        endDate: "",
        roomTitle: "",
        accommodationTitle: "",
      };

      for (let i = 0; i < tempListBeds.length; i++) {
        let j = i + 1;

        let dateDTO = {
          bedID: tempListBeds[i].bedID,
          startDate: new Date(tempListBeds[i].startDate).toLocaleDateString(
            "sv-SE"
          ),
          endDate: new Date(tempListBeds[i].endDate).toLocaleDateString(
            "sv-SE"
          ),
          roomTitle: tempListBeds[i].roomTitle,
          accommodationTitle: tempListBeds[i].accommodationTitle,
        };

        if (
          !tempDateAndIDList.bedID ||
          dateDTO.bedID !== tempDateAndIDList.bedID
        ) {
          tempDateAndIDList.bedID = dateDTO.bedID;
          tempDateAndIDList.startDate = dateDTO.startDate;
          tempDateAndIDList.endDate = dateDTO.endDate;
          tempDateAndIDList.roomTitle = dateDTO.roomTitle;
          tempDateAndIDList.accommodationTitle = dateDTO.accommodationTitle;
        }

        if (j <= tempListBeds.length - 1) {
          if (tempListBeds[i].bedID === tempListBeds[j].bedID) {
            if (
              new Date(tempListBeds[i].endDate).toLocaleDateString("sv-SE") ===
              tempListBeds[j].startDate
            ) {
              tempDateAndIDList.endDate = new Date(
                tempListBeds[j].endDate
              ).toLocaleDateString("sv-SE");
            } else {
              generatedDateList.push(
                this.createTempPushableBedobj(tempDateAndIDList)
              );
              tempDateAndIDList.startDate = new Date(
                tempListBeds[j].startDate
              ).toLocaleDateString("sv-SE");
            }
          } else {
            tempDateAndIDList.endDate = new Date(
              tempListBeds[i].endDate
            ).toLocaleDateString("sv-SE");
            generatedDateList.push(
              this.createTempPushableBedobj(tempDateAndIDList)
            );
          }
        } else if (i === tempListBeds.length - 1) {
          let ii = i - 1;
          if (i != 0) {
            if (tempListBeds[i].bedID === tempListBeds[ii].bedID) {
              if (
                new Date(
                  tempListBeds[i].startDate === tempListBeds[ii].endDate
                ).toLocaleDateString("sv-SE")
              ) {
                tempDateAndIDList.endDate = new Date(
                  tempListBeds[i].endDate
                ).toLocaleDateString("sv-SE");
                generatedDateList.push(
                  this.createTempPushableBedobj(tempDateAndIDList)
                );
              }
            } else {
              generatedDateList.push(
                this.createTempPushableBedobj(tempDateAndIDList)
              );
            }
          } else {
            generatedDateList.push(
              this.createTempPushableBedobj(tempDateAndIDList)
            );
          }
        }
      }
      this.$emit("setStep", 11);
      this.$store.dispatch(
        "bookingStore/setSingleBookingsList",
        generatedDateList
      );
    },

    createTempPushableBedobj(tempDateAndIDList) {
      const o = tempDateAndIDList.bedID;
      const p = new Date(tempDateAndIDList.startDate).toLocaleDateString(
        "sv-SE"
      );
      const q = new Date(tempDateAndIDList.endDate).toLocaleDateString("sv-SE");
      const r = tempDateAndIDList.roomTitle;
      const y = tempDateAndIDList.accommodationTitle;
      return {
        bedID: o,
        startDate: p,
        endDate: q,
        roomTitle: r,
        accommodationTitle: y,
      };
    },

    calcEndDate(date) {
      let tempDate = date.split("/")[0];
      let calcNewEndDay = parseInt(tempDate) + 1;
      let month = date.substring(date.indexOf("/") + 1);
      return calcNewEndDay + "/" + month;
    },

    createDateString(date) {
      let day = date.split("/")[0];
      let month = date.substring(date.indexOf("/") + 1);
      return new Date(
        this.$store.getters["bookingStore/booking"].selectedStartDate.split(
          "-"
        )[0] +
          "-" +
          month +
          "-" +
          day
      ).toLocaleDateString("sv-SE");
    },
  },
};
</script>

<style scoped>
* {
  color: rgb(255, 255, 255);
}

.hand-picked-container {
  width: 100%;
}

.calendar {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin: 0 15px;
}

.accommodations-container {
  display: flex;
  flex-direction: row;
}

.acco {
  padding: 5px 15px;
  border-radius: 5px;
  background-color: #9538b3;
  margin-right: 5px;
}
.acco:hover {
  background-color: #9b51b4;
  cursor: pointer;
}

.selectedAcco {
  background-color: #0075ff;
}
.selectedAcco:hover {
  background-color: #2a8cfc;
}

.date-room-bed-container {
  display: grid;
  grid-template-columns: 20% 80%;
  overflow: auto;
  margin: 20px;
  background-color: #9538b3;
  padding: 10px;
  border-radius: 10px;
}

.render-rooms {
  grid-column-start: 1;
  grid-column-end: 3;
  width: 100%;
  display: grid;
  grid-template-columns: 20% 80%;
}
.rooms-b {
  grid-column-start: 1;
  grid-column-end: 3;
  display: grid;
  grid-template-columns: 20% 80%;
  margin-bottom: 10px;
}

.roomTitle {
  grid-column-end: 2;
  font-style: oblique;
  font-weight: bold;
  border-bottom: 1px solid grey;
}

.date-slot-container {
  grid-column-start: 2;
  display: flex;
}
.date-slot {
  margin: 0px 5px;
}
.render-bed-days {
  grid-column-start: 2;
  display: flex;
  flex-direction: row;
  justify-content: left;
}

.bedsb {
  grid-column-start: 1;
  grid-column-end: 3;
  display: grid;
  grid-template-columns: 20% 80%;
  align-items: center;
}
.bed-days {
  margin: 0 5px;
  min-width: 48px;
}
input {
  width: 20px;
  height: 20px;
}

p {
  width: 48px;
  margin: 0;
}
h2 {
  margin: 0;
}

.bedsize {
  grid-column-end: 2;
  display: flex;
  justify-content: center;
}

.bedsize-p {
  display: flex;
  margin: 10px 0 10px 0;
}
@media screen and (max-width: 600px) {
  p.bedsize-p {
    font-size: small;
  }
  h2 {
    font-size: medium;
    font-weight: bold;
  }
  .date-slot-container {
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 1080px) {
  .nav-title {
    visibility: hidden;
  }
}
</style>
