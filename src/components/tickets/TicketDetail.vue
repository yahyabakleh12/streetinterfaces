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
      <img v-if="imageUrl" :src="imageUrl" class="img-fluid" />
    </div>
    <div v-if="videoUrl || loadingVideo" class="position-relative mb-3">
      <LoadingOverlay v-if="loadingVideo" />
      <video v-if="videoUrl" :src="videoUrl" controls autoplay class="w-100" />
    </div>
    <router-link to="/tickets" class="btn btn-secondary">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ticketService from '@/services/ticketService'
import LoadingOverlay from '../LoadingOverlay.vue'

const route = useRoute()
const ticket = ref(null)
const imageUrl = ref('')
const videoUrl = ref('')
const loadingImage = ref(false)
const loadingVideo = ref(false)

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
    loadingVideo.value = true
    const vidRes = await ticketService.getVideo(route.params.id)
    videoUrl.value = URL.createObjectURL(vidRes.data)
  } catch (_) {
  } finally {
    loadingVideo.value = false
  }
})
</script>
