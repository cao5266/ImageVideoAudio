'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import ToolLayout from '@/components/layout/ToolLayout'
import FileUploader from '@/components/features/file-upload/FileUploader'
import { Music } from 'lucide-react'

function AudioProcessContent() {
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
    const [currentStep, setCurrentStep] = useState(0)

    const handleUploadSuccess = (fileInfo: any) => {
        const files = Array.isArray(fileInfo) ? fileInfo : [fileInfo]
        setUploadedFiles(files)
        setCurrentStep(1)
    }

    return (
        <ToolLayout title='音频处理' currentStep={currentStep}>
            {/* 步骤 1: 文件上传 */}
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>上传音频文件</h2>
                <FileUploader
                    onUploadSuccess={handleUploadSuccess}
                    accept={{
                        'audio/*': ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac']
                    }}
                    maxSize={100 * 1024 * 1024}
                    multiple={true}
                />
                <p className='mt-2 text-sm text-gray-500'>💡 支持批量上传多个音频文件</p>
            </div>

            {/* 提示信息 */}
            {uploadedFiles.length === 0 && (
                <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 text-center'>
                    <Music className='h-12 w-12 text-blue-500 mx-auto mb-4' />
                    <h3 className='text-lg font-semibold text-blue-900 mb-2'>音频处理功能</h3>
                    <p className='text-blue-700'>即将支持音频格式转换、压缩、裁剪、合并等功能</p>
                </div>
            )}

            {/* 已上传文件列表 */}
            {uploadedFiles.length > 0 && (
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>已上传的文件</h2>
                    <div className='space-y-2'>
                        {uploadedFiles.map((file, index) => (
                            <div key={index} className='flex items-center justify-between bg-gray-50 p-3 rounded-lg'>
                                <div className='flex items-center space-x-3'>
                                    <Music className='h-5 w-5 text-gray-500' />
                                    <span className='text-sm text-gray-700'>{file.originalName}</span>
                                </div>
                                <span className='text-xs text-gray-500'>
                                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className='mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
                        <p className='text-yellow-800 text-sm'>📝 音频处理功能正在开发中，敬请期待！</p>
                    </div>
                </div>
            )}
        </ToolLayout>
    )
}

export default function AudioProcessPage() {
    return (
        <ProtectedRoute>
            <AudioProcessContent />
        </ProtectedRoute>
    )
}
