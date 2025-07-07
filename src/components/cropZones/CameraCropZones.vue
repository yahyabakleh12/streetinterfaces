<template>
  <div>
    <h1>Camera {{ camId }} Crop Zone</h1>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div
      v-if="imageUrl || loading"
      style="position: relative; display: inline-block;"
      @click="recordPoint"
    >
      <LoadingOverlay v-if="loading" />
      <img v-if="imageUrl" :src="imageUrl" ref="img" class="img-fluid" @load="onImgLoad" />
      <svg
        v-if="imgWidth && imgHeight"
        :width="imgWidth"
        :height="imgHeight"
        class="position-absolute top-0 start-0"
        style="pointer-events: none;"
      >
        <polygon
          v-if="existingPoints.length"
          :points="polygonFor(existingPoints)"
          fill="rgba(0,255,0,0.3)"
          stroke="green"
          stroke-width="2"
        />
        <polygon
          v-if="!existingPoints.length && drawingPoints.length >= 3"
          :points="polygonFor(drawingPoints)"
          fill="rgba(0,255,0,0.3)"
          stroke="green"
          stroke-width="2"
        />
        <circle
          v-for="(p, i) in drawingPoints"
          v-if="!existingPoints.length"
          :key="i"
          :cx="p.x"
          :cy="p.y"
          r="4"
          fill="green"
        />
      </svg>
    </div>
    <div v-if="!imageUrl && !loading && !error">Loading frame...</div>
    <div class="mt-3">
      <button
        v-if="!existingPoints.length"
        class="btn btn-primary me-2"
        :disabled="drawingPoints.length < 3 || !!error"
        @click="save"
      >
        Save
      </button>
      <button class="btn btn-secondary me-2" @click="reset" v-if="!existingPoints.length">Reset</button>
      <router-link :to="`/cameras/${camId}`" class="btn btn-secondary">Back</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import cameraService from '@/services/cameraService'
import cropZoneService from '@/services/cropZoneService'
import LoadingOverlay from '../LoadingOverlay.vue'

const route = useRoute()
const camId = +route.params.id

const imageUrl = ref('')
const loading = ref(false)
const img = ref(null)
const imgWidth = ref(0)
const imgHeight = ref(0)
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const error = ref('')

const existingPoints = ref([])
const drawingPoints = ref([])

onMounted(load)

async function load() {
  try {
    error.value = ''
    loading.value = true
    const [frameRes, zonesRes] = await Promise.all([
      cameraService.getFrame(camId).catch(() => null),
      cropZoneService.getForCamera(camId)
    ])
    if (frameRes) imageUrl.value = URL.createObjectURL(frameRes.data)
    const zones = zonesRes.data
    if (zones && zones.length) {
      existingPoints.value = zones[0].points || []
    }
  } catch (_) {
    error.value = 'Failed to load crop zone.'
  } finally {
    loading.value = false
  }
}

function onImgLoad(e) {
  const el = e.target
  naturalWidth.value = el.naturalWidth
  naturalHeight.value = el.naturalHeight
  imgWidth.value = el.clientWidth
  imgHeight.value = el.clientHeight
}

function recordPoint(e) {
  if (existingPoints.value.length) return
  const rect = img.value.getBoundingClientRect()
  drawingPoints.value.push({ x: e.clientX - rect.left, y: e.clientY - rect.top })
}

function reset() {
  drawingPoints.value = []
}

async function save() {
  const ratioX = naturalWidth.value / imgWidth.value
  const ratioY = naturalHeight.value / imgHeight.value
  const naturalPoints = drawingPoints.value.map(p => ({
    x: Math.round(p.x * ratioX),
    y: Math.round(p.y * ratioY)
  }))
  await cropZoneService.create({ camera_id: camId, points: naturalPoints })
  await load()
}

function polygonFor(points) {
  if (!imgWidth.value) return ''
  const ratioX = imgWidth.value / naturalWidth.value
  const ratioY = imgHeight.value / naturalHeight.value
  return points.map(p => `${p.x * ratioX},${p.y * ratioY}`).join(' ')
}
</script>
