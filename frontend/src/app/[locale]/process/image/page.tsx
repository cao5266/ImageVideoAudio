'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import FileUploader from '@/components/features/file-upload/FileUploader'
import { imageAPI, jobAPI } from '@/lib/api'
import { Download, CheckCircle } from 'lucide-react'

function ImageProcessContent() {
    const [uploadedFile, setUploadedFile] = useState<any>(null)
    const [processType, setProcessType] = useState('convert')
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    const [options, setOptions] = useState({
        outputFormat: 'png',
        width: '',
        height: '',
        scale: '',
        quality: '90'
    })

    const handleUploadSuccess = (fileInfo: any) => {
        setUploadedFile(fileInfo)
        setResult(null)
        setError('')
    }

    const handleProcess = async () => {
        if (!uploadedFile) {
            setError('请先上传文件')
            return
        }

        setProcessing(true)
        setError('')

        try {
            let response

            switch (processType) {
                case 'convert':
                    response = await imageAPI.convert({
                        fileId: uploadedFile.fileId,
                        outputFormat: options.outputFormat
                    })
                    break
                case 'resize':
                    response = await imageAPI.resize({
                        fileId: uploadedFile.fileId,
                        width: options.width ? parseInt(options.width) : undefined,
                        height: options.height ? parseInt(options.height) : undefined,
                        scale: options.scale ? parseInt(options.scale) : undefined,
                        quality: parseInt(options.quality)
                    })
                    break
                default:
                    throw new Error('Unknown process type')
            }

            setResult(response.data)
        } catch (err: any) {
            setError(err.response?.data?.error || '处理失败，请重试')
        } finally {
            setProcessing(false)
        }
    }

    const handleDownload = async () => {
        if (result?.jobId) {
            try {
                await jobAPI.download(result.jobId)
            } catch (err: any) {
                setError('下载失败，请重试')
            }
        }
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />

            <main className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <h1 className='text-3xl font-bold text-gray-900 mb-8'>图片处理</h1>

                {/* File Upload */}
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>1. 上传图片</h2>
                    <FileUploader
                        onUploadSuccess={handleUploadSuccess}
                        accept={{
                            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
                        }}
                        maxSize={50 * 1024 * 1024}
                    />
                </div>

                {/* Process Type Selection */}
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>2. 选择处理类型</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                        {[
                            { value: 'convert', label: '格式转换' },
                            { value: 'resize', label: '调整大小' }
                        ].map((type) => (
                            <button
                                key={type.value}
                                onClick={() => setProcessType(type.value)}
                                className={`p-3 rounded-lg border-2 transition-colors ${
                                    processType === type.value
                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                        : 'border-gray-300 hover:border-primary-300'
                                }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Process Options */}
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>3. 设置参数</h2>

                    {processType === 'convert' && (
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>输出格式</label>
                            <select
                                value={options.outputFormat}
                                onChange={(e) => setOptions({ ...options, outputFormat: e.target.value })}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2'
                            >
                                <option value='jpg'>JPG</option>
                                <option value='png'>PNG</option>
                                <option value='webp'>WebP</option>
                                <option value='gif'>GIF</option>
                                <option value='bmp'>BMP</option>
                            </select>
                        </div>
                    )}

                    {processType === 'resize' && (
                        <div className='space-y-4'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>宽度 (像素)</label>
                                    <input
                                        type='number'
                                        value={options.width}
                                        onChange={(e) => setOptions({ ...options, width: e.target.value })}
                                        placeholder='800'
                                        className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                    />
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>高度 (像素)</label>
                                    <input
                                        type='number'
                                        value={options.height}
                                        onChange={(e) => setOptions({ ...options, height: e.target.value })}
                                        placeholder='600'
                                        className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>或按比例缩放 (%)</label>
                                <input
                                    type='number'
                                    value={options.scale}
                                    onChange={(e) => setOptions({ ...options, scale: e.target.value })}
                                    placeholder='50'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                                <p className='text-xs text-gray-500 mt-1'>例如：50 表示缩放到原来的50%</p>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>质量 (1-100)</label>
                                <input
                                    type='number'
                                    value={options.quality}
                                    onChange={(e) => setOptions({ ...options, quality: e.target.value })}
                                    min='1'
                                    max='100'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700'>{error}</div>
                )}

                {/* Result */}
                {result && (
                    <div className='bg-green-50 border border-green-200 rounded-lg p-6 mb-6'>
                        <div className='flex items-center mb-4'>
                            <CheckCircle className='h-6 w-6 text-green-600 mr-2' />
                            <h3 className='text-lg font-semibold text-green-900'>处理完成！</h3>
                        </div>
                        <p className='text-green-800 mb-4'>图片已成功处理，点击下方按钮下载结果</p>
                        <button
                            onClick={handleDownload}
                            className='flex items-center space-x-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700'
                        >
                            <Download className='h-5 w-5' />
                            <span>下载处理结果</span>
                        </button>
                    </div>
                )}

                {/* Process Button */}
                <button
                    onClick={handleProcess}
                    disabled={!uploadedFile || processing}
                    className='w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold'
                >
                    {processing ? '处理中...' : '开始处理'}
                </button>
            </main>
        </div>
    )
}

export default function ImageProcessPage() {
    return (
        <ProtectedRoute>
            <ImageProcessContent />
        </ProtectedRoute>
    )
}
