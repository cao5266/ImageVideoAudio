import { notFound } from 'next/navigation'
import { getRequestConfig } from 'next-intl/server'

// 支持的语言列表
export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]

// 默认语言
export const defaultLocale: Locale = 'zh'

export default getRequestConfig(async ({ locale }) => {
    // 验证请求的语言是否支持
    const validLocale = locale && locales.includes(locale as Locale) ? locale : defaultLocale

    if (!locales.includes(validLocale as Locale)) {
        notFound()
    }

    return {
        locale: validLocale,
        messages: (await import(`../messages/${validLocale}.json`)).default
    }
})

