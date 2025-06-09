<template>
  <div v-if="location">
    <h1>Location #{{ location.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Name: {{ location.name }}</li>
      <li class="list-group-item">Code: {{ location.code }}</li>
      <li class="list-group-item">Portal Name: {{ location.portal_name }}</li>
      <li class="list-group-item">IP Schema: {{ location.ip_schema }}</li>
    </ul>
    <router-link to="/locations" class="btn btn-secondary">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import locationService from '@/services/locationService'

const route = useRoute()
const location = ref(null)

onMounted(async () => {
  const { data } = await locationService.get(route.params.id)
  location.value = data
})
</script>
