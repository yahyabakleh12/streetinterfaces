<template>
  <div v-if="pole">
    <h1>Pole #{{ pole.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">API Pole ID: {{ pole.api_pole_id }}</li>
      <li class="list-group-item">Code: {{ pole.code }}</li>
      <li class="list-group-item">API Pole ID: {{ pole.api_pole_id }}</li>
      <li class="list-group-item">Zone ID: {{ pole.zone_id }}</li>
      <li class="list-group-item">Location ID: {{ pole.location_id }}</li>
      <li class="list-group-item"># Cameras: {{ pole.number_of_cameras }}</li>
    </ul>
    <router-link to="/poles" class="btn btn-secondary">Back to list</router-link>
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
