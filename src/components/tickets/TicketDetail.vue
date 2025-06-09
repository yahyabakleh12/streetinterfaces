<template>
  <div v-if="ticket">
    <h1>Ticket #{{ ticket.id }}</h1>
    <ul>
      <li>Plate: {{ ticket.plate }}</li>
      <li>Status: {{ ticket.status }}</li>
      <li>Amount: {{ ticket.amount }}</li>
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
