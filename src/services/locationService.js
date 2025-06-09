import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
})

export default {
  getAll()            { return API.get('/locations') },
  get(id)             { return API.get(`/locations/${id}`) },
  create(payload)     { return API.post('/locations', payload) },
  update(id, payload) { return API.put(`/locations/${id}`, payload) },
  remove(id)          { return API.delete(`/locations/${id}`) },
}
