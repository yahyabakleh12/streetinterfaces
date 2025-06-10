import API from './api'

export default {
  getAll()            { return API.get('/zones') },
  get(id)             { return API.get(`/zones/${id}`) },
  create(payload)     { return API.post('/zones', payload) },
  update(id, payload) { return API.put(`/zones/${id}`, payload) },
  remove(id)          { return API.delete(`/zones/${id}`) },
}
