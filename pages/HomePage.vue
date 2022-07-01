<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Nuxt-Ionic App</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="handleCreatePost"> Camera </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-loading :is-open="pending" message="LOADING..."></ion-loading>
      <ion-loading :is-open="pendingSave" message="SAVING..."></ion-loading>

      <!-- modal for data input -->
      <image-post-input
        :showImagePostInput="showModal"
        :imageURL="imageURL"
        @image-post-cancel="showModal = false"
        @image-post-submit="handleInputSubmit"
      ></image-post-input>

      <!-- list view of data -->
      <ion-card v-for="item in data" :key="item?.id">
        <ion-card-header>
          <ion-card-title>{{ item?.title }}</ion-card-title>
          <ion-card-subtitle>{{ item?.content }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content v-if="item?.image">
          <ion-img :src="(item?.image as any)" />
        </ion-card-content>
      </ion-card>

      <!-- <ion-img :src="imageURL"></ion-img> -->
    </ion-content>
  </ion-page>
  <Body> extra body stuff </Body>
</template>
<script lang="ts" setup>
import { Camera, CameraResultType, ImageOptions } from "@capacitor/camera";
import { saveConfig } from "@ionic/core";
import { ref } from "vue";
import ImagePostInput from "./components/ImagePostInput.vue";

interface ImagePost {
  id: number;
  title: string;
  content: string;
  createdAt: any;
  updatedAt: any;
  image: string;
  published: boolean;
}
interface ImagePostArray extends Array<ImagePost> {}

definePageMeta({
  alias: ["/", "/home"],
});

useHead({
  script: [
    {
      type: "module",
      src:
        "https://unpkg.com/@ionic/pwa-elements@latest/dist/ionicpwaelements/ionicpwaelements.esm.js",
    },
  ],
});

const ionRouter = useIonRouter();
const imageURL = ref(null);
const showModal = ref(false);
const pendingSave = ref(false);

const API_URL = useRuntimeConfig().public.API_URL;

// load the data
const { data, pending, error, refresh } = await useAsyncData<ImagePostArray>(
  "posts",
  () => $fetch(`${API_URL}/getAllPosts`)
);

/**
 *
 */
const handleCreatePost = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    width: 600,
    resultType: CameraResultType.Base64,
  });

  imageURL.value = `data:${image.format};base64,${image.base64String}`;

  showModal.value = true;
};

/**
 * handle the input submit event
 */
const handleInputSubmit = async ({ title, content }) => {
  console.log("handleInputSubmit");
  showModal.value = false;
  pendingSave.value = true;

  await useAsyncData<ImagePostArray>(
    "newPost",
    () =>
      $fetch(`${API_URL}/createPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
          image: imageURL.value,
        }),
      })
  );
  imageURL.value = null;
  await refresh();

  pendingSave.value = false;

};
</script>
