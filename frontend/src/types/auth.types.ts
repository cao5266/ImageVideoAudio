/**
 * 认证相关类型定义
 */

export interface User {
    id: number
    email: string
    name: string
    avatar?: string
    created_at?: string
}

export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    email: string
    password: string
    name: string
}

export interface AuthTokens {
    accessToken: string
    refreshToken: string
}

export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}

export interface AuthState {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
}

