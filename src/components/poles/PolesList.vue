<template>
  <div>
    <h1>Poles</h1>
    <router-link to="/poles/create" class="btn btn-primary mb-3">Add New Pole</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th><th>API Pole ID</th><th>Code</th><th>Zone</th><th>Location</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pole in poles" :key="pole.id">
          <td>{{ pole.id }}</td>
          <td>{{ pole.api_pole_id }}</td>
          <td>{{ pole.code }}</td>
          <td>{{ pole.zone_id }}</td>
          <td>{{ pole.location_id }}</td>
          <td>
            <router-link :to="`/poles/${pole.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link :to="`/poles/${pole.id}/edit`" class="btn btn-sm btn-secondary me-1">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click.prevent="deletePole(pole.id)">Delete</button>
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
