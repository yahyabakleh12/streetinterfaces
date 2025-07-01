<template>
  <div class="text-center p-5">

    <div class="container vh-100 d-flex justify-content-center align-items-center">
      <div class="raw">
        <div class="col-12 pt-5 pl-5 pr-5 d-flex justify-content-center">
          <img src="/src/assets/logo-1.svg" alt="Logo" class="mb-3" style="height: 65px;">
        </div>
        <div class="col-12 pb-5 pl-5 pr-5 ">
          <div class="card shadow m-5" >
            <div class="card-body bg-secondary p-5">
              <!-- <h5 class="card-title text-center mb-4">Login</h5> -->

              <!-- <h1>Login</h1> -->
              <form @submit.prevent="submit">
                <div class="mb-3 ">
                  <label class="form-label text-white text-start mb-3">Username</label>
                  <input v-model="username" class="form-control" placeholder="USERNAME" />
                </div>
                <div class="mb-3">
                  <label class="form-label text-white text-start  mb-3">Password</label>
                  <input type="password" v-model="password" class="form-control" placeholder="PASSWORD" />
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
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
