<template>
  <div>
    <h1>Tickets</h1>
    <router-link to="/tickets/create" class="btn btn-primary mb-3">Add New Ticket</router-link>
    <div class="row mb-3">
      <div class="col-md-3 mb-2">
        <input
          v-model="search"
          @keyup.enter="fetchTickets"
          type="text"
          placeholder="Search"
          class="form-control"
        />
      </div>
      <div class="col-md-2 mb-2">
        <input
          v-model.number="cameraId"
          type="number"
          placeholder="Camera ID"
          class="form-control"
        />
      </div>
      <div class="col-md-2 mb-2">
        <input
          v-model.number="spotNumber"
          type="number"
          placeholder="Spot #"
          class="form-control"
        />
      </div>
      <div class="col-md-2 mb-2">
        <input
          v-model="plateNumber"
          type="text"
          placeholder="Plate Number"
          class="form-control"
        />
      </div>
      <div class="col-md-1 mb-2">
        <input
          v-model="plateCode"
          type="text"
          placeholder="Code"
          class="form-control"
        />
      </div>
      <div class="col-md-2 mb-2">
        <input
          v-model="plateCity"
          type="text"
          placeholder="Emirate"
          class="form-control"
        />
      </div>
      <div class="col-md-3 mb-2">
        <input
          v-model="entryStart"
          type="datetime-local"
          class="form-control"
        />
      </div>
      <div class="col-md-3 mb-2">
        <input
          v-model="entryEnd"
          type="datetime-local"
          class="form-control"
        />
      </div>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Plate Number</th>
          <th>Plate Code</th>
          <th>Image</th>
          <th>Camera ID</th>
          <th>Spot Number</th>
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
          <td>
            <img v-if="ticket.image_base64"
                 :src="`data:image/jpeg;base64,${ticket.image_base64}`"
                 class="img-thumbnail"
                 style="max-width: 80px" />
          </td>
          <td>{{ ticket.camera_id }}</td>
          <td>{{ ticket.spot_number }}</td>
          <td>{{ ticket.entry_time }}</td>
          <td>{{ ticket.exit_time }}</td>
          <td>
            <router-link :to="`/tickets/${ticket.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link :to="`/tickets/${ticket.id}/edit`" class="btn btn-sm btn-secondary me-1">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click.prevent="deleteTicket(ticket.id)">Delete</button>
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
import { onMounted, ref, watch } from 'vue'
import ticketService from '@/services/ticketService'

const tickets = ref([])
const page = ref(1)
const pageSize = ref(50)
const search = ref('')
const cameraId = ref(null)
const spotNumber = ref(null)
const plateNumber = ref('')
const plateCode = ref('')
const plateCity = ref('')
const entryStart = ref('')
const entryEnd = ref('')
const total = ref(0)

async function fetchTickets() {
  const { data } = await ticketService.getAll({
    page: page.value,
    page_size: pageSize.value,
    search: search.value || undefined,
    camera_id: cameraId.value || undefined,
    spot_number: spotNumber.value || undefined,
    plate_number: plateNumber.value || undefined,
    plate_code: plateCode.value || undefined,
    plate_city: plateCity.value || undefined,
    entry_start: entryStart.value || undefined,
    entry_end: entryEnd.value || undefined,
  })
  // The API may return tickets under `data` or `items`.
  // Normalize to always store just the array of tickets.
  tickets.value = data.data ?? data.items ?? data
  total.value = data.total ?? tickets.value.length
}

function nextPage() {
  if (page.value * pageSize.value < total.value) page.value++
}

function prevPage() {
  if (page.value > 1) page.value--
}

async function deleteTicket(id) {
  if (confirm('Are you sure?')) {
    await ticketService.remove(id)
    fetchTickets()
  }
}

watch([page, pageSize], fetchTickets)
watch(
  [search, cameraId, spotNumber, plateNumber, plateCode, plateCity, entryStart, entryEnd],
  () => {
    page.value = 1
    fetchTickets()
  }
)

onMounted(fetchTickets)
</script>
