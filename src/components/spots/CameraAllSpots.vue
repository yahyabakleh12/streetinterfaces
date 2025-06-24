<template>
  <div>
    <h1>Camera {{ camId }} All Spots</h1>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-if="imageUrl" style="position: relative; display: inline-block;">
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
    <div class="mt-3">
      <router-link :to="`/cameras/${camId}/spots`" class="btn btn-secondary">Back to Spots</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import cameraService from '@/services/cameraService'
import spotService from '@/services/spotService'

const route = useRoute()
const camId = +route.params.id

const imageUrl = ref('')
const spots = ref([])
const img = ref(null)
const imgWidth = ref(0)
const imgHeight = ref(0)
const naturalWidth = ref(0)
const naturalHeight = ref(0)
const error = ref('')

onMounted(async () => {
  try {
    const [frameRes, spotsRes] = await Promise.all([
      cameraService.getFrame(camId).catch(() => null),
      spotService.getForCamera(camId)
    ])
    if (frameRes) {
      imageUrl.value = URL.createObjectURL(frameRes.data)
    }
    spots.value = spotsRes.data
  } catch (_) {
    error.value = 'Failed to load spots.'
  }
})

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
</script>
