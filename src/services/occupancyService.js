import API from './api'

export default {
  getByLocation(locationId) {
    return API.get(`/camera-occupancy/${locationId}`)
  }
}
