<template>
  <div>
    <h1>Camera Clip</h1>
    <form @submit.prevent="fetchClip">
      <div class="mb-3">
        <label class="form-label">Camera</label>
        <select v-model="selectedCamera" class="form-select">
          <option v-for="cam in cameras" :key="cam.id" :value="cam.id">
            {{ cam.api_code || `Camera ${cam.id}` }}
          </option>
        </select>
      </div>
      <div class="mb-3">
        <label class="form-label">Start</label>
        <input type="datetime-local" step="1" v-model="start" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">End</label>
        <input type="datetime-local" step="1" v-model="end" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Get Clip</button>
    </form>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
    <div v-if="videoUrl" class="mt-3">
      <video :src="videoUrl" controls class="w-100" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import cameraService from '@/services/cameraService'

const cameras = ref([])
const selectedCamera = ref('')
const start = ref('')
const end = ref('')
const videoUrl = ref('')
const error = ref('')

onMounted(async () => {
  try {
    const { data } = await cameraService.getAll()
    cameras.value = data
    if (!selectedCamera.value && cameras.value.length) {
      selectedCamera.value = cameras.value[0].id
    }
  } catch (_) {
    error.value = 'Failed to load cameras'
  }
})

async function fetchClip() {
  videoUrl.value = ''
  error.value = ''
  if (!selectedCamera.value) {
    error.value = 'Please select a camera'
    return
  }
  try {
    const { data } = await cameraService.getClip(selectedCamera.value, {
      start: start.value,
      end: end.value,
    })
    videoUrl.value = URL.createObjectURL(data)
  } catch (_) {
    error.value = 'Failed to load clip'
  }
}
</script>
