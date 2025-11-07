/**
 * API 相关常量
 */

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
export const API_PREFIX = '/api'

export const API_ENDPOINTS = {
    // 认证
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        CURRENT_USER: '/auth/me',
        GOOGLE: '/auth/google'
    },
    // 上传
    UPLOAD: {
        SINGLE: '/upload/single',
        MULTIPLE: '/upload/multiple'
    },
    // 图片处理
    IMAGE: {
        CONVERT: '/process/image/convert',
        RESIZE: '/process/image/resize'
    },
    // 视频处理
    VIDEO: {
        CONVERT: '/process/video/convert',
        COMPRESS: '/process/video/compress',
        TRIM: '/process/video/trim',
        MERGE: '/process/video/merge',
        EXTRACT_AUDIO: '/process/video/extract-audio',
        TO_GIF: '/process/video/gif'
    },
    // 任务
    JOB: {
        STATUS: '/job',
        DOWNLOAD: '/job/download',
        LIST: '/jobs'
    }
} as const

export const API_TIMEOUT = 30000 // 30 seconds
export const API_RETRY_ATTEMPTS = 3

