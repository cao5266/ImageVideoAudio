/**
 * 认证服务
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from '@/constants'
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types'

export const authService = {
    /**
     * 用户注册
     */
    register: async (data: RegisterData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data)
        return response.data
    },

    /**
     * 用户登录
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials)
        return response.data
    },

    /**
     * 刷新 Token
     */
    refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
        return response.data
    },

    /**
     * 获取当前用户信息
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>(API_ENDPOINTS.AUTH.CURRENT_USER)
        return response.data
    },

    /**
     * 退出登录
     */
    logout: async (): Promise<void> => {
        await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT)
    }
}

