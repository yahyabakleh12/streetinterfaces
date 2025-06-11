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
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Chart from 'chart.js/auto'

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
})
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
}
</style>
