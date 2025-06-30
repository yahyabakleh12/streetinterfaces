<template>
  <div>
    <h1>Poles</h1>
    <router-link to="/poles/create" class="btn btn-primary mb-3">Add New Pole</router-link>
    <table class="table table-striped">
      <thead>
        <tr>
          <th @click="sortBy('id')" style="cursor:pointer">ID <span v-if="sortKey === 'id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('api_pole_id')" style="cursor:pointer">API Pole ID <span v-if="sortKey === 'api_pole_id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('code')" style="cursor:pointer">Code <span v-if="sortKey === 'code'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('zone_id')" style="cursor:pointer">Zone <span v-if="sortKey === 'zone_id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th @click="sortBy('location_id')" style="cursor:pointer">Location <span v-if="sortKey === 'location_id'">{{ sortAsc ? '▲' : '▼' }}</span></th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pole in sortedPoles" :key="pole.id">
          <td>{{ pole.id }}</td>
          <td>{{ pole.api_pole_id }}</td>
          <td>{{ pole.code }}</td>
          <td>{{ pole.zone_id }}</td>
          <td>{{ pole.location_id }}</td>
          <td>
            <router-link :to="`/poles/${pole.id}`" class="btn btn-sm btn-secondary me-1">View</router-link>
            <router-link
              v-if="auth.isAdmin"
              :to="`/poles/${pole.id}/edit`"
              class="btn btn-sm btn-secondary me-1"
            >Edit</router-link>
            <button
              v-if="auth.isAdmin"
              class="btn btn-sm btn-danger"
              @click.prevent="deletePole(pole.id)"
            >Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import poleService from '@/services/poleService'
import useSortable from '@/composables/useSortable'
import { useAuthStore } from '@/stores/auth'

const poles = ref([])
const { sortKey, sortAsc, sortedItems: sortedPoles, sortBy } = useSortable(poles, 'id')
const auth = useAuthStore()

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
