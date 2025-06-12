import API from './api'

export default {
  getAll() { return API.get('/spots') },
  getForCamera(camId) { return API.get(`/cameras/${camId}/spots`) },
  create(payload) { return API.post('/spots', payload) },
  remove(id) { return API.delete(`/spots/${id}`) },
}
