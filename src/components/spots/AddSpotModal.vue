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
          <div v-if="!imageUrl && !error">Loading frame...</div>
          <div v-else-if="imageUrl" style="position: relative; display: inline-block;" @click="recordPoint">
            <img :src="imageUrl" ref="img" class="img-fluid" />
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
import { ref, onMounted, nextTick, computed } from 'vue'
import cameraService from '@/services/cameraService'
import spotService from '@/services/spotService'

const props = defineProps({ cameraId: Number })
const emit = defineEmits(['close', 'saved'])

const imageUrl = ref('')
const points = ref([])
const img = ref(null)
const imgWidth = ref(0)
const imgHeight = ref(0)
const spotNumber = ref(null)

const error = ref('')

onMounted(loadFrame)


async function loadFrame() {
  try {
    error.value = ''
    const { data } = await cameraService.getFrame(props.cameraId)
    imageUrl.value = URL.createObjectURL(data)
    await nextTick()
    imgWidth.value = img.value.naturalWidth
    imgHeight.value = img.value.naturalHeight
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load frame.'
  }
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
  const xs = points.value.map(p => p.x)
  const ys = points.value.map(p => p.y)
  const payload = {
    camera_id: props.cameraId,
    spot_number: spotNumber.value,
    bbox_x1: Math.min(...xs),
    bbox_y1: Math.min(...ys),
    bbox_x2: Math.max(...xs),
    bbox_y2: Math.max(...ys),
  }
  await spotService.create(payload)
  emit('saved')
  emit('close')
}

const polygonPoints = computed(() => points.value.map(p => `${p.x},${p.y}`).join(' '))
</script>
