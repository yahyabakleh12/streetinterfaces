<template>
  <nav class="navbar navbar-light bg-white border-bottom px-3 fixed-top" style="height: 60px; z-index:1000;">
    <div class="d-flex align-items-center w-100">
     
      <img src="/src/assets/parkonic.png" style="height: 40px;">
      <span class="navbar-brand mb-0 h5">On Street Parking</span>
       <button class="btn btn-link text-dark me-3" @click="$emit('toggle')">
        <i class="bi bi-list" style="font-size: 1.5rem;"></i>
      </button>
      <div class="ms-auto d-flex align-items-center">
        <span class="me-4">{{ breadcrumb }}</span>
        <button class="btn position-relative me-3">
          <i class="bi bi-bell"></i>
          <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">2242</span>
        </button>
        <div class="dropdown">
          <button class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
            {{ username }}
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li><a class="dropdown-item" href="#">Profile</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" @click.prevent="$emit('logout')">Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  username: {
    type: String,
    default: 'admin'
  }
})

const emit = defineEmits(['toggle', 'logout'])

const route = useRoute()
const breadcrumb = computed(() => {
  const path = route.path.split('/')[1]
  return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Dashboard'
})
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
</style>
