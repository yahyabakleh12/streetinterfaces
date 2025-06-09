<template>
  <div>
    <h1>Poles</h1>
    <router-link to="/poles/create">
      <button>Add New Pole</button>
    </router-link>
    <table>
      <thead>
        <tr>
          <th>ID</th><th>Code</th><th>Zone</th><th>Location</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pole in poles" :key="pole.id">
          <td>{{ pole.id }}</td>
          <td>{{ pole.code }}</td>
          <td>{{ pole.zone_id }}</td>
          <td>{{ pole.location_id }}</td>
          <td>
            <router-link :to="`/poles/${pole.id}`">View</router-link> |
            <router-link :to="`/poles/${pole.id}/edit`">Edit</router-link> |
            <a href="#" @click.prevent="deletePole(pole.id)">Delete</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import poleService from '@/services/poleService'

const poles = ref([])

async function load() {
  const { data } = await poleService.getAll()
  poles.value = data
}

async function deletePole(id) {
  if (confirm('Are you sure?')) {
    await poleService.remove(id)
    load()
  }
}

onMounted(load)
</script>
