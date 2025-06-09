<template>
  <div>
    <h1>Manual Transactions</h1>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Camera</th>
          <th>Spot #</th>
          <th>Event Time</th>
          <th>Plate Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="tx in transactions" :key="tx.id">
          <td>{{ tx.id }}</td>
          <td>{{ tx.camera_id }}</td>
          <td>{{ tx.spot_number }}</td>
          <td>{{ tx.event_time }}</td>
          <td>{{ tx.plate_status }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import manualTransactionService from '@/services/manualTransactionService'

const transactions = ref([])

async function fetchTransactions() {
  const { data } = await manualTransactionService.getAll()
  transactions.value = data.data ?? data.items ?? data
}

onMounted(fetchTransactions)
</script>
