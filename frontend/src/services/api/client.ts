/**
 * API 客户端配置
 */

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, API_PREFIX, STORAGE_KEYS } from '@/constants'

// 创建 axios 实例
export const apiClient: AxiosInstance = axios.create({
    baseURL: `${API_BASE_URL}${API_PREFIX}`,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器 - 自动添加 token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器 - 处理 token 过期
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config

        // Token 过期，尝试刷新
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN)
                if (refreshToken) {
                    const response = await axios.post(`${API_BASE_URL}${API_PREFIX}/auth/refresh`, {
                        refreshToken
                    })

                    const { accessToken, refreshToken: newRefreshToken } = response.data
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken)
                    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken)

                    originalRequest.headers.Authorization = `Bearer ${accessToken}`
                    return apiClient(originalRequest)
                }
            } catch (refreshError) {
                // Refresh token 失效，清除本地存储
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN)
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
                localStorage.removeItem(STORAGE_KEYS.USER)

                // 重定向到登录页
                const currentLocale = window.location.pathname.split('/')[1] || 'zh'
                window.location.href = `/${currentLocale}/login`

                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    }
)

export default apiClient

