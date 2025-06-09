import axios from 'axios'

const API = axios.create({
  baseURL: 'http://127.0.0.1:18006',
  timeout: 5000,
})

export default {
  getAll(params = {}) { return API.get('/manual-transactions', { params }) },
  get(id) { return API.get(`/manual-transactions/${id}`) },
}
