import axios from 'axios'

const authApi = axios.create({
  baseURL: import.meta.env.VITE_AUTH_BASE_URL,
  headers: { 'Accept': 'application/json' },
})

export const login = (data) =>
  authApi.post('/login', data)

export const sendOtp = (email) =>
  authApi.post('/send-otp', { email })

export const resetPassword = (data) =>
  authApi.post('/reset-password', data)