'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Video, Menu, X, User, LogOut, ChevronDown } from 'lucide-react'
import { useAuthStore } from '@/stores'
import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import LanguageSwitcher from '@/components/features/language/LanguageSwitcher'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

export default function Header() {
    const router = useRouter()
    const { user, isAuthenticated, clearAuth } = useAuthStore()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // 使用 useLocale 获取当前语言
    const locale = useLocale()

    // 使用当前语言的翻译
    const t = useTranslations('nav')

    const handleLogout = () => {
        clearAuth()
        router.push(`/${locale}`)
    }

    return (
        <header className='bg-white shadow-sm sticky top-0 z-50'>
            <nav className='container mx-auto px-4 max-w-[1600px]'>
                <div className='flex justify-between items-center h-16'>
                    {/* Logo */}
                    <Link href={`/${locale}`} className='flex items-center space-x-2'>
                        <Video className='h-8 w-8 text-primary-600' />
                        <span className='text-2xl font-bold text-gray-900'>MediaPro</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className='hidden md:flex items-center space-x-12'>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href={`/${locale}/tools/image`}
                                    className='text-gray-700 hover:text-primary-600 px-2'
                                >
                                    {t('imageProcess')}
                                </Link>
                                <Link
                                    href={`/${locale}/tools/audio`}
                                    className='text-gray-700 hover:text-primary-600 px-2'
                                >
                                    {t('audioProcess')}
                                </Link>
                                <Link
                                    href={`/${locale}/tools/video`}
                                    className='text-gray-700 hover:text-primary-600 px-2'
                                >
                                    {t('videoProcess')}
                                </Link>

                                {/* Language Switcher */}
                                <LanguageSwitcher />

                                {/* User Menu */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant='ghost'
                                            className='flex items-center gap-2 text-gray-700 hover:text-primary-600'
                                        >
                                            <User className='h-5 w-5' />
                                            <span>{user?.name}</span>
                                            <ChevronDown className='h-4 w-4' />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align='end' className='w-48'>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/${locale}/profile`} className='cursor-pointer'>
                                                <User className='h-4 w-4 mr-2' />
                                                {t('profile')}
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className='cursor-pointer text-red-600'
                                        >
                                            <LogOut className='h-4 w-4 mr-2' />
                                            {t('logout')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <LanguageSwitcher />
                                <Link href={`/${locale}/login`} className='text-gray-700 hover:text-primary-600'>
                                    {t('login')}
                                </Link>
                                <Link
                                    href={`/${locale}/register`}
                                    className='bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-lg'
                                >
                                    {t('register')}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button className='md:hidden' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? (
                            <X className='h-6 w-6 text-gray-700' />
                        ) : (
                            <Menu className='h-6 w-6 text-gray-700' />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className='md:hidden py-4 space-y-2'>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    href={`/${locale}/tools/image`}
                                    className='block py-2 text-gray-700 hover:text-primary-600'
                                >
                                    {t('imageProcess')}
                                </Link>
                                <Link
                                    href={`/${locale}/tools/audio`}
                                    className='block py-2 text-gray-700 hover:text-primary-600'
                                >
                                    {t('audioProcess')}
                                </Link>
                                <Link
                                    href={`/${locale}/tools/video`}
                                    className='block py-2 text-gray-700 hover:text-primary-600'
                                >
                                    {t('videoProcess')}
                                </Link>
                                <Link
                                    href={`/${locale}/profile`}
                                    className='block py-2 text-gray-700 hover:text-primary-600'
                                >
                                    {t('profile')}
                                </Link>
                                <div className='py-2'>
                                    <LanguageSwitcher />
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className='block w-full text-left py-2 text-gray-700 hover:text-primary-600'
                                >
                                    {t('logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                <div className='py-2'>
                                    <LanguageSwitcher />
                                </div>
                                <Link
                                    href={`/${locale}/login`}
                                    className='block py-2 text-gray-700 hover:text-primary-600'
                                >
                                    {t('login')}
                                </Link>
                                <Link
                                    href={`/${locale}/register`}
                                    className='block py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg text-center'
                                >
                                    {t('register')}
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </header>
    )
}
