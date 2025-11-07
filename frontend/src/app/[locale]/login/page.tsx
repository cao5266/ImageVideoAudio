'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/stores'
import { Mail, Lock, AlertCircle } from 'lucide-react'

interface LoginForm {
    email: string
    password: string
}

export default function LoginPage() {
    const router = useRouter()
    const { setAuth, isAuthenticated } = useAuthStore()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginForm>()

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/')
        }
    }, [isAuthenticated, router])

    const onSubmit = async (data: LoginForm) => {
        try {
            setLoading(true)
            setError('')

            const response = await authAPI.login(data)
            const { user, accessToken, refreshToken } = response.data

            setAuth(user, accessToken, refreshToken)
            router.push('/')
        } catch (err: any) {
            setError(err.response?.data?.error || '登录失败，请重试')
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        window.location.href = `${apiUrl}/api/auth/google`
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4'>
            <div className='max-w-md w-full bg-white rounded-lg shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-2'>欢迎回来</h1>
                    <p className='text-gray-600'>登录您的账户</p>
                </div>

                {error && (
                    <div className='mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700'>
                        <AlertCircle className='h-5 w-5 mr-2' />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                    {/* Email */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>邮箱地址</label>
                        <div className='relative'>
                            <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                            <input
                                type='email'
                                {...register('email', {
                                    required: '请输入邮箱地址',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: '请输入有效的邮箱地址'
                                    }
                                })}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                placeholder='your@email.com'
                            />
                        </div>
                        {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>密码</label>
                        <div className='relative'>
                            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400' />
                            <input
                                type='password'
                                {...register('password', {
                                    required: '请输入密码'
                                })}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                placeholder='••••••••'
                            />
                        </div>
                        {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed'
                    >
                        {loading ? '登录中...' : '登录'}
                    </button>
                </form>

                {/* Divider */}
                <div className='my-6 flex items-center'>
                    <div className='flex-1 border-t border-gray-300'></div>
                    <span className='px-4 text-sm text-gray-500'>或</span>
                    <div className='flex-1 border-t border-gray-300'></div>
                </div>

                {/* Google Login */}
                <button
                    onClick={handleGoogleLogin}
                    className='w-full flex items-center justify-center space-x-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors'
                >
                    <svg className='h-5 w-5' viewBox='0 0 24 24'>
                        <path
                            fill='#4285F4'
                            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                        />
                        <path
                            fill='#34A853'
                            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                        />
                        <path
                            fill='#FBBC05'
                            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                        />
                        <path
                            fill='#EA4335'
                            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                        />
                    </svg>
                    <span>使用 Google 账号登录</span>
                </button>

                {/* Register Link */}
                <p className='mt-6 text-center text-sm text-gray-600'>
                    还没有账户？{' '}
                    <Link href='/register' className='text-primary-600 hover:text-primary-700 font-semibold'>
                        立即注册
                    </Link>
                </p>

                <p className='mt-4 text-center'>
                    <Link href='/' className='text-sm text-gray-600 hover:text-primary-600'>
                        返回首页
                    </Link>
                </p>
            </div>
        </div>
    )
}
