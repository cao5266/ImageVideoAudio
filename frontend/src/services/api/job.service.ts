/**
 * 任务服务
 */

import { apiClient } from './client'
import { API_ENDPOINTS } from '@/constants'
import type { ProcessingJob, JobStatusResponse } from '@/types'

export const jobService = {
    /**
     * 获取任务状态
     */
    getStatus: async (jobId: string): Promise<ProcessingJob> => {
        const response = await apiClient.get<JobStatusResponse>(`${API_ENDPOINTS.JOB.STATUS}/${jobId}`)
        return response.data.job
    },

    /**
     * 下载处理结果
     */
    download: async (jobId: string): Promise<void> => {
        const response = await apiClient.get(`${API_ENDPOINTS.JOB.DOWNLOAD}/${jobId}`, {
            responseType: 'blob'
        })

        // 从响应头获取文件名
        const contentDisposition = response.headers['content-disposition']
        let filename = `result-${jobId}`

        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/)
            if (filenameMatch) {
                filename = filenameMatch[1]
            }
        }

        // 创建下载链接
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
    },

    /**
     * 获取用户的所有任务
     */
    getAll: async (): Promise<ProcessingJob[]> => {
        const response = await apiClient.get<ProcessingJob[]>(API_ENDPOINTS.JOB.LIST)
        return response.data
    }
}

