/**
 * 应用常量
 */

export const APP_NAME = 'MediaPro'
export const APP_DESCRIPTION = 'Professional video and image processing platform powered by FFmpeg'

export const STORAGE_KEYS = {
    USER: 'user',
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    LANGUAGE: 'language',
    THEME: 'theme'
} as const

export const FILE_RETENTION_HOURS = 24

export const SUPPORTED_LANGUAGES = ['zh', 'en'] as const
export const DEFAULT_LANGUAGE = 'zh'

export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system'
} as const

