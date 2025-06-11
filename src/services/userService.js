import API from './api'

export default {
  getAll()            { return API.get('/users') },
  get(id)             { return API.get(`/users/${id}`) },
  create(payload)     { return API.post('/users', payload) },
  update(id, payload) { return API.put(`/users/${id}`, payload) },
  remove(id)          { return API.delete(`/users/${id}`) },
}
