/**
 * 文件相关类型定义
 */

export interface UploadedFile {
    fileId: string
    originalName: string
    fileName: string
    mimeType: string
    size: number
    path: string
}

export interface FileUploadOptions {
    accept?: Record<string, string[]>
    maxSize?: number
    multiple?: boolean
}

export interface FileUploadResponse {
    file?: UploadedFile
    files?: UploadedFile[]
}

export type FileType = 'image' | 'video' | 'audio'

export const ACCEPTED_IMAGE_TYPES = {
    'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
}

export const ACCEPTED_VIDEO_TYPES = {
    'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv']
}

export const MAX_FILE_SIZE = {
    image: 50 * 1024 * 1024,      // 50MB
    video: 500 * 1024 * 1024       // 500MB
}

