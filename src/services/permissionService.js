import API from './api'

export default {
  getAll()            { return API.get('/permissions') },
  get(id)             { return API.get(`/permissions/${id}`) },
  create(payload)     { return API.post('/permissions', payload) },
  update(id, payload) { return API.put(`/permissions/${id}`, payload) },
  remove(id)          { return API.delete(`/permissions/${id}`) },
}
