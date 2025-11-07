/**
 * 文件处理相关常量
 */

export const FILE_SIZE_LIMITS = {
    IMAGE: 50 * 1024 * 1024,      // 50MB
    VIDEO: 500 * 1024 * 1024      // 500MB
} as const

export const ACCEPTED_FILE_TYPES = {
    IMAGE: {
        'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
    },
    VIDEO: {
        'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv']
    }
} as const

export const OUTPUT_FORMATS = {
    IMAGE: ['jpg', 'png', 'webp', 'gif', 'bmp'] as const,
    VIDEO: ['mp4', 'avi', 'mov', 'mkv', 'webm'] as const,
    AUDIO: ['mp3', 'wav', 'aac', 'flac'] as const
} as const

export const VIDEO_QUALITY_PRESETS = {
    HIGH: 'high',
    MEDIUM: 'medium',
    LOW: 'low'
} as const

export const IMAGE_QUALITY_RANGE = {
    MIN: 1,
    MAX: 100,
    DEFAULT: 90
} as const

