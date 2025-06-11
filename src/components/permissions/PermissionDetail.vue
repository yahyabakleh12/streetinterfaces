<template>
  <div v-if="permission">
    <h1>Permission #{{ permission.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Name: {{ permission.name }}</li>
    </ul>
    <router-link to="/permissions" class="btn btn-secondary">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import permissionService from '@/services/permissionService'

const route = useRoute()
const permission = ref(null)

onMounted(async () => {
  const { data } = await permissionService.get(route.params.id)
  permission.value = data
})
</script>
