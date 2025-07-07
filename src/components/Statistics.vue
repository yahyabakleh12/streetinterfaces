<template>
  <div>
    <h1>Statistics</h1>
    <div class="row">
      <div class="col-md-6 mb-4">
        <div class="chart-container">
          <canvas id="barChart"></canvas>
        </div>
      </div>
      <div class="col-md-6 mb-4">
        <div class="chart-container">
          <canvas id="pieChart"></canvas>
        </div>
      </div>
    </div>
    <h2 class="mt-4">Locations</h2>
    <div class="row">
      <div
        v-for="loc in locations"
        :key="loc.id"
        class="col-md-3 mb-3"
      >
        <div
          class="card h-100"
          style="cursor:pointer"
          @click="goToLocation(loc.id)"
        >
          <div class="card-body text-center">
            <h5 class="card-title">{{ loc.name }}</h5>
            <p class="card-text">{{ loc.code }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import locationService from '@/services/locationService'
import Chart from 'chart.js/auto'

const router = useRouter()
const locations = ref([])

async function loadLocations() {
  const { data } = await locationService.getAll()
  locations.value = data
}

onMounted(() => {
  const barCtx = document.getElementById('barChart')
  new Chart(barCtx, {
    type: 'bar',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [{
        label: 'Tickets',
        data: [12, 19, 3, 5, 2],
        backgroundColor: '#0d6efd'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  })

  const pieCtx = document.getElementById('pieChart')
  new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: ['Paid', 'Unpaid', 'Pending'],
      datasets: [{
        data: [50, 30, 20],
        backgroundColor: ['#198754', '#dc3545', '#ffc107']
      }]
    },
    options: {
      responsive: true,
    maintainAspectRatio: false
    }
  })

  loadLocations()
})

function goToLocation(id) {
  router.push(`/statistics/location/${id}`)
}
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
}
</style>
