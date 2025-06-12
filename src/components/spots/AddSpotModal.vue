<template>
  <div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Add Spot</h5>
          <button type="button" class="btn-close" @click="emit('close')"></button>
        </div>
        <div class="modal-body text-center">
          <div v-if="!imageUrl">Loading frame...</div>
          <div v-else style="position: relative; display: inline-block;" @click="recordPoint">
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
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="reset">Reset</button>
          <button class="btn btn-primary" :disabled="points.length !== 4" @click="save">Save</button>
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

onMounted(async () => {
  const { data } = await cameraService.getFrame(props.cameraId)
  imageUrl.value = URL.createObjectURL(data)
  await nextTick()
  imgWidth.value = img.value.naturalWidth
  imgHeight.value = img.value.naturalHeight
})

function recordPoint(e) {
  if (points.value.length >= 4) return
  const rect = img.value.getBoundingClientRect()
  points.value.push({ x: e.clientX - rect.left, y: e.clientY - rect.top })
}

function reset() {
  points.value = []
}

async function save() {
  const xs = points.value.map(p => p.x)
  const ys = points.value.map(p => p.y)
  const payload = {
    camera_id: props.cameraId,
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
