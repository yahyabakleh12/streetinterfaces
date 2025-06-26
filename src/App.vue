<!-- App.vue -->
<template>
  <div class="d-flex">
    <nav v-if="showSidebar" class="sidebar text-light p-3">
      <div class="text-center mb-4">
        <img src="/vite.svg" alt="Logo" class="img-fluid mb-2" style="height: 40px;">
        <router-link class="navbar-brand text-light" to="/statistics">Street</router-link>
      </div>
      <ul class="nav flex-column">
        <li class="nav-item"><router-link class="nav-link text-light" to="/statistics">Statistics</router-link></li>
        <li class="nav-item"><router-link class="nav-link text-light" to="/cameras">Cameras</router-link></li>
        <li class="nav-item"><router-link class="nav-link text-light" to="/camera-clip">Camera Clip</router-link></li>
        <li class="nav-item"><router-link class="nav-link text-light" to="/locations">Locations</router-link></li>
        <li class="nav-item"><router-link class="nav-link text-light" to="/zones">Zones</router-link></li>
        <li class="nav-item"><router-link class="nav-link text-light" to="/poles">Poles</router-link></li>
        <li class="nav-item"><router-link class="nav-link text-light" to="/tickets">Tickets</router-link></li>
        <li class="nav-item"><router-link class="nav-link text-light" to="/manual-reviews">Manual Reviews</router-link></li>
        <li class="nav-item" v-if="auth.roles.includes('admin')"><router-link class="nav-link text-light" to="/users">Users</router-link></li>
        <li class="nav-item" v-if="auth.roles.includes('admin')"><router-link class="nav-link text-light" to="/roles">Roles</router-link></li>
        <li class="nav-item" v-if="auth.roles.includes('admin')"><router-link class="nav-link text-light" to="/permissions">Permissions</router-link></li>
        <li class="nav-item" v-if="!auth.token"><router-link class="nav-link text-light" to="/login">Login</router-link></li>
        <li class="nav-item" v-else><a class="nav-link text-light" href="#" @click.prevent="logout">Logout</a></li>
      </ul>
    </nav>
    <div class="flex-grow-1 p-3">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const showSidebar = computed(() => route.path !== '/login')

function logout() {
  auth.clearToken()
  router.push('/login')
}
</script>
