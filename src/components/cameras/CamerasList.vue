<template>
  <div>
    <h1>Cameras</h1>
    <router-link to="/cameras/create" class="btn btn-primary mb-3 me-2">Add New Camera</router-link>
    <button class="btn btn-secondary mb-3" @click="exportExcel">Export</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th @click="sortBy('id')" style="cursor:pointer">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('pole_id')" style="cursor:pointer">Pole ID <span v-if="sortKey === 'pole_id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('portal_id')" style="cursor:pointer">Portal ID <span v-if="sortKey === 'portal_id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('api_code')" style="cursor:pointer">API Code <span v-if="sortKey === 'api_code'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('p_ip')" style="cursor:pointer">IP <span v-if="sortKey === 'p_ip'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('number_of_parking')" style="cursor:pointer"># Spots <span v-if="sortKey === 'number_of_parking'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('vpn_ip')" style="cursor:pointer">VPN IP <span v-if="sortKey === 'vpn_ip'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('status')" style="cursor:pointer">Status <span v-if="sortKey === 'status'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cam in sortedCameras" :key="cam.id" :class="rowClass(cam)">
          <td>{{ cam.id }}</td>
          <td>{{ cam.pole_id }}</td>
          <td>{{ cam.portal_id }}</td>
          <td>{{ cam.api_code }}</td>
          <td>{{ cam.p_ip }}</td>
          <td>{{ cam.number_of_parking }}</td>
          <td>{{ cam.vpn_ip || '–' }}</td>
          <td>{{ cam.status}}</td>
          <td>
            <router-link :to="`/cameras/${cam.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link :to="`/cameras/${cam.id}/spots`" class="btn btn-sm btn-secondary me-1">Spots</router-link>
            <router-link :to="`/cameras/${cam.id}/all-spots`" class="btn btn-sm btn-secondary me-1">All Spots</router-link>
            <router-link :to="`/cameras/${cam.id}/crop-zones`" class="btn btn-sm btn-secondary me-1">Crop Zone</router-link>
            <router-link
              v-if="auth.isAdmin"
              :to="`/cameras/${cam.id}/edit`"
              class="btn btn-sm btn-secondary me-1"
            >Edit</router-link>
            <button
              v-if="auth.isAdmin"
              class="btn btn-sm btn-danger"
              @click.prevent="deleteCamera(cam.id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import cameraService from '@/services/cameraService'
import * as XLSX from 'xlsx'
import { useAuthStore } from '@/stores/auth'

const cameras = ref([])
const sortKey = ref('id')
const sortAsc = ref(true)
const auth = useAuthStore()

const sortedCameras = computed(() => {
  return [...cameras.value].sort((a, b) => {
    const vA = a[sortKey.value]
    const vB = b[sortKey.value]
    if (vA == null) return 1
    if (vB == null) return -1
    if (typeof vA === 'number' && typeof vB === 'number')
      return sortAsc.value ? vA - vB : vB - vA
    const sA = vA.toString().toLowerCase()
    const sB = vB.toString().toLowerCase()
    if (sA < sB) return sortAsc.value ? -1 : 1
    if (sA > sB) return sortAsc.value ? 1 : -1
    return 0
  })
})

async function load() {
  const { data } = await cameraService.getAll()
  cameras.value = data
}

async function deleteCamera(id) {
  if (confirm('Are you sure?')) {
    await cameraService.remove(id)
    load()
  }
}

function rowClass(cam) {
  const status = (cam.status || '').toString().toLowerCase()
  if (status === 'online') return 'table-success'
  if (status === 'offline') return 'table-danger'
  return ''
}

function exportExcel() {
  const rows = cameras.value.map(cam => ({
    ID: cam.id,
    'Pole ID': cam.pole_id,
    'Portal ID': cam.portal_id,
    'API Code': cam.api_code,
    IP: cam.p_ip,
    'Number of Spots': cam.number_of_parking,
    'VPN IP': cam.vpn_ip || '',
    'Status': cam.status 
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Cameras')
  XLSX.writeFile(wb, 'cameras.xlsx')
}

function sortBy(key) {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

onMounted(load)
</script>
