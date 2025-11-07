/**
 * API 服务统一导出
 */

export { apiClient } from './client'
export { authService } from './auth.service'
export { uploadService } from './upload.service'
export { imageService } from './image.service'
export { videoService } from './video.service'
export { jobService } from './job.service'

// 兼容旧代码的导出
import { authService } from './auth.service'
import { uploadService } from './upload.service'
import { imageService } from './image.service'
import { videoService } from './video.service'
import { jobService } from './job.service'

export const authAPI = authService
export const uploadAPI = uploadService
export const imageAPI = imageService
export const videoAPI = videoService
export const jobAPI = jobService


