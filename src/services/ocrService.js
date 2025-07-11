import API from './api'

export default {
  ocrImage(file) {
    const formData = new FormData()
    formData.append('image', file)
    return API.post('/ocr-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }
}
