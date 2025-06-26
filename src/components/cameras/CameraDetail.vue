<template>
  <div v-if="camera">
    <h1>Camera #{{ camera.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Pole ID: {{ camera.pole_id }}</li>
      <li class="list-group-item">Portal ID: {{ camera.portal_id }}</li>
      <li class="list-group-item">API Code: {{ camera.api_code }}</li>
      <li class="list-group-item">IP: {{ camera.p_ip }}</li>
      <li class="list-group-item"># Spots: {{ camera.number_of_parking }}</li>
      <li class="list-group-item">VPN IP: {{ camera.vpn_ip || '–' }}</li>
    </ul>
    <router-link to="/cameras" class="btn btn-secondary">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import cameraService from '@/services/cameraService'

const route = useRoute()
const camera = ref(null)

onMounted(async () => {
  const { data } = await cameraService.get(route.params.id)
  camera.value = data
})
</script>
