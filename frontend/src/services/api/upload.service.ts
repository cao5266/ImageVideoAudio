/**
 * 文件上传服务
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from '@/constants'
import type { UploadedFile, FileUploadResponse } from '@/types'

export const uploadService = {
    /**
     * 上传单个文件
     */
    uploadSingle: async (file: File): Promise<UploadedFile> => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await apiClient.post<FileUploadResponse>(
            API_ENDPOINTS.UPLOAD.SINGLE,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        return response.data.file!
    },

    /**
     * 上传多个文件
     */
    uploadMultiple: async (files: File[]): Promise<UploadedFile[]> => {
        const formData = new FormData()
        files.forEach((file) => {
            formData.append('files', file)
        })

        const response = await apiClient.post<FileUploadResponse>(
            API_ENDPOINTS.UPLOAD.MULTIPLE,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )

        return response.data.files!
    }
}

