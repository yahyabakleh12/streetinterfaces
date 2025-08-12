import API from './api'

export default {
  getAll(params = {}) { return API.get('/tickets', { params }) },
  get(id)             { return API.get(`/tickets/${id}`) },
  getImage(id)        { return API.get(`/tickets/${id}/image`, { responseType: 'blob' }) },
  getExitImage(id)    { return API.get(`/tickets/${id}/exit-image`, { responseType: 'blob' }) },
  getVideo(id)        { return API.get(`/tickets/${id}/video`, { responseType: 'blob' }) },
  create(payload)     { return API.post('/tickets', payload) },
  update(id, payload) { return API.put(`/tickets/${id}`, payload) },
  remove(id)          { return API.delete(`/tickets/${id}`) },
}
