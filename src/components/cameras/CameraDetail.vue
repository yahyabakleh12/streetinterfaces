<template>
  <div v-if="camera">
    <h1>Camera #{{ camera.id }}</h1>
    <ul>
      <li>Pole ID: {{ camera.pole_id }}</li>
      <li>API Code: {{ camera.api_code }}</li>
      <li>IP: {{ camera.p_ip }}</li>
      <li># Spots: {{ camera.number_of_parking }}</li>
      <li>VPN IP: {{ camera.vpn_ip || '–' }}</li>
    </ul>
    <router-link to="/cameras">Back to list</router-link>
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
