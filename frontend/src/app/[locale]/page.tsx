'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LanguageSwitcher from '@/components/features/language/LanguageSwitcher'
import { Video, Image as ImageIcon, Zap, FileVideo, FileImage, Upload } from 'lucide-react'

export default function HomePage() {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const [activeTab, setActiveTab] = useState('video')

    const videoFeatures = [
        { icon: FileVideo, title: '格式转换', desc: '支持 MP4, AVI, MOV, MKV 等多种格式', href: `/tools/video` },
        { icon: Zap, title: '视频压缩', desc: '智能压缩，不损画质', href: `/tools/video` },
        { icon: Video, title: '视频裁剪', desc: '精准裁剪，提取精彩片段', href: `/tools/video` },
        { icon: Video, title: '提取音频', desc: '从视频中提取高品质音频', href: `/tools/video` }
    ]

    const imageFeatures = [
        { icon: FileImage, title: '格式转换', desc: '支持 JPG, PNG, WebP, GIF 等格式', href: `/tools/image` },
        { icon: ImageIcon, title: '调整大小', desc: '批量调整图片尺寸', href: `/tools/image` },
        { icon: Zap, title: '智能压缩', desc: '大幅减小文件大小', href: `/tools/image` },
        { icon: ImageIcon, title: '批量处理', desc: '一次处理多张图片', href: `/tools/image` }
    ]

    return (
        <div className='min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50'>
            {/* Header with Language Switcher */}
            <header className='border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50'>
                <div className='container mx-auto px-4 py-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                            <Video className='h-8 w-8 text-primary-600' />
                            <span className='text-2xl font-bold text-gray-900'>MediaPro</span>
                        </div>
                        <div className='flex items-center gap-4'>
                            <LanguageSwitcher />
                            <Link href='/login'>
                                <Button variant='outline'>{t('nav.login')}</Button>
                            </Link>
                            <Link href='/register'>
                                <Button>{t('nav.register')}</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className='container mx-auto px-4 py-16'>
                <div className='text-center mb-12'>
                    <h1 className='text-5xl font-bold text-gray-900 mb-4'>🎬 专业的视频图片处理工具</h1>
                    <p className='text-xl text-gray-600 max-w-2xl mx-auto mb-8'>
                        快速 • 安全 • 高效 - 支持多种格式转换、压缩、裁剪等功能
                    </p>
                </div>

                {/* Tabs for Video and Image */}
                <div className='max-w-6xl mx-auto'>
                    <Tabs defaultValue='video' value={activeTab} onValueChange={setActiveTab} className='w-full'>
                        <TabsList className='grid w-full max-w-md mx-auto grid-cols-2 mb-12 h-auto p-2'>
                            <TabsTrigger value='video' className='text-lg py-3'>
                                <Video className='h-5 w-5 mr-2' />
                                视频处理
                            </TabsTrigger>
                            <TabsTrigger value='image' className='text-lg py-3'>
                                <ImageIcon className='h-5 w-5 mr-2' />
                                图片处理
                            </TabsTrigger>
                        </TabsList>

                        {/* Video Tab Content */}
                        <TabsContent value='video' className='mt-0'>
                            <div className='mb-8'>
                                <Link href={`/${locale}/tools/video`} className='block'>
                                    <Card className='border-2 border-dashed border-primary-300 hover:border-primary-500 hover:shadow-lg transition-all cursor-pointer bg-primary-50/30'>
                                        <CardContent className='flex flex-col items-center justify-center py-16'>
                                            <Upload className='h-16 w-16 text-primary-600 mb-4' />
                                            <h3 className='text-2xl font-semibold text-gray-900 mb-2'>
                                                点击上传视频文件
                                            </h3>
                                            <p className='text-gray-600'>支持 MP4, AVI, MOV, MKV, WebM, FLV 等格式</p>
                                            <p className='text-sm text-gray-500 mt-2'>需要登录后使用</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>

                            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                                {videoFeatures.map((feature, index) => (
                                    <Link key={index} href={`/${locale}${feature.href}`}>
                                        <Card className='h-full hover:shadow-lg transition-shadow cursor-pointer group'>
                                            <CardHeader>
                                                <div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                                    <feature.icon className='h-6 w-6 text-blue-600' />
                                                </div>
                                                <CardTitle className='text-lg'>{feature.title}</CardTitle>
                                                <CardDescription>{feature.desc}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Image Tab Content */}
                        <TabsContent value='image' className='mt-0'>
                            <div className='mb-8'>
                                <Link href={`/${locale}/tools/image`} className='block'>
                                    <Card className='border-2 border-dashed border-green-300 hover:border-green-500 hover:shadow-lg transition-all cursor-pointer bg-green-50/30'>
                                        <CardContent className='flex flex-col items-center justify-center py-16'>
                                            <Upload className='h-16 w-16 text-green-600 mb-4' />
                                            <h3 className='text-2xl font-semibold text-gray-900 mb-2'>
                                                点击上传图片文件
                                            </h3>
                                            <p className='text-gray-600'>支持 JPG, PNG, GIF, WebP, BMP 等格式</p>
                                            <p className='text-sm text-gray-500 mt-2'>需要登录后使用</p>
                                        </CardContent>
                                    </Card>
                                </Link>
                            </div>

                            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
                                {imageFeatures.map((feature, index) => (
                                    <Link key={index} href={`/${locale}${feature.href}`}>
                                        <Card className='h-full hover:shadow-lg transition-shadow cursor-pointer group'>
                                            <CardHeader>
                                                <div className='w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform'>
                                                    <feature.icon className='h-6 w-6 text-green-600' />
                                                </div>
                                                <CardTitle className='text-lg'>{feature.title}</CardTitle>
                                                <CardDescription>{feature.desc}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Features Section */}
                <div className='mt-24 max-w-5xl mx-auto'>
                    <h2 className='text-3xl font-bold text-center text-gray-900 mb-12'>✨ 核心特色</h2>
                    <div className='grid md:grid-cols-3 gap-8'>
                        <div className='text-center'>
                            <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <Zap className='h-8 w-8 text-blue-600' />
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>极速处理</h3>
                            <p className='text-gray-600'>基于 FFmpeg 引擎，处理速度快如闪电</p>
                        </div>
                        <div className='text-center'>
                            <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <FileVideo className='h-8 w-8 text-green-600' />
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>格式丰富</h3>
                            <p className='text-gray-600'>支持 30+ 种视频和图片格式互相转换</p>
                        </div>
                        <div className='text-center'>
                            <div className='w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                                <ImageIcon className='h-8 w-8 text-purple-600' />
                            </div>
                            <h3 className='text-xl font-semibold text-gray-900 mb-2'>批量处理</h3>
                            <p className='text-gray-600'>一次上传多个文件，批量处理节省时间</p>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className='mt-24 text-center'>
                    <h2 className='text-2xl font-semibold text-gray-900 mb-8'>📊 使用统计</h2>
                    <div className='flex justify-center gap-12'>
                        <div>
                            <p className='text-4xl font-bold text-primary-600'>1,234,567</p>
                            <p className='text-gray-600 mt-2'>已处理文件</p>
                        </div>
                        <div>
                            <p className='text-4xl font-bold text-green-600'>890 GB</p>
                            <p className='text-gray-600 mt-2'>节省空间</p>
                        </div>
                        <div>
                            <p className='text-4xl font-bold text-purple-600'>10,000+</p>
                            <p className='text-gray-600 mt-2'>用户信赖</p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className='mt-24 text-center bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-12 text-white'>
                    <h2 className='text-3xl font-bold mb-4'>准备好开始了吗？</h2>
                    <p className='text-xl mb-8 opacity-90'>立即注册，免费使用所有功能</p>
                    <div className='flex gap-4 justify-center'>
                        <Link href={`/${locale}/register`}>
                            <Button size='lg' variant='secondary' className='text-lg px-8'>
                                免费注册
                            </Button>
                        </Link>
                        <Link href={`/${locale}/login`}>
                            <Button
                                size='lg'
                                variant='outline'
                                className='text-lg px-8 bg-white/10 hover:bg-white/20 text-white border-white'
                            >
                                立即登录
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className='border-t bg-gray-50 mt-24'>
                <div className='container mx-auto px-4 py-8 text-center text-gray-600'>
                    <p>© 2024 MediaPro. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
