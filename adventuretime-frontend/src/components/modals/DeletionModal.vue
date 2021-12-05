<template>
  <div class="main-container-modal">
    <div class="close">
      <label @click="closeModal">&#10006;</label>
    </div>

    <div class="padding20" v-if="isConnected">
      <p>Booking nr: {{ bookingIDAndGroupID.bookingID }}</p>
      <p>There is connected bookings to your chosen booking.</p>
      <p>Confirm your cancelation:</p>
      <button class="margin10 button-styled-1" @click="deleteAllConnectedBookings">
        Cancel all
      </button>
      <button class="margin10 button-styled-1" @click="deleteSingleBooking">
        Cancel only chosen
      </button>
    </div>

    <div class="padding20" v-else>
      <p class="bold">Do you wish to cancel</p>
      <p>Booking nr: {{ bookingIDAndGroupID.bookingID }}</p>
      
      <button class="button-styled-1" @click="deleteSingleBooking">Cancel booking</button>
    </div>
  </div>
</template>

<script>
export default {
  props: ["bookingIDAndGroupID", "admin"],
  emits: ["closeModal"],

  data() {
    return {
      myBookings: this.$store.getters["bookingStore/myBookings"],
      deletionList: [],
      allBookings: this.$store.getters["bookingStore/allBookings"],
    };
  },
  computed: {
    isConnected() {
      return this.deletionList.length > 1;
    },
  },

  mounted() {
    this.setDeletedList();
  },

  methods: {
    createUrlSearch() {
      const query = new URLSearchParams();
      this.deletionList.map((x) => {
        query.append("id", x);
      });
      return query;
    },

    closeModal() {
      this.$emit("closeModal", false);
    },

    async deleteAllConnectedBookings() {
      this.deletionList.map((x) => {
        this.filterDeletedBooking(x);
      });

     await this.$store.dispatch(
        "bookingStore/deleteMyBooking",
        this.createUrlSearch(this.deletionList)
      );
      
      this.closeModal();
    },
    filterDeletedBooking(bookingID) {
      if (this.$props.admin) {
        this.allBookings = this.allBookings.filter((x) => x.id !== bookingID);
        this.$store.commit("bookingStore/setAllBookings", this.allBookings);
      } else {
        this.myBookings = this.myBookings.filter((x) => x.id !== bookingID);
        this.$store.commit("bookingStore/setMyBookings", this.myBookings);
      }
    },

    async deleteSingleBooking() {
      this.filterDeletedBooking(this.$props.bookingIDAndGroupID.bookingID);
      const query = new URLSearchParams();
      query.append("id", this.$props.bookingIDAndGroupID.bookingID);
      await this.$store.dispatch("bookingStore/deleteMyBooking", query);
      this.closeModal();
    },

    setDeletedList() {
      this.deletionList = [];

      if (this.$props.admin) {
        this.allBookings.map((x) => {
          if (x.groupID === this.$props.bookingIDAndGroupID.groupID) {
            this.deletionList.push(x.id);
          }
        });
      } else {
        this.myBookings.map((y) => {
          if (y.groupID === this.$props.bookingIDAndGroupID.groupID) {
            this.deletionList.push(y.id);
          }
        });
      }
    },
  },
};
</script>

<style scoped>
p ,label{
  
  color:black;
}
.main-container-modal {
  padding: 7px;
  background-color: rgb(255, 255, 255);
  border-radius: 5px;
  border: 1px solid #3d1e7b;
}
.main-container-modal button {
  margin: 0px 20px 0 20px;
}
.padding20 {
  padding: 5px 20px 20px 20px;
}
.close {
  display: flex;
  justify-content: flex-end;
}
.margin10 {
  margin: 10px;
}
</style>