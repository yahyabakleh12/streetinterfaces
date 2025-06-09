import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:18006',
  timeout: 5000,
})

export default {
  getAll()            { return API.get('/zones') },
  get(id)             { return API.get(`/zones/${id}`) },
  create(payload)     { return API.post('/zones', payload) },
  update(id, payload) { return API.put(`/zones/${id}`, payload) },
  remove(id)          { return API.delete(`/zones/${id}`) },
}
