<template>
  <div>
    <h1>Roles</h1>
    <router-link to="/roles/create" class="btn btn-primary mb-3">Add New Role</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>ID</th><th>Name</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in roles" :key="r.id">
          <td>{{ r.id }}</td>
          <td>{{ r.name }}</td>
          <td>
            <router-link :to="`/roles/${r.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link :to="`/roles/${r.id}/edit`" class="btn btn-sm btn-secondary me-1">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click.prevent="remove(r.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import roleService from '@/services/roleService'

const roles = ref([])

async function load() {
  const { data } = await roleService.getAll()
  roles.value = data
}

async function remove(id) {
  if (confirm('Are you sure?')) {
    await roleService.remove(id)
    load()
  }
}

onMounted(load)
</script>
