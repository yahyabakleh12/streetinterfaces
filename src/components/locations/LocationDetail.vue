<template>
  <div v-if="location">
    <h1>Location #{{ location.id }}</h1>
    <ul>
      <li>Name: {{ location.name }}</li>
      <li>Code: {{ location.code }}</li>
      <li>Portal Name: {{ location.portal_name }}</li>
      <li>IP Schema: {{ location.ip_schema }}</li>
    </ul>
    <router-link to="/locations">Back to list</router-link>
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
