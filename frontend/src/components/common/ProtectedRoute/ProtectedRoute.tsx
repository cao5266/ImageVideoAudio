'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const { isAuthenticated } = useAuthStore()
    const [isLoading, setIsLoading] = useState(true)

    // 从 pathname 获取当前语言
    const locale = pathname.startsWith('/zh') ? 'zh' : pathname.startsWith('/en') ? 'en' : 'zh'

    useEffect(() => {
        // 给一个短暂的延迟，确保 zustand persist 已经从 localStorage 恢复状态
        const timer = setTimeout(() => {
            setIsLoading(false)

            if (!isAuthenticated) {
                router.push(`/${locale}/login`)
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [isAuthenticated, router, locale])

    if (isLoading || !isAuthenticated) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto'></div>
                    <p className='mt-4 text-gray-600'>加载中...</p>
                </div>
            </div>
        )
    }

    return <>{children}</>
}
