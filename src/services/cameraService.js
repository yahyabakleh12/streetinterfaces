import API from './api'

export default {
  getAll()           { return API.get('/cameras') },
  get(id)           { return API.get(`/cameras/${id}`) },
  create(payload)   { return API.post('/cameras', payload) },
  update(id, payload){ return API.put(`/cameras/${id}`, payload) },
  remove(id)        { return API.delete(`/cameras/${id}`) },
  getClip(camId, params) {
    return API.get(`/cameras/${camId}/clip`, {
      params,
      responseType: 'blob',
    })
  },
  getFrame(camId) {
    return API.get(`/cameras/${camId}/frame`, {
      responseType: 'blob',
    })
  },
}
