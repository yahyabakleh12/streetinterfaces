<template>
  <div>
    <h1>Locations</h1>
    <router-link to="/locations/create" class="btn btn-primary mb-3">Add New Location</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th @click="sortBy('id')" style="cursor:pointer">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('name')" style="cursor:pointer">Name <span v-if="sortKey === 'name'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('code')" style="cursor:pointer">Code <span v-if="sortKey === 'code'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="loc in sortedLocations" :key="loc.id">
          <td>{{ loc.id }}</td>
          <td>{{ loc.name }}</td>
          <td>{{ loc.code }}</td>
          <td>
            <router-link :to="`/locations/${loc.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link
              v-if="auth.isAdmin"
              :to="`/locations/${loc.id}/edit`"
              class="btn btn-sm btn-secondary me-1"
            >Edit</router-link>
            <button
              v-if="auth.isAdmin"
              class="btn btn-sm btn-danger"
              @click.prevent="deleteLocation(loc.id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import locationService from '@/services/locationService'
import useSortable from '@/composables/useSortable'
import { useAuthStore } from '@/stores/auth'

const locations = ref([])
const { sortKey, sortAsc, sortedItems: sortedLocations, sortBy } = useSortable(locations, 'id')
const auth = useAuthStore()

async function load() {
  const { data } = await locationService.getAll()
  locations.value = data
}

async function deleteLocation(id) {
  if (confirm('Are you sure?')) {
    await locationService.remove(id)
    load()
  }
}

onMounted(load)
</script>
