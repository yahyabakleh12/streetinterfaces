<template>
  <nav :class="['sidebar', 'd-flex', 'flex-column', 'p-3', 'text-light', {'collapsed': collapsed}]">
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <router-link class="nav-link text-light" to="/statistics">
          <i class="bi bi-bar-chart"></i>
          <span v-if="!collapsed" class="ms-2">Statistics</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-light" to="/cameras">
          <i class="bi bi-camera-video"></i>
          <span v-if="!collapsed" class="ms-2">Cameras</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-light" to="/camera-clip">
          <i class="bi bi-film"></i>
          <span v-if="!collapsed" class="ms-2">Camera Clip</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-light" to="/img-ocr">
          <i class="bi bi-image"></i>
          <span v-if="!collapsed" class="ms-2">Image OCR</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-light" to="/locations">
          <i class="bi bi-geo"></i>
          <span v-if="!collapsed" class="ms-2">Locations</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-light" to="/zones">
          <i class="bi bi-diagram-3"></i>
          <span v-if="!collapsed" class="ms-2">Zones</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-light" to="/poles">
          <i class="bi bi-bezier"></i>
          <span v-if="!collapsed" class="ms-2">Poles</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-light" to="/tickets">
          <i class="bi bi-receipt"></i>
          <span v-if="!collapsed" class="ms-2">Tickets</span>
        </router-link>
      </li>
      <li class="nav-item">
        <router-link class="nav-link text-light" to="/manual-reviews">
          <i class="bi bi-pencil"></i>
          <span v-if="!collapsed" class="ms-2">Manual Reviews</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="auth.roles.includes('admin')">
        <router-link class="nav-link text-light" to="/users">
          <i class="bi bi-people"></i>
          <span v-if="!collapsed" class="ms-2">Users</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="auth.roles.includes('admin')">
        <router-link class="nav-link text-light" to="/roles">
          <i class="bi bi-person-badge"></i>
          <span v-if="!collapsed" class="ms-2">Roles</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="auth.roles.includes('admin')">
        <router-link class="nav-link text-light" to="/permissions">
          <i class="bi bi-shield-check"></i>
          <span v-if="!collapsed" class="ms-2">Permissions</span>
        </router-link>
      </li>
      <li class="nav-item" v-if="!auth.token">
        <router-link class="nav-link text-light" to="/login">
          <i class="bi bi-box-arrow-in-right"></i>
          <span v-if="!collapsed" class="ms-2">Login</span>
        </router-link>
      </li>
      <li class="nav-item" v-else>
        <a href="#" class="nav-link text-light" @click.prevent="logout">
          <i class="bi bi-box-arrow-right"></i>
          <span v-if="!collapsed" class="ms-2">Logout</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  collapsed: Boolean
})

const auth = useAuthStore()

function logout() {
  auth.clearToken()
}
</script>

<style scoped>
.sidebar {
  width: 240px;
  min-height: calc(100vh - 60px);
  background-color: #2B324C;
  transition: width 0.2s;
}
.sidebar.collapsed {
  width: 60px;
}
.sidebar .nav-link {
  color: #ffffff;
}
.sidebar .nav-link.router-link-active {
  background-color: rgba(255,255,255,0.1);
}
</style>
