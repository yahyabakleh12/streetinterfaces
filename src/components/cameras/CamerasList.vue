<template>
  <div>
    <h1>Cameras</h1>
    <router-link to="/cameras/create" class="btn btn-primary mb-3">Add New Camera</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th><th>Pole ID</th><th>API Code</th><th>IP</th><th># Spots</th><th>VPN IP</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cam in cameras" :key="cam.id">
          <td>{{ cam.id }}</td>
          <td>{{ cam.pole_id }}</td>
          <td>{{ cam.api_code }}</td>
          <td>{{ cam.p_ip }}</td>
          <td>{{ cam.number_of_parking }}</td>
          <td>{{ cam.vpn_ip || '–' }}</td>
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

onMounted(load)
</script>
