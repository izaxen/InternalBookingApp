<template>
  <transition name="fade" appaer>
    <div class="darken" v-if="showModal"></div>
  </transition>
  <div class="slideshow" v-if="imagesProp">
    <transition name="fade" appear>
      <div class="imgModal" v-if="showModal">
        <div class="leftArrow" @click="modalprevIndex">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <img
          class="imgZoomIn"
          :src="images[imageIndex]"
          alt=""
          @click="closeModal"
        />
        <button
          type="button"
          class="deleteBtn"
          @click="deletePicture"
          v-if="fromEditation ? true : false"
        >
          Delete Picture
        </button>
        <div class="rightArrow" @click="modalnextIndex">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ["imagesProp", "showModal", "imageIndexProp", "fromEditation"],
  emits: ["showModalChange", "updatedImages"],
  data() {
    return {
      images: this.$props.imagesProp,
      imageIndex: this.$props.imageIndexProp,
    };
  },

  methods: {
    closeModal() {
      this.$emit("showModalChange", false);
      document.body.classList.remove("modal-open");
    },

    modalprevIndex() {
      if (this.imageIndex - 1 < 0) {
        this.imageIndex = this.images.length - 1;
      } else {
        this.imageIndex -= 1;
      }
    },

    modalnextIndex() {
      if (this.imageIndex + 1 >= this.images.length) {
        this.imageIndex = 0;
      } else {
        this.imageIndex += 1;
      }
    },

    deletePicture() {
      this.images.splice(this.imageIndex, 1);
      if (this.images.length == 0) {
        this.closeModal();
        this.modalIndex = "";
      } else {
        this.modalnextIndex();
      }
      this.$emit("updatedImages", this.images);
    },

    resize(dataUrl, maxWidth = 1024, maxHeight = 768, quality = 0.8) {
      let resized = new Promise((res) => {
        let img = new Image();
        img.src = dataUrl;
        img.onload = () => {
          let { width: w, height: h } = img;
          let scale = Math.min(maxWidth / w, maxHeight / h);
          w = Math.floor(w * scale);
          h = Math.floor(h * scale);
          let canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          let ctx = canvas.getContext("2d");
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, w, h);
          res(canvas.toDataURL("image/jpeg", quality));
        };
      });
      return resized;
    },
  },
};
</script>
<style scoped>
.images {
  align-self: center;
}

.darken {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.imgModal {
  position: fixed;
  top: 54%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  border-radius: 16px;
  display: grid;
  width: 80vw;
  height: 90vh;
  grid-template-areas:
    "mo mo mo"
    "mo mo mo"
    "mo mo mo"
    "left btn right";
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(0, 1fr));
}

.deleteBtn {
  grid-area: btn;
  color: black;
  place-self: center;
  background-color: white;
  font-size: x-large;
  font-family: inherit;
}

.imgZoomIn {
  height: 100%;
  /* object-fit: cover; */
  max-width: 100%;
  padding: 15px;
  background-color: white;
  box-shadow: 0 1px 3px rgb(34 25 25 / 40%);
  -moz-box-shadow: 0 1px 2px rgba(34, 25, 25, 0.4);
  -webkit-box-shadow: 0 1px 3px rgb(34 25 25 / 40%);
  border-radius: 15px;
  grid-area: mo;
  /* margin-top: 50px; */
  justify-self: center;
  animation: 0.5s ease-out 0s 1 slideInFromLeft;
  cursor: pointer;
}
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}
@keyframes scroll {
  0% {
    opacity: 0;
    transform: rotate(45deg) translate(0px, 0px);
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: rotate(45deg) translate(0px, 0px);
  }
}
.leftArrow {
  place-self: center;
  display: flex;
  flex-direction: row-reverse;
  grid-area: left;
  cursor: pointer;
}
.rightArrow {
  place-self: center;
  display: flex;
  grid-area: right;
  cursor: pointer;
}
.leftArrow span {
  display: block;
  width: 20px;
  height: 20px;
  border-bottom: 5px solid white;
  border-left: 5px solid white;
  margin: -5px;
  transform: rotate(45deg);
  animation: scroll 2s infinite;
}
.rightArrow span {
  display: block;
  width: 20px;
  height: 20px;
  border-top: 5px solid white;
  border-right: 5px solid white;
  margin: -5px;
  transform: rotate(45deg);
  animation: scroll 2s infinite;
}
.leftArrow span:nth-child(2),
.rightArrow span:nth-child(2) {
  animation-delay: 0.2s;
}
.leftArrow span:nth-child(3),
.rightArrow span:nth-child(3) {
  animation-delay: 0.4s;
}
.slideshow {
  top: 50px;
  left: 0;
  position: relative;
}
</style>