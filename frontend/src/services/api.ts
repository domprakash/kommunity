import axios from 'axios'
import { auth } from './firebase'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3001',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Firebase Bearer token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Normalise error messages
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(new Error(err.response?.data?.message ?? err.message ?? 'An unexpected error occurred')),
)

export default api
