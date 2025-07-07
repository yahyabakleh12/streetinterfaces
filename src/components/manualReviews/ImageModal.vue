<template>
  <div class="modal show d-block" tabindex="-1" @click.self="close">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content bg-transparent border-0">
        <div class="modal-body p-0 position-relative">
          <button type="button" class="btn-close position-absolute top-0 end-0 m-3" @click="close"></button>
          <div class="d-flex justify-content-center align-items-center position-relative" style="overflow:auto; max-height: 90vh;">
            <LoadingOverlay v-if="loading" />
            <img :src="image" :style="imgStyle" @load="loading = false" />
          </div>
        </div>
        <div class="modal-footer justify-content-center">
          <button class="btn btn-secondary me-2" @click="zoomOut">-</button>
          <button class="btn btn-secondary" @click="zoomIn">+</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LoadingOverlay from '../LoadingOverlay.vue'

const props = defineProps({
  image: String
})
const emit = defineEmits(['close'])

const zoom = ref(1)
const loading = ref(true)

const imgStyle = computed(() => ({
  transform: `scale(${zoom.value})`,
  transition: 'transform 0.2s',
  'transform-origin': 'center center',
  'max-width': '100%',
  'max-height': '90vh'
}))

function zoomIn() {
  if (zoom.value < 5) zoom.value += 0.25
}

function zoomOut() {
  if (zoom.value > 1) zoom.value -= 0.25
}

function close() {
  zoom.value = 1
  loading.value = true
  emit('close')
}
</script>
