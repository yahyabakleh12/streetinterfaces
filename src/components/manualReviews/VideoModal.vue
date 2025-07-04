<template>
  <div class="modal show d-block" tabindex="-1" @click.self="close">
    <div class="modal-dialog modal-xl modal-dialog-centered">
      <div class="modal-content bg-transparent border-0">
        <div class="modal-body p-0 position-relative">
          <button type="button" class="btn-close position-absolute top-0 end-0 m-3" @click="close"></button>
          <div class="d-flex justify-content-center align-items-center" style="overflow:auto; max-height: 90vh;">
            <video :src="video" controls autoplay class="w-100" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  video: String,
})
const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>
