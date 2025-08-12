<template>
  <div v-if="ticket">
    <h1>Ticket #{{ ticket.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Plate Number: {{ ticket.plate_number }}</li>
      <li class="list-group-item">Plate Code: {{ ticket.plate_code }}</li>
      <li class="list-group-item">Entry Time: {{ ticket.entry_time }}</li>
      <li class="list-group-item">Exit Time: {{ ticket.exit_time }}</li>
    </ul>
    <div v-if="imageUrl || loadingImage" class="position-relative mb-3">
      <LoadingOverlay v-if="loadingImage" />
      <img
        v-if="imageUrl"
        :src="imageUrl"
        class="img-thumbnail"
        style="max-width: 150px; cursor: pointer"
        @click="openImage(imageUrl)"
      />
    </div>
    <div v-if="exitImageUrl || loadingExitImage" class="position-relative mb-3">
      <LoadingOverlay v-if="loadingExitImage" />
      <img
        v-if="exitImageUrl"
        :src="exitImageUrl"
        class="img-thumbnail"
        style="max-width: 150px; cursor: pointer"
        @click="openImage(exitImageUrl)"
      />
    </div>
    <ImageModal v-if="selectedImage" :image="selectedImage" @close="selectedImage = ''" />
    <router-link to="/tickets" class="btn btn-secondary">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ticketService from '@/services/ticketService'
import LoadingOverlay from '../LoadingOverlay.vue'
import ImageModal from '@/components/manualReviews/ImageModal.vue'

const route = useRoute()
const ticket = ref(null)
const imageUrl = ref('')
const exitImageUrl = ref('')
const loadingImage = ref(false)
const loadingExitImage = ref(false)
const selectedImage = ref('')

onMounted(async () => {
  const { data } = await ticketService.get(route.params.id)
  ticket.value = data
  try {
    loadingImage.value = true
    const imgRes = await ticketService.getImage(route.params.id)
    imageUrl.value = URL.createObjectURL(imgRes.data)
  } catch (_) {
  } finally {
    loadingImage.value = false
  }

  try {
    loadingExitImage.value = true
    const exitImgRes = await ticketService.getExitImage(route.params.id)
    exitImageUrl.value = URL.createObjectURL(exitImgRes.data)
  } catch (_) {
  } finally {
    loadingExitImage.value = false
  }
})

function openImage(img) {
  selectedImage.value = img
}
</script>
