<template>
  <div v-if="review">
    <h1>Manual Review #{{ review.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Status: {{ review.status || review.review_status }}</li>
      <li class="list-group-item">Detected Plate: {{ review.plate_number || review.plate || review.plate_status }}</li>
    </ul>

    <div v-if="plateImage" class="mb-3">
      <h3>Plate Image</h3>
      <img :src="plateImage" class="img-fluid" />
    </div>

    <div v-if="snapshots.length" class="mb-3">
      <h3>Snapshots</h3>
      <div>
        <img v-for="snap in snapshots" :key="snap" :src="snap" class="img-thumbnail me-2 mb-2" />
      </div>
    </div>

    <div v-if="video" class="mb-3">
      <h3>Video</h3>
      <video :src="video" controls class="w-100" />
    </div>

    <div class="mb-3">
      <h3>Correct Plate</h3>
      <input v-model="correction.plate_number" class="form-control mb-2" placeholder="Plate number" />
      <input v-model="correction.plate_code" class="form-control mb-2" placeholder="Plate code" />
      <input v-model="correction.plate_city" class="form-control mb-2" placeholder="Plate city" />
      <button class="btn btn-primary me-2" @click="submitCorrection">Submit</button>
      <button class="btn btn-danger" @click="dismiss">Dismiss</button>
    </div>

    <router-link to="/manual-reviews" class="btn btn-secondary">Back</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import manualReviewService from '@/services/manualReviewService'

const route = useRoute()
const router = useRouter()

const review = ref(null)
const plateImage = ref('')
const video = ref('')
const snapshots = ref([])

const correction = ref({
  plate_number: '',
  plate_code: '',
  plate_city: '',
})

onMounted(async () => {
  const { data } = await manualReviewService.get(route.params.id)
  review.value = data

  try {
    const imgRes = await manualReviewService.getImage(route.params.id)
    plateImage.value = URL.createObjectURL(imgRes.data)
  } catch (_) {}

  try {
    const vidRes = await manualReviewService.getVideo(route.params.id)
    video.value = URL.createObjectURL(vidRes.data)
  } catch (_) {}

  try {
    const { data: snaps } = await manualReviewService.listSnapshots(route.params.id)
    snapshots.value = await Promise.all(
      (snaps || []).map(async name => {
        const { data } = await manualReviewService.getSnapshot(route.params.id, name)
        return URL.createObjectURL(data)
      })
    )
  } catch (_) {}
})

async function submitCorrection() {
  await manualReviewService.correct(route.params.id, correction.value)
  router.push('/manual-reviews')
}

async function dismiss() {
  if (confirm('Dismiss this review?')) {
    await manualReviewService.dismiss(route.params.id)
    router.push('/manual-reviews')
  }
}
</script>
