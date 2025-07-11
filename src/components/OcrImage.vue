<template>
  <div>
    <h1>Image OCR</h1>
    <form @submit.prevent="submit" class="mb-3">
      <input type="file" @change="onFileChange" class="form-control mb-2" accept="image/*" />
      <button class="btn btn-primary" :disabled="!file">Upload</button>
    </form>
    <div v-if="loading" class="position-relative" style="height: 80px;">
      <LoadingOverlay />
    </div>
    <div v-if="error" class="alert alert-danger mt-2">{{ error }}</div>
    <div v-if="result" class="mt-3">
      <h5>Result</h5>
      <pre>{{ result }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ocrService from '@/services/ocrService'
import LoadingOverlay from './LoadingOverlay.vue'

const file = ref(null)
const result = ref(null)
const error = ref('')
const loading = ref(false)

function onFileChange(e) {
  file.value = e.target.files[0]
}

async function submit() {
  if (!file.value) return
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const { data } = await ocrService.ocrImage(file.value)
    result.value = JSON.stringify(data, null, 2)
  } catch (_) {
    error.value = 'Failed to perform OCR'
  } finally {
    loading.value = false
  }
}
</script>

