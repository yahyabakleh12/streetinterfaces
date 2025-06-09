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
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Plate</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="rev in reviews" :key="rev.id">
          <td>{{ rev.id }}</td>
          <td>{{ rev.plate_number || rev.plate }}</td>
          <td>{{ rev.status }}</td>
          <td>
            <router-link :to="`/manual-reviews/${rev.id}`" class="btn btn-sm btn-secondary">View</router-link>
          </td>
        </tr>
      </tbody>
    </table>
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import manualReviewService from '@/services/manualReviewService'

const reviews = ref([])
const page = ref(1)
const pageSize = ref(50)
const total = ref(0)
const status = ref('PENDING')

async function fetchReviews() {
  const { data } = await manualReviewService.getAll({
    status: status.value || undefined,
    page: page.value,
    page_size: pageSize.value,
  })
  reviews.value = data.data ?? data.items ?? data
  total.value = data.total ?? reviews.value.length
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
