'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/stores'
import { authAPI } from '@/lib/api'

function AuthCallback() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { setAuth } = useAuthStore()

    useEffect(() => {
        const token = searchParams.get('token')
        const refreshToken = searchParams.get('refreshToken')

        if (token && refreshToken) {
            // 从 URL 获取 tokens，然后获取用户信息
            localStorage.setItem('accessToken', token)
            localStorage.setItem('refreshToken', refreshToken)

            authAPI
                .getCurrentUser()
                .then((response) => {
                    setAuth(response.data, token, refreshToken)
                    router.push('/')
                })
                .catch((error) => {
                    console.error('Failed to get user info:', error)
                    router.push('/login?error=auth_failed')
                })
        } else {
            router.push('/login?error=missing_token')
        }
    }, [searchParams, setAuth, router])

    return (
        <div className='min-h-screen flex items-center justify-center'>
            <div className='text-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto'></div>
                <p className='mt-4 text-gray-600'>正在验证登录...</p>
            </div>
        </div>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense
            fallback={
                <div className='min-h-screen flex items-center justify-center'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto'></div>
                        <p className='mt-4 text-gray-600'>加载中...</p>
                    </div>
                </div>
            }
        >
            <AuthCallback />
        </Suspense>
    )
}
