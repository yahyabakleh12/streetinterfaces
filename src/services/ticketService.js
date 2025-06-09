import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
})

export default {
  getAll(params = {}) { return API.get('/tickets', { params }) },
  get(id)             { return API.get(`/tickets/${id}`) },
  create(payload)     { return API.post('/tickets', payload) },
  update(id, payload) { return API.put(`/tickets/${id}`, payload) },
  remove(id)          { return API.delete(`/tickets/${id}`) },
}
