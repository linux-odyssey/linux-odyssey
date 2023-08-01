import axios from 'axios'

const api = axios.create({
  baseURL: 'https://odyssey.wancat.cc/api/v1',
})

export default api
