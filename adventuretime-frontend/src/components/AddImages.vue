<template>
  <input
    type="file"
    name="image"
    style="display: none"
    ref="fileInput"
    accept="image/*"
    @change="addImages"
  />

  <div class="slides" v-if="images">
    <div class="images" v-for="(image, index) in images" :key="index">
      <img :src="image" :key="index" @click="ImgModal(index)" />
    </div>
  </div>

  <ZoomInPictureModal
    v-if="showModal"
    :imagesProp="images"
    :imageIndexProp="imageIndex"
    :showModal="showModal"
    :fromEditation="true"
    @showModalChange="showModalChange($event)"
    @updatedImages="images = $event"
  />
</template>

<script>
import ZoomInPictureModal from "./modals/ZoomInPictureModal.vue";
export default {
  props: ["imagesProp"],
  emits: ["uploadedImg", "updatedImages"],
  data() {
    return {
      files: [],
      url: [],
      imageUrl: "",
      image: null,
      images: this.$props.imagesProp,
      showModal: false,
      imageIndex: "",
      modalUrl: "",
    };
  },
  components: {
    ZoomInPictureModal,
  },

  methods: {
    onAddImage() {
      if (this.$props.imagesProp.length < 4) {
        this.$refs.fileInput.click();
      } else {
        alert("maximum images reached");
      }
    },

    async addImages(event) {
      this.files = event.target.files;
      this.imageUrl = await this.convertImageToB64(this.files[0]);
      let img = await this.resize(this.imageUrl);
      this.images.push(img);
      this.$emit("uploadedImg", this.images);
    },

    convertImageToB64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    ImgModal(index) {
      this.imageIndex = index;
      this.modalUrl = this.images[this.imageIndex];
      this.showModal = true;
      // document.body.classList.add("modal-open");
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

    showModalChange(boolean) {
      this.showModal = boolean;
    },
  },
};
</script>
<style scoped>
.slides {
  margin: 1rem 0.5rem 1rem 0.5rem;
  display: grid;
  grid-template-columns: repeat(4, 25%);
  grid-column-start: span 2;
  /* grid-gap: 0.5em; */
}

.slides img {
  height: 22vh;
  object-fit: cover;
  width: -webkit-fill-available;
}

.images {
  align-self: center;
}

.images:hover {
  cursor: pointer;
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
</style>