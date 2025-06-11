<template>
  <div v-if="role">
    <h1>Role #{{ role.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Name: {{ role.name }}</li>
      <li class="list-group-item">Permissions: {{ (role.permissions || []).map(p => p.name).join(', ') }}</li>
    </ul>
    <router-link to="/roles" class="btn btn-secondary">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import roleService from '@/services/roleService'

const route = useRoute()
const role = ref(null)

onMounted(async () => {
  const { data } = await roleService.get(route.params.id)
  role.value = data
})
</script>
