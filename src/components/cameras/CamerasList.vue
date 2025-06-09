<template>
  <div>
    <h1>Cameras</h1>
    <router-link to="/cameras/create">
      <button>Add New Camera</button>
    </router-link>
    <table>
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
            <router-link :to="`/cameras/${cam.id}`">View</router-link> |
            <router-link :to="`/cameras/${cam.id}/edit`">Edit</router-link> |
            <a href="#" @click.prevent="deleteCamera(cam.id)">Delete</a>
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
