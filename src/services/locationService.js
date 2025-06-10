import API from './api'

export default {
  getAll()            { return API.get('/locations') },
  get(id)             { return API.get(`/locations/${id}`) },
  create(payload)     { return API.post('/locations', payload) },
  update(id, payload) { return API.put(`/locations/${id}`, payload) },
  remove(id)          { return API.delete(`/locations/${id}`) },
}
