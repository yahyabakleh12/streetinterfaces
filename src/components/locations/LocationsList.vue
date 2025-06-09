<template>
  <div>
    <h1>Locations</h1>
    <router-link to="/locations/create" class="btn btn-primary mb-3">Add New Location</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Code</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="loc in locations" :key="loc.id">
          <td>{{ loc.id }}</td>
          <td>{{ loc.name }}</td>
          <td>{{ loc.code }}</td>
          <td>
            <router-link :to="`/locations/${loc.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link :to="`/locations/${loc.id}/edit`" class="btn btn-sm btn-secondary me-1">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click.prevent="deleteLocation(loc.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import locationService from '@/services/locationService'

const locations = ref([])

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
