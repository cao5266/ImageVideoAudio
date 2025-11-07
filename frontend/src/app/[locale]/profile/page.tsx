'use client'

import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { useAuthStore } from '@/stores'
import { User, Mail, Calendar, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

function ProfileContent() {
    const { user } = useAuthStore()

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div>
            <Header />
            <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-purple-50'>
                <main className='container mx-auto px-4 py-6 max-w-[1600px]'>
                    <div className='flex items-center gap-3 mb-6'>
                        <Settings className='h-7 w-7 text-primary-600' />
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>个人设置</h1>
                            <p className='text-sm text-gray-600'>管理您的账户信息和偏好设置</p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 xl:grid-cols-3 gap-4'>
                        {/* 左侧：账户信息 */}
                        <Card className='xl:col-span-1'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>账户信息</CardTitle>
                                <CardDescription className='text-xs'>您的基本信息</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-center gap-4'>
                                    <div className='flex-shrink-0'>
                                        {user?.avatar ? (
                                            <img
                                                src={user.avatar}
                                                alt={user.name}
                                                className='h-16 w-16 rounded-full object-cover'
                                            />
                                        ) : (
                                            <div className='h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center'>
                                                <User className='h-8 w-8 text-primary-600' />
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex-1 min-w-0'>
                                        <h3 className='text-base font-semibold text-gray-900 truncate'>{user?.name}</h3>
                                        <p className='text-xs text-gray-500'>用户名</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className='space-y-3'>
                                    <div className='flex items-start gap-3'>
                                        <Mail className='h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0' />
                                        <div className='flex-1 min-w-0'>
                                            <p className='text-sm text-gray-900 break-all'>{user?.email}</p>
                                            <p className='text-xs text-gray-500'>邮箱地址</p>
                                        </div>
                                    </div>

                                    {user?.created_at && (
                                        <div className='flex items-start gap-3'>
                                            <Calendar className='h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0' />
                                            <div className='flex-1'>
                                                <p className='text-sm text-gray-900'>{formatDate(user.created_at)}</p>
                                                <p className='text-xs text-gray-500'>注册时间</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* 右侧：设置选项 */}
                        <Card className='xl:col-span-2'>
                            <CardHeader className='pb-3'>
                                <CardTitle className='text-lg'>偏好设置</CardTitle>
                                <CardDescription className='text-xs'>自定义您的使用体验</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                                    <div className='flex-1'>
                                        <p className='font-medium text-gray-900 text-sm'>邮件通知</p>
                                        <p className='text-xs text-gray-600 mt-1'>处理完成后发送邮件通知</p>
                                    </div>
                                    <label className='relative inline-flex items-center cursor-pointer'>
                                        <input type='checkbox' className='sr-only peer' />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>

                                <div className='flex items-center justify-between p-4 bg-gray-50 rounded-lg'>
                                    <div className='flex-1'>
                                        <p className='font-medium text-gray-900 text-sm'>自动删除文件</p>
                                        <p className='text-xs text-gray-600 mt-1'>24小时后自动删除处理后的文件</p>
                                    </div>
                                    <label className='relative inline-flex items-center cursor-pointer'>
                                        <input type='checkbox' className='sr-only peer' defaultChecked />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>

                                <Separator />

                                <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
                                    <p className='text-sm text-blue-900 font-medium mb-1'>💡 温馨提示</p>
                                    <p className='text-xs text-blue-700'>
                                        为了保护您的隐私和节省服务器空间，处理后的文件会在24小时后自动删除，请及时下载保存。
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <ProfileContent />
        </ProtectedRoute>
    )
}
