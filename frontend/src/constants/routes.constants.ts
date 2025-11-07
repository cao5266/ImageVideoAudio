/**
 * 路由常量
 */

export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    HISTORY: '/history',
    TOOLS: {
        IMAGE: '/tools/image',
        VIDEO: '/tools/video'
    },
    AUTH: {
        CALLBACK: '/auth/callback'
    },
    DEMO: '/components-demo'
} as const

/**
 * 获取带语言前缀的路由
 */
export const getLocalizedRoute = (route: string, locale: string) => {
    return `/${locale}${route}`
}

/**
 * 公开路由（无需登录）
 */
export const PUBLIC_ROUTES = [
    ROUTES.HOME,
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.AUTH.CALLBACK
]

/**
 * 受保护路由（需要登录）
 */
export const PROTECTED_ROUTES = [
    ROUTES.PROFILE,
    ROUTES.HISTORY,
    ROUTES.TOOLS.IMAGE,
    ROUTES.TOOLS.VIDEO
]

