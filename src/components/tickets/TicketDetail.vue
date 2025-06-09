<template>
  <div v-if="ticket">
    <h1>Ticket #{{ ticket.id }}</h1>
    <ul>
      <li>Plate Number: {{ ticket.plate_number }}</li>
      <li>Plate Code: {{ ticket.plate_code }}</li>
      <li>Entry Time: {{ ticket.entry_time }}</li>
      <li>Exit Time: {{ ticket.exit_time }}</li>
    </ul>
    <router-link to="/tickets">Back to list</router-link>
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
