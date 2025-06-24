<template>
  <div>
    <h1>Camera {{ camId }} Spots</h1>
    <button class="btn btn-primary mb-3 me-2" @click="showAdd = true">Add Spot</button>
    <router-link
      :to="`/cameras/${camId}/all-spots`"
      class="btn btn-secondary mb-3"
    >All Spots</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Number</th>
          <th>Points</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="spot in spots" :key="spot.id">
          <td>{{ spot.id }}</td>
          <td>{{ spot.spot_number }}</td>
          <td>{{ formatPoints(spot) }}</td>
          <td>
            <router-link :to="`/spots/${spot.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <button class="btn btn-sm btn-danger" @click.prevent="removeSpot(spot.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <router-link to="/cameras" class="btn btn-secondary mt-3">Back to Cameras</router-link>
    <AddSpotModal v-if="showAdd" :camera-id="camId" @close="showAdd = false" @saved="load"/>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import spotService from '@/services/spotService'
import AddSpotModal from './AddSpotModal.vue'

const route = useRoute()
const camId = +route.params.id

const spots = ref([])
const showAdd = ref(false)

function formatPoints(s) {
  return `${s.p1_x},${s.p1_y} ${s.p2_x},${s.p2_y} ${s.p3_x},${s.p3_y} ${s.p4_x},${s.p4_y}`
}

async function load() {
  const { data } = await spotService.getForCamera(camId)
  spots.value = data
}

async function removeSpot(id) {
  if (confirm('Are you sure?')) {
    await spotService.remove(id)
    load()
  }
}

onMounted(load)
</script>
