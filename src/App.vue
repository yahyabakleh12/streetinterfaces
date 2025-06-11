<!-- App.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
    <div class="container">
      <router-link class="navbar-brand" to="/">Street</router-link>
      <div class="navbar-nav">
        <router-link class="nav-link" to="/cameras">Cameras</router-link>
        <router-link class="nav-link" to="/locations">Locations</router-link>
        <router-link class="nav-link" to="/zones">Zones</router-link>
        <router-link class="nav-link" to="/poles">Poles</router-link>
        <router-link class="nav-link" to="/tickets">Tickets</router-link>
        <router-link class="nav-link" to="/manual-reviews">Manual Reviews</router-link>
        <router-link v-if="auth.roles.includes('admin')" class="nav-link" to="/users">Users</router-link>
        <router-link v-if="auth.roles.includes('admin')" class="nav-link" to="/roles">Roles</router-link>
        <router-link v-if="auth.roles.includes('admin')" class="nav-link" to="/permissions">Permissions</router-link>
        <router-link v-if="!auth.token" class="nav-link" to="/login">Login</router-link>
        <a v-else class="nav-link" href="#" @click.prevent="logout">Logout</a>
      </div>
    </div>
  </nav>
  <div class="container">
    <router-view />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function logout() {
  auth.clearToken()
  router.push('/login')
}
</script>
