<template>
  <div class="text-center">
    <img src="/vite.svg" alt="Logo" class="mb-3" style="height: 64px;">
    <h1>Login</h1>
    <form @submit.prevent="submit">
      <div class="mb-3">
        <label class="form-label">Username</label>
        <input v-model="username" class="form-control" />
      </div>
      <div class="mb-3">
        <label class="form-label">Password</label>
        <input type="password" v-model="password" class="form-control" />
      </div>
      <button type="submit" class="btn btn-primary">Login</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { login as loginRequest } from '@/services/authService'

const router = useRouter()
const auth = useAuthStore()

const username = ref('')
const password = ref('')

async function submit() {
  try {
    const { data } = await loginRequest(username.value, password.value)
    auth.setToken(data.access_token)
    router.push('/')
  } catch (err) {
    alert('Invalid credentials')
  }
}
</script>
