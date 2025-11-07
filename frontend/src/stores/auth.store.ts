/**
 * 认证状态管理
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/constants'
import type { User, AuthState, AuthTokens } from '@/types'

interface AuthStore extends AuthState {
    setAuth: (user: User, tokens: AuthTokens) => void
    updateUser: (user: Partial<User>) => void
    clearAuth: () => void
    loadAuthFromStorage: () => void
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            /**
             * 设置认证信息
             */
            setAuth: (user: User, tokens: AuthTokens) => {
                // persist 中间件会自动保存到 localStorage
                set({
                    user,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                    isAuthenticated: true
                })
            },

            /**
             * 更新用户信息
             */
            updateUser: (userData: Partial<User>) => {
                set((state) => {
                    if (!state.user) return state

                    const updatedUser = { ...state.user, ...userData }
                    // persist 中间件会自动保存
                    return {
                        user: updatedUser
                    }
                })
            },

            /**
             * 清除认证信息
             */
            clearAuth: () => {
                // persist 中间件会自动清除 localStorage
                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    isAuthenticated: false
                })
            },

            /**
             * 从 localStorage 加载认证信息（保留用于兼容性）
             */
            loadAuthFromStorage: () => {
                // 使用 persist 中间件后，这个方法主要用于强制刷新
                const state = useAuthStore.getState()
                if (state.user && state.accessToken) {
                    set({
                        isAuthenticated: true
                    })
                }
            }
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)

