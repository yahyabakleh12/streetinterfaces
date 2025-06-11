import API from './api'

export default {
  getAll()            { return API.get('/roles') },
  get(id)             { return API.get(`/roles/${id}`) },
  create(payload)     { return API.post('/roles', payload) },
  update(id, payload) { return API.put(`/roles/${id}`, payload) },
  remove(id)          { return API.delete(`/roles/${id}`) },
}
