<template>
  <div v-if="ticket">
    <h1>Ticket #{{ ticket.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Plate Number: {{ ticket.plate_number }}</li>
      <li class="list-group-item">Plate Code: {{ ticket.plate_code }}</li>
      <li class="list-group-item">Entry Time: {{ ticket.entry_time }}</li>
      <li class="list-group-item">Exit Time: {{ ticket.exit_time }}</li>
    </ul>
    <div v-if="videoUrl || loading" class="position-relative mb-3">
      <LoadingOverlay v-if="loading" />
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
const videoUrl = ref('')
const loading = ref(false)

onMounted(async () => {
  const { data } = await ticketService.get(route.params.id)
  ticket.value = data
  try {
    loading.value = true
    const vidRes = await ticketService.getVideo(route.params.id)
    videoUrl.value = URL.createObjectURL(vidRes.data)
  } catch (_) {
  } finally {
    loading.value = false
  }
})
</script>
