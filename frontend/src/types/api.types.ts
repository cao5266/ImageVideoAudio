/**
 * API 通用类型定义
 */

export interface ApiResponse<T = any> {
    data: T
    message?: string
    status: number
}

export interface ApiError {
    error: string
    message?: string
    statusCode: number
}

export interface PaginationParams {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

