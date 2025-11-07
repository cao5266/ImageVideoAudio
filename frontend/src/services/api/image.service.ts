/**
 * 图片处理服务
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from '@/constants'
import type { ImageProcessOptions, ProcessResponse } from '@/types'

export const imageService = {
    /**
     * 图片格式转换
     */
    convert: async (options: ImageProcessOptions): Promise<ProcessResponse> => {
        const response = await apiClient.post<ProcessResponse>(
            API_ENDPOINTS.IMAGE.CONVERT,
            options
        )
        return response.data
    },

    /**
     * 调整图片大小
     */
    resize: async (options: ImageProcessOptions): Promise<ProcessResponse> => {
        const response = await apiClient.post<ProcessResponse>(
            API_ENDPOINTS.IMAGE.RESIZE,
            options
        )
        return response.data
    }
}

