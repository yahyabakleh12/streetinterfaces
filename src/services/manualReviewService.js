import API from './api'

export default {
  getAll(params = {}) { return API.get('/manual-reviews', { params }) },
  get(id) { return API.get(`/manual-reviews/${id}`) },
  getImage(id) { return API.get(`/manual-reviews/${id}/image`, { responseType: 'blob' }) },
  getVideo(id) { return API.get(`/manual-reviews/${id}/video`, { responseType: 'blob' }) },
  listSnapshots(id) { return API.get(`/manual-reviews/${id}/snapshots`) },
  getSnapshot(id, filename) {
    return API.get(`/manual-reviews/${id}/snapshots/${filename}`, { responseType: 'blob' })
  },
  correct(id, payload) { return API.post(`/manual-reviews/${id}/correct`, payload) },
  dismiss(id) { return API.post(`/manual-reviews/${id}/dismiss`) },
}
