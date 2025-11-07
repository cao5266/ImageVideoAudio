'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import ToolLayout from '@/components/layout/ToolLayout'
import FileUploader from '@/components/features/file-upload/FileUploader'
import { videoAPI, jobAPI } from '@/lib/api'
import { Download, CheckCircle } from 'lucide-react'

function VideoProcessContent() {
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
    const [processType, setProcessType] = useState('convert')
    const [processing, setProcessing] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [error, setError] = useState('')
    const [currentStep, setCurrentStep] = useState(0)

    const [options, setOptions] = useState({
        outputFormat: 'mp4',
        videoCodec: 'libx264',
        audioCodec: 'aac',
        videoBitrate: '1000k',
        audioBitrate: '128k',
        width: '',
        height: '',
        fps: '',
        startTime: '',
        duration: '',
        angle: '90'
    })

    const handleUploadSuccess = (fileInfo: any) => {
        const files = Array.isArray(fileInfo) ? fileInfo : [fileInfo]
        setUploadedFiles(files)
        setResults([])
        setError('')
        setCurrentStep(1)
    }

    const handleProcess = async () => {
        if (uploadedFiles.length === 0) {
            setError('请先上传文件')
            return
        }

        setProcessing(true)
        setError('')
        setCurrentStep(3)
        const processedResults = []

        try {
            for (const file of uploadedFiles) {
                let response

                switch (processType) {
                    case 'convert':
                        response = await videoAPI.convert({
                            fileId: file.fileId,
                            outputFormat: options.outputFormat,
                            videoCodec: options.videoCodec,
                            audioCodec: options.audioCodec
                        })
                        break
                    case 'compress':
                        response = await videoAPI.compress({
                            fileId: file.fileId,
                            videoBitrate: options.videoBitrate,
                            audioBitrate: options.audioBitrate,
                            width: options.width ? parseInt(options.width) : undefined,
                            height: options.height ? parseInt(options.height) : undefined,
                            fps: options.fps ? parseInt(options.fps) : undefined
                        })
                        break
                    case 'cut':
                        response = await videoAPI.cut({
                            fileId: file.fileId,
                            startTime: options.startTime,
                            duration: options.duration
                        })
                        break
                    case 'rotate':
                        response = await videoAPI.rotate({
                            fileId: file.fileId,
                            angle: parseInt(options.angle)
                        })
                        break
                    case 'extractAudio':
                        response = await videoAPI.extractAudio({
                            fileId: file.fileId,
                            outputFormat: 'mp3'
                        })
                        break
                    case 'toGif':
                        response = await videoAPI.toGif({
                            fileId: file.fileId,
                            startTime: options.startTime,
                            duration: options.duration,
                            width: options.width ? parseInt(options.width) : undefined,
                            fps: options.fps ? parseInt(options.fps) : 10
                        })
                        break
                    default:
                        throw new Error('Unknown process type')
                }

                processedResults.push({ ...response.data, originalFile: file.originalName })
            }

            setResults(processedResults)
        } catch (err: any) {
            setError(err.response?.data?.error || '处理失败，请重试')
        } finally {
            setProcessing(false)
        }
    }

    const handleDownload = async (jobId: number) => {
        try {
            await jobAPI.download(jobId)
        } catch (err: any) {
            setError('下载失败，请重试')
        }
    }

    const processTypes = [
        { value: 'convert', label: '格式转换' },
        { value: 'compress', label: '视频压缩' },
        { value: 'cut', label: '视频裁剪' },
        { value: 'rotate', label: '旋转视频' },
        { value: 'extractAudio', label: '提取音频' },
        { value: 'toGif', label: '转 GIF' }
    ]

    return (
        <ToolLayout title='视频处理' currentStep={currentStep}>
            {/* 步骤 1: 文件上传 */}
            <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>上传视频文件</h2>
                <FileUploader
                    onUploadSuccess={handleUploadSuccess}
                    accept={{
                        'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm', '.flv']
                    }}
                    multiple={true}
                />
                <p className='mt-2 text-sm text-gray-500'>💡 支持批量上传多个文件</p>
            </div>

            {/* 步骤 2: 选择处理类型 */}
            {uploadedFiles.length > 0 && (
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>选择处理类型</h2>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                        {processTypes.map((type) => (
                            <button
                                key={type.value}
                                onClick={() => {
                                    setProcessType(type.value)
                                    setCurrentStep(2)
                                }}
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
            )}

            {/* 步骤 3: 参数设置 */}
            {currentStep >= 2 && (
                <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
                    <h2 className='text-xl font-semibold text-gray-900 mb-4'>设置参数</h2>

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
                        </div>
                    )}

                    {processType === 'cut' && (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>开始时间</label>
                                <input
                                    type='text'
                                    value={options.startTime}
                                    onChange={(e) => setOptions({ ...options, startTime: e.target.value })}
                                    placeholder='00:00:10'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>持续时间</label>
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
                                <label className='block text-sm font-medium text-gray-700 mb-2'>开始时间</label>
                                <input
                                    type='text'
                                    value={options.startTime}
                                    onChange={(e) => setOptions({ ...options, startTime: e.target.value })}
                                    placeholder='00:00:00'
                                    className='w-full border border-gray-300 rounded-lg px-4 py-2'
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>持续时间</label>
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
            )}

            {/* Error Message */}
            {error && <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700'>{error}</div>}

            {/* Results */}
            {results.length > 0 && (
                <div className='bg-green-50 border border-green-200 rounded-lg p-6 mb-6'>
                    <div className='flex items-center mb-4'>
                        <CheckCircle className='h-6 w-6 text-green-600 mr-2' />
                        <h3 className='text-lg font-semibold text-green-900'>处理完成！({results.length} 个文件)</h3>
                    </div>
                    <div className='space-y-3'>
                        {results.map((result, index) => (
                            <div key={index} className='flex items-center justify-between bg-white p-3 rounded-lg'>
                                <span className='text-sm text-gray-700'>{result.originalFile}</span>
                                <button
                                    onClick={() => handleDownload(result.jobId)}
                                    className='flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700'
                                >
                                    <Download className='h-4 w-4' />
                                    <span>下载</span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Process Button */}
            <button
                onClick={handleProcess}
                disabled={uploadedFiles.length === 0 || processing}
                className='w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold'
            >
                {processing
                    ? `处理中... (${uploadedFiles.length} 个文件)`
                    : `开始处理 (${uploadedFiles.length} 个文件)`}
            </button>
        </ToolLayout>
    )
}

export default function VideoProcessPage() {
    return (
        <ProtectedRoute>
            <VideoProcessContent />
        </ProtectedRoute>
    )
}
