import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
})

export default {
  getAll()           { return API.get('/cameras') },
  get(id)           { return API.get(`/cameras/${id}`) },
  create(payload)   { return API.post('/cameras', payload) },
  update(id, payload){ return API.put(`/cameras/${id}`, payload) },
  remove(id)        { return API.delete(`/cameras/${id}`) },
}
