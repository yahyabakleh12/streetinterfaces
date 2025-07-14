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
    <div class="position-relative">
      <LoadingOverlay v-if="loading" />
    <table class="table table-striped" :class="{ 'opacity-50': loading }">
      <thead>
        <tr>
          <th @click="sortBy('id')" style="cursor:pointer">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('plate_number')" style="cursor:pointer">Plate Number <span v-if="sortKey === 'plate_number'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('plate_code')" style="cursor:pointer">Plate Code <span v-if="sortKey === 'plate_code'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('plate_city')" style="cursor:pointer">Plate City <span v-if="sortKey === 'plate_city'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Entry Image</th>
          <th @click="sortBy('camera_id')" style="cursor:pointer">Camera ID <span v-if="sortKey === 'camera_id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('spot_number')" style="cursor:pointer">Spot Number <span v-if="sortKey === 'spot_number'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('entry_time')" style="cursor:pointer">Entry Time <span v-if="sortKey === 'entry_time'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('exit_time')" style="cursor:pointer">Exit Time <span v-if="sortKey === 'exit_time'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Duration</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in sortedTickets" :key="ticket.id">
          <td>{{ ticket.id }}</td>
          <td>{{ ticket.plate_number }}</td>
          <td>{{ ticket.plate_code }}</td>
          <td>{{ ticket.plate_city }}</td>
          <td>
            <img
              v-if="images[ticket.id]"
              :src="images[ticket.id]"
              class="img-thumbnail"
              style="max-width: 80px; cursor: pointer"
              @click="openImage(images[ticket.id])"
            />
          </td>
          <td>{{ ticket.camera_id }}</td>
          <td>{{ ticket.spot_number }}</td>
          <td>{{ ticket.entry_time }}</td>
          <td>{{ ticket.exit_time }}</td>
          <td>{{ calcDuration(ticket.entry_time, ticket.exit_time) }}</td>
          <td>
            <router-link :to="`/tickets/${ticket.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link
              v-if="auth.isAdmin"
              :to="`/tickets/${ticket.id}/edit`"
              class="btn btn-sm btn-secondary me-1"
            >Edit</router-link>
            <button
              v-if="auth.isAdmin"
              class="btn btn-sm btn-danger"
              @click.prevent="deleteTicket(ticket.id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
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
    <ImageModal
      v-if="selectedImage"
      :image="selectedImage"
      @close="selectedImage = ''"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import ticketService from '@/services/ticketService'
import useSortable from '@/composables/useSortable'
import { useAuthStore } from '@/stores/auth'
import ImageModal from '@/components/manualReviews/ImageModal.vue'
import LoadingOverlay from '../LoadingOverlay.vue'

const tickets = ref([])
const { sortKey, sortAsc, sortedItems: sortedTickets, sortBy } = useSortable(tickets, 'id')
const auth = useAuthStore()
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
const selectedImage = ref('')
const images = ref({})
const loading = ref(false)

async function fetchTickets() {
  loading.value = true
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
  tickets.value = data.data ?? data.items ?? data
  total.value = data.total ?? tickets.value.length
  await loadImages()
  loading.value = false
}

async function loadImages() {
  images.value = {}
  await Promise.all(
    tickets.value.map(async t => {
      try {
        const { data } = await ticketService.getImage(t.id)
        images.value[t.id] = URL.createObjectURL(data)
      } catch (_) {}
    })
  )
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

function openImage(imgUrl) {
  selectedImage.value = imgUrl
}

function calcDuration(entry, exit) {
  if (!entry || !exit) return ''
  const start = new Date(entry)
  const end = new Date(exit)
  if (isNaN(start) || isNaN(end)) return ''
  let seconds = Math.floor((end - start) / 1000)
  if (seconds < 0) seconds = 0
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
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
