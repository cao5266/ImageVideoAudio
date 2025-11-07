'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import FileUploader from '@/components/features/file-upload/FileUploader'
import { videoAPI, jobAPI } from '@/lib/api'
import { Download, CheckCircle } from 'lucide-react'

function VideoProcessContent() {
    const [uploadedFile, setUploadedFile] = useState<any>(null)
    const [processType, setProcessType] = useState('convert')
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState('')

    // 处理选项状态
    const [options, setOptions] = useState({
        // 格式转换
        outputFormat: 'mp4',
        videoCodec: 'libx264',
        audioCodec: 'aac',
        // 压缩
        videoBitrate: '1000k',
        audioBitrate: '128k',
        width: '',
        height: '',
        fps: '',
        // 裁剪
        startTime: '',
        duration: '',
        // 旋转
        angle: '90'
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
                    response = await videoAPI.convert({
                        fileId: uploadedFile.fileId,
                        outputFormat: options.outputFormat,
                        videoCodec: options.videoCodec,
                        audioCodec: options.audioCodec
                    })
                    break
                case 'compress':
                    response = await videoAPI.compress({
                        fileId: uploadedFile.fileId,
                        videoBitrate: options.videoBitrate,
                        audioBitrate: options.audioBitrate,
                        width: options.width ? parseInt(options.width) : undefined,
                        height: options.height ? parseInt(options.height) : undefined,
                        fps: options.fps ? parseInt(options.fps) : undefined
                    })
                    break
                case 'cut':
                    response = await videoAPI.cut({
                        fileId: uploadedFile.fileId,
                        startTime: options.startTime,
                        duration: options.duration
                    })
                    break
                case 'rotate':
                    response = await videoAPI.rotate({
                        fileId: uploadedFile.fileId,
                        angle: parseInt(options.angle)
                    })
                    break
                case 'extractAudio':
                    response = await videoAPI.extractAudio({
                        fileId: uploadedFile.fileId,
                        outputFormat: 'mp3'
                    })
                    break
                case 'toGif':
                    response = await videoAPI.toGif({
                        fileId: uploadedFile.fileId,
                        startTime: options.startTime,
                        duration: options.duration,
                        width: options.width ? parseInt(options.width) : undefined,
                        fps: options.fps ? parseInt(options.fps) : 10
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
                <h1 className='text-3xl font-bold text-gray-900 mb-8'>视频处理</h1>

                {/* File Upload */}
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>1. 上传视频</h2>
                    <FileUploader
                        onUploadSuccess={handleUploadSuccess}
                        accept={{
                            'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv']
                        }}
                    />
                </div>

                {/* Process Type Selection */}
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>2. 选择处理类型</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {[
                            { value: 'convert', label: '格式转换' },
                            { value: 'compress', label: '视频压缩' },
                            { value: 'cut', label: '视频裁剪' },
                            { value: 'rotate', label: '旋转视频' },
                            { value: 'extractAudio', label: '提取音频' },
                            { value: 'toGif', label: '转 GIF' }
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
                        <div className='space-y-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>输出格式</label>
                                <select
                                    value={options.outputFormat}
                                    onChange={(e) => setOptions({ ...options, outputFormat: e.target.value })}
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                >
                                    <option value='mp4'>MP4</option>
                                    <option value='avi'>AVI</option>
                                    <option value='mov'>MOV</option>
                                    <option value='mkv'>MKV</option>
                                    <option value='webm'>WebM</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {processType === 'compress' && (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>视频码率</label>
                                <input
                                    type='text'
                                    value={options.videoBitrate}
                                    onChange={(e) => setOptions({ ...options, videoBitrate: e.target.value })}
                                    placeholder='1000k'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>音频码率</label>
                                <input
                                    type='text'
                                    value={options.audioBitrate}
                                    onChange={(e) => setOptions({ ...options, audioBitrate: e.target.value })}
                                    placeholder='128k'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>宽度 (可选)</label>
                                <input
                                    type='number'
                                    value={options.width}
                                    onChange={(e) => setOptions({ ...options, width: e.target.value })}
                                    placeholder='1280'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>高度 (可选)</label>
                                <input
                                    type='number'
                                    value={options.height}
                                    onChange={(e) => setOptions({ ...options, height: e.target.value })}
                                    placeholder='720'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                        </div>
                    )}

                    {processType === 'cut' && (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    开始时间 (格式: 00:00:10)
                                </label>
                                <input
                                    type='text'
                                    value={options.startTime}
                                    onChange={(e) => setOptions({ ...options, startTime: e.target.value })}
                                    placeholder='00:00:10'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    持续时间 (格式: 00:00:30)
                                </label>
                                <input
                                    type='text'
                                    value={options.duration}
                                    onChange={(e) => setOptions({ ...options, duration: e.target.value })}
                                    placeholder='00:00:30'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                        </div>
                    )}

                    {processType === 'rotate' && (
                        <div>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>旋转角度</label>
                            <select
                                value={options.angle}
                                onChange={(e) => setOptions({ ...options, angle: e.target.value })}
                                className='w-full border border-gray-300 rounded-lg px-4 py-2'
                            >
                                <option value='90'>90° 顺时针</option>
                                <option value='180'>180°</option>
                                <option value='270'>270° 顺时针</option>
                            </select>
                        </div>
                    )}

                    {processType === 'toGif' && (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>开始时间 (可选)</label>
                                <input
                                    type='text'
                                    value={options.startTime}
                                    onChange={(e) => setOptions({ ...options, startTime: e.target.value })}
                                    placeholder='00:00:00'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>持续时间 (可选)</label>
                                <input
                                    type='text'
                                    value={options.duration}
                                    onChange={(e) => setOptions({ ...options, duration: e.target.value })}
                                    placeholder='00:00:05'
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
                        <p className='text-green-800 mb-4'>文件已成功处理，点击下方按钮下载结果</p>
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

export default function VideoProcessPage() {
    return (
        <ProtectedRoute>
            <VideoProcessContent />
        </ProtectedRoute>
    )
}
