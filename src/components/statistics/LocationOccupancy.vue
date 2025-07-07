<template>
  <div>
    <h1>Location {{ locationId }} Occupancy</h1>
    <LoadingOverlay v-if="loading" />
    <div class="row" v-if="!loading">
      <div
        v-for="cam in cameras"
        :key="cam.id || cam.camera_id"
        class="col-md-4 mb-3"
      >
        <div class="card h-100" style="cursor:pointer" @click="selectCamera(cam)">
          <div class="card-body text-center">
            <h5 class="card-title">{{ cam.api_code || cam.id || cam.camera_id }}</h5>
            <p class="mb-1">Free: {{ cam.free }}</p>
            <p class="mb-1">Occupied: {{ cam.occupied }}</p>
          </div>
        </div>
      </div>
    </div>
    <CameraSpotsModal v-if="selected" :camera="selected" @close="selected=null" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import occupancyService from '@/services/occupancyService'
import LoadingOverlay from '../LoadingOverlay.vue'
import CameraSpotsModal from './CameraSpotsModal.vue'

const route = useRoute()
const locationId = +route.params.id
const cameras = ref([])
const loading = ref(false)
const selected = ref(null)

async function load() {
  loading.value = true
  try {
    const { data } = await occupancyService.getByLocation(locationId)
    cameras.value = data.cameras || data
  } finally {
    loading.value = false
  }
}

function selectCamera(cam) {
  selected.value = cam
}

onMounted(load)
</script>
