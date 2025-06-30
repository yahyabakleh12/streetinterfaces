<template>
  <div>
    <h1>Zones</h1>
    <router-link to="/zones/create" class="btn btn-primary mb-3">Add New Zone</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th @click="sortBy('id')" style="cursor:pointer">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('code')" style="cursor:pointer">Code <span v-if="sortKey === 'code'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('location_id')" style="cursor:pointer">Location <span v-if="sortKey === 'location_id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="zone in sortedZones" :key="zone.id">
          <td>{{ zone.id }}</td>
          <td>{{ zone.code }}</td>
          <td>{{ zone.location_id }}</td>
          <td>
            <router-link :to="`/zones/${zone.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link
              v-if="auth.isAdmin"
              :to="`/zones/${zone.id}/edit`"
              class="btn btn-sm btn-secondary me-1"
            >Edit</router-link>
            <button
              v-if="auth.isAdmin"
              class="btn btn-sm btn-danger"
              @click.prevent="deleteZone(zone.id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import zoneService from '@/services/zoneService'
import useSortable from '@/composables/useSortable'
import { useAuthStore } from '@/stores/auth'

const zones = ref([])
const { sortKey, sortAsc, sortedItems: sortedZones, sortBy } = useSortable(zones, 'id')
const auth = useAuthStore()

async function load() {
  const { data } = await zoneService.getAll()
  zones.value = data
}

async function deleteZone(id) {
  if (confirm('Are you sure?')) {
    await zoneService.remove(id)
    load()
  }
}

onMounted(load)
</script>
