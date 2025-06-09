<template>
  <div>
    <h1>Zones</h1>
    <router-link to="/zones/create">
      <button>Add New Zone</button>
    </router-link>
    <table>
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
            <router-link :to="`/zones/${zone.id}`">View</router-link> |
            <router-link :to="`/zones/${zone.id}/edit`">Edit</router-link> |
            <a href="#" @click.prevent="deleteZone(zone.id)">Delete</a>
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
