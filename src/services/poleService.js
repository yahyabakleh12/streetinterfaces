import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  timeout: 5000,
})

export default {
  getAll()            { return API.get('/poles') },
  get(id)             { return API.get(`/poles/${id}`) },
  create(payload)     { return API.post('/poles', payload) },
  update(id, payload) { return API.put(`/poles/${id}`, payload) },
  remove(id)          { return API.delete(`/poles/${id}`) },
}
