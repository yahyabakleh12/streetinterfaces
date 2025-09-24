<template>
  <div class="add-spots-page">
    <header class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
      <div>
        <h1 class="h3 mb-1">Add Spots for Camera {{ cameraTitle }}</h1>
        <p class="text-muted mb-0">Click on the frame to drop four points for each parking spot.</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary" type="button" @click="cancel" :disabled="saving">Cancel</button>
        <button
          class="btn btn-success"
          type="button"
          :disabled="pendingSpots.length === 0 || saving"
          @click="saveAll"
        >
          <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
          Save All Spots
        </button>
      </div>
    </header>

    <div v-if="error" class="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
      <span>{{ error }}</span>
      <button class="btn btn-sm btn-light" type="button" @click="loadData">Retry</button>
    </div>
    <div v-if="saveError" class="alert alert-danger" role="alert">{{ saveError }}</div>

    <div class="flex-grow-1 d-flex flex-column flex-lg-row gap-4">
      <div class="flex-grow-1">
        <div
          v-if="imageUrl || loading"
          class="image-wrapper"
          @click="recordPoint"
        >
          <LoadingOverlay v-if="loading" />
          <img
            v-if="imageUrl"
            :src="imageUrl"
            ref="img"
            class="frame-image"
            alt="Camera frame"
            @load="onImgLoad"
          />
          <svg
            v-if="imgWidth && imgHeight"
            :width="imgWidth"
            :height="imgHeight"
            class="overlay"
          >
            <polygon
              v-for="spot in existingSpots"
              :key="spot.id"
              :points="polygonForExisting(spot)"
              fill="rgba(13, 110, 253, 0.15)"
              stroke="#0d6efd"
              stroke-width="1.5"
              stroke-dasharray="6 4"
            />
            <text
              v-for="spot in existingSpots"
              :key="`label-${spot.id}`"
              :x="labelForExisting(spot).x"
              :y="labelForExisting(spot).y"
              class="overlay-label text-primary"
            >
              {{ spot.spot_number || spot.id }}
            </text>
            <polygon
              v-for="(pending, index) in pendingSpots"
              :key="pending.id"
              :points="polygonForPending(pending)"
              fill="rgba(25, 135, 84, 0.3)"
              stroke="#198754"
              stroke-width="2"
            />
            <text
              v-for="(pending, index) in pendingSpots"
              :key="`pending-label-${pending.id}`"
              :x="labelForPending(pending).x"
              :y="labelForPending(pending).y"
              class="overlay-label text-success"
            >
              {{ pending.spot_number }}
            </text>
            <polygon
              v-if="currentPoints.length === 4"
              :points="currentPolygon"
              fill="rgba(255, 193, 7, 0.35)"
              stroke="#ffc107"
              stroke-width="2"
            />
            <circle
              v-for="(point, index) in currentPoints"
              :key="`current-${index}`"
              :cx="point.x"
              :cy="point.y"
              r="5"
              fill="#ffc107"
            />
          </svg>
        </div>
        <div v-else class="placeholder border rounded-3 bg-white d-flex align-items-center justify-content-center">
          <div class="text-center">
            <i class="bi bi-camera-video-off display-5 text-muted"></i>
            <p class="mt-3 mb-0 text-muted">Frame unavailable for this camera.</p>
          </div>
        </div>
        <p class="text-muted small mt-2">Tip: zoom your browser window if you need more precision.</p>
      </div>
      <aside class="controls card shadow-sm flex-shrink-0">
        <div class="card-body">
          <h5 class="card-title">Current Spot</h5>
          <p class="text-muted small">Drop four points in order around the parking spot. Use reset if you make a mistake.</p>

          <div class="d-flex gap-2 mb-3">
            <button class="btn btn-sm btn-outline-secondary flex-fill" type="button" @click="removeLastPoint" :disabled="currentPoints.length === 0">
              Undo point
            </button>
            <button class="btn btn-sm btn-outline-secondary flex-fill" type="button" @click="resetCurrent" :disabled="currentPoints.length === 0 && currentSpotNumber === null">
              Reset spot
            </button>
          </div>

          <div class="mb-3">
            <div class="fw-semibold">Points placed: {{ currentPoints.length }}/4</div>
            <div v-if="currentPoints.length < 4" class="text-muted small">Click {{ 4 - currentPoints.length }} more point(s).</div>
          </div>

          <div v-if="currentPoints.length === 4" class="mb-4">
            <label for="spot-number" class="form-label">Spot number</label>
            <input
              id="spot-number"
              v-model.number="currentSpotNumber"
              type="number"
              min="1"
              class="form-control"
            />
            <button
              class="btn btn-primary w-100 mt-3"
              type="button"
              :disabled="!canAddCurrent"
              @click="addCurrentSpot"
            >
              Add to list
            </button>
          </div>
          <div v-else class="alert alert-info py-2 px-3 small" role="note">
            Click on the image to continue placing the spot corners.
          </div>

          <hr />

          <h5 class="card-title">Pending Spots</h5>
          <p class="text-muted small">These spots will be saved together when you click "Save All Spots".</p>
          <ul class="list-group pending-list">
            <li v-if="pendingSpots.length === 0" class="list-group-item text-muted">No spots added yet.</li>
            <li
              v-for="(pending, index) in pendingSpots"
              :key="pending.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <span class="fw-semibold">Spot {{ pending.spot_number }}</span>
              <button class="btn btn-sm btn-outline-danger" type="button" @click="removePending(index)">
                Remove
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import cameraService from '@/services/cameraService'
import spotService from '@/services/spotService'
import LoadingOverlay from '../LoadingOverlay.vue'

