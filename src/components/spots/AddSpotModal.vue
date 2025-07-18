<template>
  <div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Spot</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body text-center">
          <div v-if="error" class="text-danger mb-2">
            {{ error }}
            <button class="btn btn-link" @click="loadFrame">Retry</button>
          </div>
          <div v-if="!imageUrl && !loading && !error">Loading frame...</div>
          <div v-if="imageUrl || loading" style="position: relative; display: inline-block;" @click="recordPoint">
            <LoadingOverlay v-if="loading" />
            <img
              v-if="imageUrl"
              :src="imageUrl"
              ref="img"
              class="img-fluid"
              @load="onImgLoad"
            />
          <svg
            v-if="imgWidth && imgHeight"
            :width="imgWidth"
              :height="imgHeight"
              class="position-absolute top-0 start-0"
              style="pointer-events: none;"
            >
              <circle v-for="(p, i) in points" :key="i" :cx="p.x" :cy="p.y" r="4" fill="red" />
              <polygon
                v-if="points.length === 4"
                :points="polygonPoints"
                fill="rgba(255,0,0,0.3)"
              />
            </svg>
          </div>
          <div class="mt-3 text-start">
            <label class="form-label">Spot Number</label>
            <input v-model.number="spotNumber" type="number" class="form-control" />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="reset">Reset</button>

          <button class="btn btn-primary" :disabled="points.length !== 4 || !spotNumber || !!error" @click="save">Save</button>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import cameraService from '@/services/cameraService'
import spotService from '@/services/spotService'
import LoadingOverlay from '../LoadingOverlay.vue'

const props = defineProps({ cameraId: Number })
const emit = defineEmits(['close', 'saved'])

const imageUrl = ref('')
const loading = ref(false)
const points = ref([])
const img = ref(null)
// dimensions used for rendering the SVG overlay
const imgWidth = ref(0)
const imgHeight = ref(0)
// natural dimensions of the image for converting points
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const spotNumber = ref(null)

const error = ref('')

onMounted(loadFrame)


async function loadFrame() {
  try {
    error.value = ''
    loading.value = true
    const { data } = await cameraService.getFrame(props.cameraId)
    imageUrl.value = URL.createObjectURL(data)
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load frame.'
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
  if (points.value.length >= 4) return
  const rect = img.value.getBoundingClientRect()
  points.value.push({ x: e.clientX - rect.left, y: e.clientY - rect.top })
}

function reset() {
  points.value = []
  spotNumber.value = null
}

async function save() {
  const ratioX = naturalWidth.value / imgWidth.value
  const ratioY = naturalHeight.value / imgHeight.value
  // convert recorded points from displayed to natural coordinates
  const naturalPoints = points.value.map(p => ({
    x: p.x * ratioX,
    y: p.y * ratioY,
  }))
  const rounded = naturalPoints.map(p => ({
    x: Math.round(p.x),
    y: Math.round(p.y)
  }))
  const [p1, p2, p3, p4] = rounded
  const payload = {
    camera_id: props.cameraId,
    spot_number: spotNumber.value,
    p1_x: p1.x,
    p1_y: p1.y,
    p2_x: p2.x,
    p2_y: p2.y,
    p3_x: p3.x,
    p3_y: p3.y,
    p4_x: p4.x,
    p4_y: p4.y,
  }
  await spotService.create(payload)
  emit('saved')
  emit('close')
}

const polygonPoints = computed(() => points.value.map(p => `${p.x},${p.y}`).join(' '))
</script>
