<template>
  <ion-modal :is-open="showImagePostInput" v-on:ion-modal-did-dismiss="cancelModal">
    <ion-header>
      <ion-toolbar>
        <ion-title>Image Post Input</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <IonItem>
        <IonLabel position="floating">Title</IonLabel>
        <IonInput v-model="data.title" />
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Content</IonLabel>
        <IonInput v-model="data.content" />
      </IonItem>
      <div v-if="imageURL" style="margin: auto; width: 50%; margin-top: 18px">
        <ion-img :src="imageURL" />
      </div>
      <div style="float: right; margin: 12px">
        <ion-button @click="cancelModal" color="danger">CANCEL</ion-button>
        <ion-button @click="submit">SAVE</ion-button>
      </div>
    </ion-content>
  </ion-modal>
</template>
<script lang="ts" setup>
defineProps({
  // flag to show/hide the modal
  showImagePostInput: {
    type: Boolean,
    default: false,
  },
  // image URL data
  imageURL: {
    type: String,
    default: "",
  },
});

// events emmitted by the component
const emit = defineEmits<{
  // event to close the modal
  (event: "image-post-cancel"): void;
  // event to save the data
  (
    event: "image-post-submit",
    { title, content }: { title: string; content: string }
  ): void;
}>();

// data from the component form
const data = ref({
  title: "",
  content: "",
});

const submit = () => {
  console.log("submit");
  emit("image-post-submit", {
    title: data.value.title,
    content: data.value.content,
  });

  data.value = {
    title: "",
    content: "",
  };
};

const cancelModal = () => {
  console.log("closeModal");
  emit("image-post-cancel");
};
</script>
