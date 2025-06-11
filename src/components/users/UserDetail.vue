<template>
  <div v-if="user">
    <h1>User #{{ user.id }}</h1>
    <ul class="list-group mb-3">
      <li class="list-group-item">Username: {{ user.username }}</li>
      <li class="list-group-item">Roles: {{ (user.roles || []).map(r => r.name).join(', ') }}</li>
    </ul>
    <router-link to="/users" class="btn btn-secondary">Back to list</router-link>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import userService from '@/services/userService'

const route = useRoute()
const user = ref(null)

onMounted(async () => {
  const { data } = await userService.get(route.params.id)
  user.value = data
})
</script>