const route = useRoute()
const router = useRouter()
const camId = Number(route.params.id)

const camera = ref(null)
const imageUrl = ref('')
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const saveError = ref('')
const img = ref(null)
const imgWidth = ref(0)
const imgHeight = ref(0)
const naturalWidth = ref(0)
const naturalHeight = ref(0)

const currentPoints = ref([])
const currentSpotNumber = ref(null)
const pendingSpots = ref([])
const existingSpots = ref([])

const cameraTitle = computed(() => {
  if (camera.value?.api_code) return camera.value.api_code
  if (camera.value?.id) return `#${camera.value.id}`
  return `#${camId}`
})

onMounted(loadData)
onBeforeUnmount(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value)
  }
})

async function loadData() {
  try {
    error.value = ''
    loading.value = true
    const [cameraRes, frameRes, spotsRes] = await Promise.allSettled([
      cameraService.get(camId),
      cameraService.getFrame(camId),
      spotService.getForCamera(camId)
    ])

    if (cameraRes.status === 'fulfilled') {
      camera.value = cameraRes.value.data
    }
    if (frameRes.status === 'fulfilled') {
      if (imageUrl.value) {
        URL.revokeObjectURL(imageUrl.value)
      }
      imageUrl.value = URL.createObjectURL(frameRes.value.data)
    } else {
      imageUrl.value = ''
    }
    if (spotsRes.status === 'fulfilled') {
      existingSpots.value = spotsRes.value.data || []
    } else {
      existingSpots.value = []
    }

    if (frameRes.status === 'rejected' || spotsRes.status === 'rejected') {
      error.value = 'Failed to load the latest camera frame or spots. Some information may be missing.'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Failed to load camera information.'
  } finally {
    loading.value = false
  }
}

function onImgLoad(event) {
  const element = event.target
  naturalWidth.value = element.naturalWidth
  naturalHeight.value = element.naturalHeight
  imgWidth.value = element.clientWidth
  imgHeight.value = element.clientHeight
}

function recordPoint(event) {
  if (!img.value || currentPoints.value.length >= 4 || loading.value || saving.value) return
  const rect = img.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) return
  currentPoints.value.push({ x, y })
}

function removeLastPoint() {
  if (currentPoints.value.length > 0) {
    currentPoints.value = currentPoints.value.slice(0, -1)
  }
}

function resetCurrent() {
  currentPoints.value = []
  currentSpotNumber.value = null
}

const canAddCurrent = computed(() => currentPoints.value.length === 4 && Number.isFinite(currentSpotNumber.value) && currentSpotNumber.value > 0)

function addCurrentSpot() {
  if (!canAddCurrent.value || !naturalWidth.value || !naturalHeight.value || !imgWidth.value || !imgHeight.value) return
  const ratioX = naturalWidth.value / imgWidth.value
  const ratioY = naturalHeight.value / imgHeight.value
  const naturalPoints = currentPoints.value.map(point => ({
    x: Math.round(point.x * ratioX),
    y: Math.round(point.y * ratioY)
  }))
  const pending = {
    id: `${currentSpotNumber.value}-${Date.now()}-${pendingSpots.value.length}`,
    spot_number: currentSpotNumber.value,
    points: naturalPoints
  }
  pendingSpots.value = [...pendingSpots.value, pending]
  resetCurrent()
}

