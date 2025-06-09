<template>
  <div>
    <h1>Zones</h1>
    <router-link to="/zones/create" class="btn btn-primary mb-3">Add New Zone</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th><th>Code</th><th>Location</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="zone in zones" :key="zone.id">
          <td>{{ zone.id }}</td>
          <td>{{ zone.code }}</td>
          <td>{{ zone.location_id }}</td>
          <td>
            <router-link :to="`/zones/${zone.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link :to="`/zones/${zone.id}/edit`" class="btn btn-sm btn-secondary me-1">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click.prevent="deleteZone(zone.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import zoneService from '@/services/zoneService'

const zones = ref([])

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
