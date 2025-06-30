<template>
  <div>
    <h1>Users</h1>
    <router-link to="/users/create" class="btn btn-primary mb-3">Add New User</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th @click="sortBy('id')" style="cursor:pointer">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('username')" style="cursor:pointer">Username <span v-if="sortKey === 'username'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('roles')" style="cursor:pointer">Roles <span v-if="sortKey === 'roles'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in sortedUsers" :key="u.id">
          <td>{{ u.id }}</td>
          <td>{{ u.username }}</td>
          <td>{{ (u.roles || []).map(r => r.name).join(', ') }}</td>
          <td>
            <router-link :to="`/users/${u.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link :to="`/users/${u.id}/edit`" class="btn btn-sm btn-secondary me-1">Edit</router-link>
            <button class="btn btn-sm btn-danger" @click.prevent="remove(u.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import userService from '@/services/userService'
import useSortable from '@/composables/useSortable'

const users = ref([])
const { sortKey, sortAsc, sortedItems: sortedUsers, sortBy } = useSortable(users, 'id')

async function load() {
  const { data } = await userService.getAll()
  users.value = data
}

async function remove(id) {
  if (confirm('Are you sure?')) {
    await userService.remove(id)
    load()
  }
}

onMounted(load)
</script>
