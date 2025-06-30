<template>
  <div>
    <h1>Camera {{ camera ? camera.api_code : camId }} Spots</h1>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="imageUrl" style="position: relative; display: inline-block;" class="mb-3">
      <img :src="imageUrl" ref="img" class="img-fluid" @load="onImgLoad" />
      <svg
        v-if="imgWidth && imgHeight"
        :width="imgWidth"
        :height="imgHeight"
        class="position-absolute top-0 start-0"
        style="pointer-events: none;">
        <polygon
          v-for="spot in spots"
          :key="spot.id"
          :points="polygonFor(spot)"
          fill="rgba(255,0,0,0.3)"
          stroke="red"
          stroke-width="2" />
      </svg>
    </div>
    <button class="btn btn-primary mb-3 me-2" @click="showAdd = true">Add Spot</button>
    <router-link
      :to="`/cameras/${camId}/all-spots`"
      class="btn btn-secondary mb-3"
    >All Spots</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th @click="sortBy('id')" style="cursor:pointer">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('spot_number')" style="cursor:pointer">Number <span v-if="sortKey === 'spot_number'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('p1_x')" style="cursor:pointer">Points <span v-if="sortKey === 'p1_x'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="spot in sortedSpots" :key="spot.id">
          <td>{{ spot.id }}</td>
          <td>{{ spot.spot_number }}</td>
          <td>{{ formatPoints(spot) }}</td>
          <td>
            <router-link :to="`/spots/${spot.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <button
              v-if="auth.isAdmin"
              class="btn btn-sm btn-danger"
              @click.prevent="removeSpot(spot.id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <router-link to="/cameras" class="btn btn-secondary mt-3">Back to Cameras</router-link>
    <AddSpotModal v-if="showAdd" :camera-id="camId" @close="showAdd = false" @saved="load"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import useSortable from '@/composables/useSortable'
import { useRoute } from 'vue-router'
import spotService from '@/services/spotService'
import cameraService from '@/services/cameraService'
import { useAuthStore } from '@/stores/auth'
import AddSpotModal from './AddSpotModal.vue'

const route = useRoute()
const camId = +route.params.id

const spots = ref([])
const { sortKey, sortAsc, sortedItems: sortedSpots, sortBy } = useSortable(spots, 'id')
const auth = useAuthStore()
const showAdd = ref(false)
const camera = ref(null)
const imageUrl = ref('')
const img = ref(null)
const imgWidth = ref(0)
const imgHeight = ref(0)
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const error = ref('')

function formatPoints(s) {
  return `${s.p1_x},${s.p1_y} ${s.p2_x},${s.p2_y} ${s.p3_x},${s.p3_y} ${s.p4_x},${s.p4_y}`
}

async function load() {
  try {
    error.value = ''
    const [cameraRes, frameRes, spotsRes] = await Promise.all([
      cameraService.get(camId).catch(() => null),
      cameraService.getFrame(camId).catch(() => null),
      spotService.getForCamera(camId)
    ])
    if (cameraRes) camera.value = cameraRes.data
    if (frameRes) imageUrl.value = URL.createObjectURL(frameRes.data)
    spots.value = spotsRes.data
  } catch (_) {
    error.value = 'Failed to load spots.'
  }
}

async function removeSpot(id) {
  if (confirm('Are you sure?')) {
    await spotService.remove(id)
    load()
  }
}

function onImgLoad(e) {
  const el = e.target
  naturalWidth.value = el.naturalWidth
  naturalHeight.value = el.naturalHeight
  imgWidth.value = el.clientWidth
  imgHeight.value = el.clientHeight
}

function polygonFor(spot) {
  if (!imgWidth.value) return ''
  const ratioX = imgWidth.value / naturalWidth.value
  const ratioY = imgHeight.value / naturalHeight.value
  const pts = [
    { x: spot.p1_x, y: spot.p1_y },
    { x: spot.p2_x, y: spot.p2_y },
    { x: spot.p3_x, y: spot.p3_y },
    { x: spot.p4_x, y: spot.p4_y }
  ]
  return pts.map(p => `${p.x * ratioX},${p.y * ratioY}`).join(' ')
}

onMounted(load)
</script>
