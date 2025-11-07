import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { locales } from '@/i18n'
import { Toaster } from '@/components/ui/toaster'
import '../globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Video & Image Processor',
    description: 'Professional video and image processing platform powered by FFmpeg'
}

export function generateStaticParams() {
    return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params: { locale } }: { children: React.ReactNode; params: { locale: string } }) {
    // 验证语言是否有效
    if (!locales.includes(locale as any)) {
        notFound()
    }

    // 显式根据 locale 加载翻译消息
    const messages = (await import(`../../../messages/${locale}.json`)).default

    return (
        <html lang={locale}>
            <body className={inter.className}>
                <NextIntlClientProvider locale={locale} messages={messages}>
                    {children}
                    <Toaster />
                </NextIntlClientProvider>
            </body>
        </html>
    )
}
