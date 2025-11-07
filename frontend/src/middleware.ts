import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
    // 支持的语言列表
    locales,

    // 默认语言
    defaultLocale,

    // 始终使用语言前缀
    localePrefix: 'always'
})

export const config = {
    // 匹配所有路径，除了以下路径：
    // - api 路由
    // - _next (Next.js 内部文件)
    // - _vercel (Vercel 部署文件)
    // - 静态文件 (如 favicon.ico, sitemap.xml)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}

