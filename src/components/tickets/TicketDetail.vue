<template>
  <div v-if="ticket">
    <h1>Ticket #{{ ticket.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Plate Number: {{ ticket.plate_number }}</li>
      <li class="list-group-item">Plate Code: {{ ticket.plate_code }}</li>
      <li class="list-group-item">Entry Time: {{ ticket.entry_time }}</li>
      <li class="list-group-item">Exit Time: {{ ticket.exit_time }}</li>
    </ul>
    <router-link to="/tickets" class="btn btn-secondary">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ticketService from '@/services/ticketService'

const route = useRoute()
const ticket = ref(null)

onMounted(async () => {
  const { data } = await ticketService.get(route.params.id)
  ticket.value = data
})
</script>
