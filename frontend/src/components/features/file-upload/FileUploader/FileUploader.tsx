'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, X, CheckCircle } from 'lucide-react'
import { uploadService } from '@/services/api'
import { formatFileSize } from '@/utils'
import type { UploadedFile } from '@/types'

interface FileUploaderProps {
    onUploadSuccess: (fileInfo: UploadedFile | UploadedFile[]) => void
    accept?: Record<string, string[]>
    maxSize?: number
    multiple?: boolean
}

export default function FileUploader({
    onUploadSuccess,
    accept,
    maxSize = 500 * 1024 * 1024,
    multiple = false
}: FileUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
    const [error, setError] = useState('')

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            setError('')
            setUploading(true)

            try {
                if (multiple) {
                    const files = await uploadService.uploadMultiple(acceptedFiles)
                    setUploadedFiles(files)
                    onUploadSuccess(files)
                } else {
                    const file = await uploadService.uploadSingle(acceptedFiles[0])
                    setUploadedFiles([file])
                    onUploadSuccess(file)
                }
            } catch (err: any) {
                setError(err.response?.data?.error || '上传失败，请重试')
            } finally {
                setUploading(false)
            }
        },
        [multiple, onUploadSuccess]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple
    })

    const removeFile = (index: number) => {
        setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className='w-full'>
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'
                } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <input {...getInputProps()} disabled={uploading} />
                <Upload className='h-12 w-12 mx-auto text-gray-400 mb-4' />
                {isDragActive ? (
                    <p className='text-primary-600 font-semibold'>释放文件以上传...</p>
                ) : (
                    <>
                        <p className='text-gray-700 font-semibold mb-2'>拖拽文件到此处，或点击选择文件</p>
                        <p className='text-sm text-gray-500'>最大文件大小: {formatFileSize(maxSize)}</p>
                    </>
                )}
            </div>

            {error && <div className='mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700'>{error}</div>}

            {uploading && (
                <div className='mt-4 flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600'></div>
                    <span className='ml-3 text-gray-600'>上传中...</span>
                </div>
            )}

            {uploadedFiles.length > 0 && (
                <div className='mt-4 space-y-2'>
                    <h3 className='text-sm font-semibold text-gray-700'>已上传文件:</h3>
                    {uploadedFiles.map((file, index) => (
                        <div
                            key={index}
                            className='flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg'
                        >
                            <div className='flex items-center space-x-3'>
                                <CheckCircle className='h-5 w-5 text-green-600' />
                                <File className='h-5 w-5 text-gray-600' />
                                <div>
                                    <p className='text-sm font-medium text-gray-900'>{file.originalName}</p>
                                    <p className='text-xs text-gray-500'>{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            <button onClick={() => removeFile(index)} className='text-gray-400 hover:text-red-600'>
                                <X className='h-5 w-5' />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
