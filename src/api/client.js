import axios from 'axios'
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
})
api.interceptors.response.use(
  (r) => r,
  (error) => {
    const payload = error.response?.data?.error
    error.userMessage =
      payload?.message ||
      (error.response
        ? '요청을 처리하지 못했습니다.'
        : '서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.')
    error.code = payload?.code || 'NETWORK_ERROR'
    error.details = payload?.details
    return Promise.reject(error)
  }
)
export const unwrap = (response) => response.data?.data
