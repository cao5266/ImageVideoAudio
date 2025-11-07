/**
 * 处理任务相关类型定义
 */

export type ProcessStatus = 'pending' | 'processing' | 'completed' | 'failed'

export type ProcessType =
    | 'convert'
    | 'resize'
    | 'compress'
    | 'trim'
    | 'merge'
    | 'extractAudio'
    | 'gif'

export interface ProcessingJob {
    jobId: string
    userId: number
    fileId: string
    type: ProcessType
    status: ProcessStatus
    progress?: number
    outputFileId?: string
    errorMessage?: string
    createdAt: string
    updatedAt: string
}

export interface ImageProcessOptions {
    fileId: string
    outputFormat?: string
    width?: number
    height?: number
    scale?: number
    quality?: number
}

export interface VideoProcessOptions {
    fileId: string
    outputFormat?: string
    quality?: 'high' | 'medium' | 'low'
    startTime?: number
    endTime?: number
    targetSize?: number
}

export interface ProcessResponse {
    jobId: string
    status: ProcessStatus
    message?: string
}

export interface JobStatusResponse {
    job: ProcessingJob
}

