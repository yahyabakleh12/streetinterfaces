<template>
  <div>
    <h1>Manual Reviews</h1>
    <div class="row mb-3">
      <div class="col-md-3">
        <select v-model="status" @change="fetchReviews" class="form-select">
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="CORRECTED">Corrected</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>
    </div>
    <div class="position-relative">
      <LoadingOverlay v-if="loading" />
    <table class="table table-striped" :class="{ 'opacity-50': loading }">
      <thead>
        <tr>
          <th @click="sortBy('id')" style="cursor:pointer">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('camera_id')" style="cursor:pointer">Camera ID <span v-if="sortKey === 'camera_id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('spot_number')" style="cursor:pointer">spot_number <span v-if="sortKey === 'spot_number'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('event_time')" style="cursor:pointer">event_time <span v-if="sortKey === 'event_time'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Plate</th>
          <th @click="sortBy('plate_status')" style="cursor:pointer">Status <span v-if="sortKey === 'plate_status'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rev in sortedReviews" :key="rev.id">
          <td>{{ rev.id }}</td>
          <td>{{ rev.camera_id }}</td>
          <td>{{ rev.spot_number }}</td>
          <td>{{ rev.event_time }}</td>
          <td>
            <img
              v-if="images[rev.id]"
              :src="images[rev.id]"
              class="img-thumbnail"
              style="max-width: 80px; cursor: pointer"
              @click="openImage(images[rev.id])"
            />
          </td>
          <!-- Support `review_status` for backward compatibility. -->
          <td>{{ rev.plate_status || rev.review_status }}</td>
          <td>
            <router-link
              :to="`/manual-reviews/${rev.id}`"
              class="btn btn-sm btn-secondary me-1"
              >View</router-link
            >
            <button
              class="btn btn-sm btn-danger"
              @click.prevent="dismiss(rev.id)"
            >
              Dismiss
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    <nav>
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: page === 1 }">
          <button class="page-link" @click="prevPage">Previous</button>
        </li>
        <li class="page-item" :class="{ disabled: page * pageSize >= total }">
          <button class="page-link" @click="nextPage">Next</button>
        </li>
      </ul>
    </nav>
    <ImageModal v-if="selectedImage" :image="selectedImage" @close="selectedImage = ''" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import LoadingOverlay from '../LoadingOverlay.vue'
import manualReviewService from '@/services/manualReviewService'
import useSortable from '@/composables/useSortable'
import ImageModal from './ImageModal.vue'

const reviews = ref([])
const { sortKey, sortAsc, sortedItems: sortedReviews, sortBy } = useSortable(reviews, 'id')
const page = ref(1)
const pageSize = ref(50)
const total = ref(0)
const status = ref('PENDING')
const images = ref({})
const selectedImage = ref('')
const loading = ref(false)

async function fetchReviews() {
  loading.value = true
  const { data } = await manualReviewService.getAll({
    status: status.value || undefined,
    page: page.value,
    page_size: pageSize.value,
  })
  reviews.value = data.data ?? data.items ?? data
  total.value = data.total ?? reviews.value.length
  await loadImages()
  loading.value = false
}

async function loadImages() {
  images.value = {}
  await Promise.all(
    reviews.value.map(async rev => {
      try {
        const { data } = await manualReviewService.getImage(rev.id)
        images.value[rev.id] = URL.createObjectURL(data)
      } catch (_) {}
    })
  )
}

async function dismiss(id) {
  if (confirm('Dismiss this review?')) {
    await manualReviewService.dismiss(id)
    fetchReviews()
  }
}

function openImage(img) {
  selectedImage.value = img
}

function nextPage() {
  if (page.value * pageSize.value < total.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

watch([page, pageSize], fetchReviews)
watch(status, () => { page.value = 1; fetchReviews() })

onMounted(fetchReviews)
</script>
