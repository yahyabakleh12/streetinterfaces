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
    <div v-if="rawResult" class="mt-3">
      <h5>Result</h5>
      <table class="table table-striped mb-3" v-if="parsedResult">
        <thead>
          <tr>
            <th>Text</th>
            <th>City</th>
            <th>Category</th>
            <th>Confidence</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="Array.isArray(parsedResult)">
            <tr v-for="(item, idx) in parsedResult" :key="idx">
              <td>{{ item.text }}</td>
              <td>{{ item.cityName }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.confidence }}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td>{{ parsedResult.text }}</td>
              <td>{{ parsedResult.cityName }}</td>
              <td>{{ parsedResult.category }}</td>
              <td>{{ parsedResult.confidence }}</td>
            </tr>
          </template>
        </tbody>
      </table>
      <pre>{{ rawResult }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ocrService from '@/services/ocrService'
import LoadingOverlay from './LoadingOverlay.vue'

const file = ref(null)
const rawResult = ref(null)
const parsedResult = ref(null)
const error = ref('')
const loading = ref(false)

function onFileChange(e) {
  file.value = e.target.files[0]
}

async function submit() {
  if (!file.value) return
  loading.value = true
  error.value = ''
  rawResult.value = null
  parsedResult.value = null
  try {
    const { data } = await ocrService.ocrImage(file.value)
    parsedResult.value = data
    rawResult.value = JSON.stringify(data, null, 2)
  } catch (_) {
    error.value = 'Failed to perform OCR'
  } finally {
    loading.value = false
  }
}
</script>

