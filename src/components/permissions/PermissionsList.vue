<template>
  <div>
    <h1>Permissions</h1>
    <router-link to="/permissions/create" class="btn btn-primary mb-3">Add New Permission</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in permissions" :key="p.id">
          <td>{{ p.id }}</td>
          <td>{{ p.name }}</td>
          <td>
            <router-link :to="`/permissions/${p.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link :to="`/permissions/${p.id}/edit`" class="btn btn-sm btn-secondary me-1">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click.prevent="remove(p.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import permissionService from '@/services/permissionService'

const permissions = ref([])

async function load() {
  const { data } = await permissionService.getAll()
  permissions.value = data
}

async function remove(id) {
  if (confirm('Are you sure?')) {
    await permissionService.remove(id)
    load()
  }
}

onMounted(load)
</script>
