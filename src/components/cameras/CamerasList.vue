<template>
  <div>
    <h1>Cameras</h1>
    <router-link to="/cameras/create" class="btn btn-primary mb-3 me-2">Add New Camera</router-link>
    <button class="btn btn-secondary mb-3" @click="exportExcel">Export</button>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th><th>Pole ID</th><th>Portal ID</th><th>API Code</th><th>IP</th><th># Spots</th><th>VPN IP</th><th>Status</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cam in cameras" :key="cam.id" :class="rowClass(cam)">
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
            <router-link :to="`/cameras/${cam.id}/edit`" class="btn btn-sm btn-secondary me-1">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click.prevent="deleteCamera(cam.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import cameraService from '@/services/cameraService'
import * as XLSX from 'xlsx'

const cameras = ref([])

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

onMounted(load)
</script>
