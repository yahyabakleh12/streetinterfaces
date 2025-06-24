<template>
  <div v-if="spot">
    <h1>Spot #{{ spot.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Spot Number: {{ spot.spot_number }}</li>
      <li class="list-group-item">Camera ID: {{ spot.camera_id }}</li>
    </ul>
    <div v-if="imageUrl" style="position: relative; display: inline-block;">
      <img :src="imageUrl" ref="img" class="img-fluid" @load="onImgLoad" />
      <svg
        v-if="imgWidth && imgHeight && polygon"
        :width="imgWidth"
        :height="imgHeight"
        class="position-absolute top-0 start-0"
        style="pointer-events: none;"
      >
        <polygon
          :points="polygon"
          fill="rgba(255,0,0,0.3)"
          stroke="red"
          stroke-width="2"
        />
      </svg>
    </div>
    <div class="mt-3">
      <router-link :to="`/cameras/${spot.camera_id}/spots`" class="btn btn-secondary">Back to spots</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import spotService from '@/services/spotService'
import cameraService from '@/services/cameraService'

const route = useRoute()
const spot = ref(null)
const imageUrl = ref('')
const img = ref(null)
const imgWidth = ref(0)
const imgHeight = ref(0)
const naturalWidth = ref(0)
const naturalHeight = ref(0)

onMounted(async () => {
  const { data } = await spotService.get(route.params.id)
  spot.value = data
  try {
    const frameRes = await cameraService.getFrame(data.camera_id)
    imageUrl.value = URL.createObjectURL(frameRes.data)
  } catch (_) {}
})

function onImgLoad(e) {
  const el = e.target
  naturalWidth.value = el.naturalWidth
  naturalHeight.value = el.naturalHeight
  imgWidth.value = el.clientWidth
  imgHeight.value = el.clientHeight
}

const polygon = computed(() => {
  if (!spot.value || !imgWidth.value) return ''
  const ratioX = imgWidth.value / naturalWidth.value
  const ratioY = imgHeight.value / naturalHeight.value
  const pts = [
    { x: spot.value.p1_x, y: spot.value.p1_y },
    { x: spot.value.p2_x, y: spot.value.p2_y },
    { x: spot.value.p3_x, y: spot.value.p3_y },
    { x: spot.value.p4_x, y: spot.value.p4_y }
  ]
  return pts.map(p => `${p.x * ratioX},${p.y * ratioY}`).join(' ')
})
</script>
