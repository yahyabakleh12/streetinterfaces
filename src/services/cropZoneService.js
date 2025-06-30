import API from './api'

export default {
  getAll() { return API.get('/crop-zones') },
  get(id) { return API.get(`/crop-zones/${id}`) },
  getForCamera(camId) { return API.get(`/cameras/${camId}/crop-zones`) },
  create(payload) { return API.post('/crop-zones', payload) },
  update(id, payload) { return API.put(`/crop-zones/${id}`, payload) },
  remove(id) { return API.delete(`/crop-zones/${id}`) },
}
