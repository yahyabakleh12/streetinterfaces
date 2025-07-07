<template>
  <div class="loading-overlay d-flex flex-column justify-content-center align-items-center">
    <div class="spinner-border text-primary mb-3" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <div class="progress w-50">
      <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
    </div>
  </div>
</template>

<script setup>
// No props needed; this is a simple overlay
</script>

<style scoped>
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  z-index: 1000;
}
</style>

