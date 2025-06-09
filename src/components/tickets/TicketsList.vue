<template>
  <div>
    <h1>Tickets</h1>
    <router-link to="/tickets/create">
      <button>Add New Ticket</button>
    </router-link>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Plate Number</th>
          <th>Plate Code</th>
          <th>Entry Time</th>
          <th>Exit Time</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in tickets" :key="ticket.id">
          <td>{{ ticket.id }}</td>
          <td>{{ ticket.plate_number }}</td>
          <td>{{ ticket.plate_code }}</td>
          <td>{{ ticket.entry_time }}</td>
          <td>{{ ticket.exit_time }}</td>
          <td>
            <router-link :to="`/tickets/${ticket.id}`">View</router-link> |
            <router-link :to="`/tickets/${ticket.id}/edit`">Edit</router-link> |
            <a href="#" @click.prevent="deleteTicket(ticket.id)">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ticketService from '@/services/ticketService'

const tickets = ref([])

async function load() {
  const { data } = await ticketService.getAll()
  tickets.value = data
}

async function deleteTicket(id) {
  if (confirm('Are you sure?')) {
    await ticketService.remove(id)
    load()
  }
}

onMounted(load)
</script>