function removePending(index) {
  pendingSpots.value = pendingSpots.value.filter((_, idx) => idx !== index)
}

const currentPolygon = computed(() => currentPoints.value.map(point => `${point.x},${point.y}`).join(' '))

function polygonForExisting(spot) {
  if (!imgWidth.value || !naturalWidth.value) return ''
  const ratioX = imgWidth.value / naturalWidth.value
  const ratioY = imgHeight.value / naturalHeight.value
  const points = [
    { x: spot.p1_x, y: spot.p1_y },
    { x: spot.p2_x, y: spot.p2_y },
    { x: spot.p3_x, y: spot.p3_y },
    { x: spot.p4_x, y: spot.p4_y }
  ]
  return points.map(point => `${point.x * ratioX},${point.y * ratioY}`).join(' ')
}

function polygonForPending(pending) {
  if (!imgWidth.value || !naturalWidth.value) return ''
  const ratioX = imgWidth.value / naturalWidth.value
  const ratioY = imgHeight.value / naturalHeight.value
  return pending.points.map(point => `${point.x * ratioX},${point.y * ratioY}`).join(' ')
}

function centroid(points) {
  if (!points.length) return { x: 0, y: 0 }
  const total = points.reduce((acc, point) => ({
    x: acc.x + point.x,
    y: acc.y + point.y
  }), { x: 0, y: 0 })
  return {
    x: total.x / points.length,
    y: total.y / points.length
  }
}

function labelForExisting(spot) {
  if (!imgWidth.value || !naturalWidth.value) return { x: 0, y: 0 }
  const ratioX = imgWidth.value / naturalWidth.value
  const ratioY = imgHeight.value / naturalHeight.value
  const points = [
    { x: spot.p1_x, y: spot.p1_y },
    { x: spot.p2_x, y: spot.p2_y },
    { x: spot.p3_x, y: spot.p3_y },
    { x: spot.p4_x, y: spot.p4_y }
  ]
  const center = centroid(points)
  return { x: center.x * ratioX, y: center.y * ratioY }
}

function labelForPending(pending) {
  if (!imgWidth.value || !naturalWidth.value) return { x: 0, y: 0 }
  const ratioX = imgWidth.value / naturalWidth.value
  const ratioY = imgHeight.value / naturalHeight.value
  const center = centroid(pending.points)
  return { x: center.x * ratioX, y: center.y * ratioY }
}

async function saveAll() {
  if (pendingSpots.value.length === 0 || saving.value) return
  saveError.value = ''
  saving.value = true
  try {
    const requests = pendingSpots.value.map(pending => {
      const [p1, p2, p3, p4] = pending.points
      const payload = {
        camera_id: camId,
        spot_number: pending.spot_number,
        p1_x: p1.x,
        p1_y: p1.y,
        p2_x: p2.x,
        p2_y: p2.y,
        p3_x: p3.x,
        p3_y: p3.y,
        p4_x: p4.x,
        p4_y: p4.y
      }
      return spotService.create(payload)
    })
    await Promise.all(requests)
    router.push(`/cameras/${camId}/spots`)
  } catch (err) {
    console.error(err)
    saveError.value = 'Failed to save spots. Please try again.'
  } finally {
    saving.value = false
  }
}

function cancel() {
  if (pendingSpots.value.length === 0 || confirm('Discard all pending spots?')) {
    router.push(`/cameras/${camId}/spots`)
  }
}
</script>

<style scoped>
.add-spots-page {
  min-height: 100vh;
  padding: 1.5rem;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
}

.image-wrapper {
  position: relative;
  width: 100%;
  display: inline-block;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #000;
  cursor: crosshair;
  min-height: 360px;
}

.frame-image {
  display: block;
  width: 100%;
  height: auto;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.overlay-label {
  font-weight: 600;
  font-size: 0.95rem;
  paint-order: stroke;
  stroke: rgba(255, 255, 255, 0.8);
  stroke-width: 2px;
}

.placeholder {
  min-height: 420px;
}

.controls {
  width: 320px;
}

.pending-list {
  max-height: 260px;
  overflow-y: auto;
}

@media (max-width: 991px) {
  .controls {
    width: 100%;
  }
}
</style>
