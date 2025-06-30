import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    roles: JSON.parse(localStorage.getItem('roles') || '[]'),
    permissions: JSON.parse(localStorage.getItem('permissions') || '[]')
  }),
  getters: {
    isAdmin: state => state.roles.includes('admin')
  },
  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        this.roles = payload.roles || []
        this.permissions = payload.permissions || []
        localStorage.setItem('roles', JSON.stringify(this.roles))
        localStorage.setItem('permissions', JSON.stringify(this.permissions))
      } catch (_) {
        this.roles = []
        this.permissions = []
      }
    },
    clearToken() {
      this.token = ''
      this.roles = []
      this.permissions = []
      localStorage.removeItem('token')
      localStorage.removeItem('roles')
      localStorage.removeItem('permissions')
    }
  }
})
