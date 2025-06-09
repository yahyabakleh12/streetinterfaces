<template>
  <div v-if="zone">
    <h1>Zone #{{ zone.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Code: {{ zone.code }}</li>
      <li class="list-group-item">Location ID: {{ zone.location_id }}</li>
    </ul>
    <router-link to="/zones" class="btn btn-secondary">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import zoneService from '@/services/zoneService'

const route = useRoute()
const zone = ref(null)

onMounted(async () => {
  const { data } = await zoneService.get(route.params.id)
  zone.value = data
})
</script>
