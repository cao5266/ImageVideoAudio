/**
 * 视频处理服务
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from '@/constants'
import type { VideoProcessOptions, ProcessResponse } from '@/types'

export const videoService = {
    /**
     * 视频格式转换
     */
    convert: async (options: VideoProcessOptions): Promise<ProcessResponse> => {
        const response = await apiClient.post<ProcessResponse>(
            API_ENDPOINTS.VIDEO.CONVERT,
            options
        )
        return response.data
    },

    /**
     * 压缩视频
     */
    compress: async (options: VideoProcessOptions): Promise<ProcessResponse> => {
        const response = await apiClient.post<ProcessResponse>(
            API_ENDPOINTS.VIDEO.COMPRESS,
            options
        )
        return response.data
    },

    /**
     * 裁剪视频
     */
    trim: async (options: VideoProcessOptions): Promise<ProcessResponse> => {
        const response = await apiClient.post<ProcessResponse>(
            API_ENDPOINTS.VIDEO.TRIM,
            options
        )
        return response.data
    },

    /**
     * 合并视频
     */
    merge: async (fileIds: string[]): Promise<ProcessResponse> => {
        const response = await apiClient.post<ProcessResponse>(
            API_ENDPOINTS.VIDEO.MERGE,
            { fileIds }
        )
        return response.data
    },

    /**
     * 提取音频
     */
    extractAudio: async (options: VideoProcessOptions): Promise<ProcessResponse> => {
        const response = await apiClient.post<ProcessResponse>(
            API_ENDPOINTS.VIDEO.EXTRACT_AUDIO,
            options
        )
        return response.data
    },

    /**
     * 转换为 GIF
     */
    toGif: async (options: VideoProcessOptions): Promise<ProcessResponse> => {
        const response = await apiClient.post<ProcessResponse>(
            API_ENDPOINTS.VIDEO.TO_GIF,
            options
        )
        return response.data
    }
}

