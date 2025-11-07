/**
 * 格式化工具函数
 */

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, format: 'full' | 'date' | 'time' = 'full'): string {
    const d = new Date(date)

    if (format === 'date') {
        return d.toLocaleDateString('zh-CN')
    }

    if (format === 'time') {
        return d.toLocaleTimeString('zh-CN')
    }

    return d.toLocaleString('zh-CN')
}

/**
 * 格式化持续时间（秒）
 */
export function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = Math.floor(seconds % 60)

    const parts: string[] = []

    if (hours > 0) parts.push(`${hours}h`)
    if (minutes > 0) parts.push(`${minutes}m`)
    if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)

    return parts.join(' ')
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text
    return `${text.slice(0, maxLength)}...`
}

