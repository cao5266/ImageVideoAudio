'use client'

import Link from 'next/link'
import { Video, Image, History, Zap } from 'lucide-react'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { useAuthStore } from '@/stores'

function DashboardContent() {
    const { user } = useAuthStore()

    const features = [
        {
            title: '视频处理',
            description: '格式转换、压缩、裁剪、合并等',
            icon: Video,
            href: '/process/video',
            color: 'bg-blue-500'
        },
        {
            title: '图片处理',
            description: '格式转换、调整大小、压缩等',
            icon: Image,
            href: '/process/image',
            color: 'bg-green-500'
        },
        {
            title: '处理历史',
            description: '查看和下载处理结果',
            icon: History,
            href: '/history',
            color: 'bg-purple-500'
        },
        {
            title: '快速处理',
            description: '批量处理文件',
            icon: Zap,
            href: '/process/batch',
            color: 'bg-yellow-500'
        }
    ]

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                {/* Welcome Section */}
                <div className='mb-12'>
                    <h1 className='text-4xl font-bold text-gray-900 mb-2'>欢迎回来, {user?.name}！</h1>
                    <p className='text-gray-600'>选择您需要的功能开始处理文件</p>
                </div>

                {/* Feature Cards */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
                    {features.map((feature, index) => (
                        <Link
                            key={index}
                            href={feature.href}
                            className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 group'
                        >
                            <div
                                className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                            >
                                <feature.icon className='h-6 w-6 text-white' />
                            </div>
                            <h3 className='text-lg font-semibold text-gray-900 mb-2'>{feature.title}</h3>
                            <p className='text-sm text-gray-600'>{feature.description}</p>
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className='bg-white rounded-lg shadow-md p-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>快速统计</h2>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        <div className='text-center'>
                            <p className='text-3xl font-bold text-primary-600'>0</p>
                            <p className='text-sm text-gray-600 mt-1'>今日处理</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-3xl font-bold text-green-600'>0</p>
                            <p className='text-sm text-gray-600 mt-1'>本月处理</p>
                        </div>
                        <div className='text-center'>
                            <p className='text-3xl font-bold text-purple-600'>0</p>
                            <p className='text-sm text-gray-600 mt-1'>总处理数</p>
                        </div>
                    </div>
                </div>

                {/* Tips Section */}
                <div className='mt-8 bg-primary-50 border border-primary-200 rounded-lg p-6'>
                    <h3 className='text-lg font-semibold text-primary-900 mb-2'>💡 使用提示</h3>
                    <ul className='text-sm text-primary-800 space-y-1'>
                        <li>• 支持拖拽上传文件，更加便捷</li>
                        <li>• 处理完成后文件保留24小时，请及时下载</li>
                        <li>• 建议使用 WiFi 网络上传大文件</li>
                        <li>• 移动端同样支持所有功能</li>
                    </ul>
                </div>
            </main>
        </div>
    )
}

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    )
}
