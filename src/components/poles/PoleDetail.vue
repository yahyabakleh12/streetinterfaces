<template>
  <div v-if="pole">
    <h1>Pole #{{ pole.id }}</h1>
    <ul>
      <li>Code: {{ pole.code }}</li>
      <li>Zone ID: {{ pole.zone_id }}</li>
      <li>Location ID: {{ pole.location_id }}</li>
      <li># Cameras: {{ pole.number_of_cameras }}</li>
    </ul>
    <router-link to="/poles">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import poleService from '@/services/poleService'

const route = useRoute()
const pole = ref(null)

onMounted(async () => {
  const { data } = await poleService.get(route.params.id)
  pole.value = data
})
</script>
