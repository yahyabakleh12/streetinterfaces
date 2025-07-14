<!-- App.vue -->
<template>
  <TopNavbar v-if="showSidebar" @toggle="toggle" :username="username" @logout="logout" />
  <div class="d-flex">
    <Sidebar v-if="showSidebar" :collapsed="collapsed" />
    <div :class="['flex-grow-1', 'p-3', showSidebar ? 'mt-5' : '']">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TopNavbar from '@/components/layout/TopNavbar.vue'
import Sidebar from '@/components/layout/Sidebar.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const showSidebar = computed(() => route.path !== '/login')
const collapsed = ref(false)
const username = 'admin'

function toggle() {
  collapsed.value = !collapsed.value
}

function logout() {
  auth.clearToken()
  router.push('/login')
}
</script>
