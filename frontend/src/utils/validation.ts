/**
 * 验证工具函数
 */

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
    return emailRegex.test(email)
}

/**
 * 验证密码强度
 */
export function isValidPassword(password: string): {
    isValid: boolean
    errors: string[]
} {
    const errors: string[] = []

    if (password.length < 6) {
        errors.push('密码至少6个字符')
    }

    return {
        isValid: errors.length === 0,
        errors
    }
}

/**
 * 验证文件类型
 */
export function isValidFileType(file: File, acceptedTypes: Record<string, string[]>): boolean {
    const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`

    for (const extensions of Object.values(acceptedTypes)) {
        if (extensions.includes(fileExtension)) {
            return true
        }
    }

    return false
}

/**
 * 验证文件大小
 */
export function isValidFileSize(file: File, maxSize: number): boolean {
    return file.size <= maxSize
}

