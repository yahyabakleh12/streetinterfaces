<template>
  <div class="modal show d-block" tabindex="-1" @click.self="close">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content bg-transparent border-0">
        <div class="modal-body p-0 position-relative">
          <button type="button" class="btn-close position-absolute top-0 end-0 m-3" @click="close"></button>
          <div class="d-flex justify-content-center align-items-center position-relative" style="overflow:auto; max-height: 90vh;">
            <LoadingOverlay v-if="loading" />
            <video :src="video" controls autoplay class="w-100" @loadeddata="loading = false" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoadingOverlay from '../LoadingOverlay.vue'

const props = defineProps({
  video: String,
})
const emit = defineEmits(['close'])

const loading = ref(true)

function close() {
  emit('close')
}
</script>
