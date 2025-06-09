<template>
  <div v-if="zone">
    <h1>Zone #{{ zone.id }}</h1>
    <ul>
      <li>Code: {{ zone.code }}</li>
      <li>Location ID: {{ zone.location_id }}</li>
    </ul>
    <router-link to="/zones">Back to list</router-link>
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
