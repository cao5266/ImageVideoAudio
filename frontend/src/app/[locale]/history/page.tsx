'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import { jobAPI } from '@/lib/api'
import { Download, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'

function HistoryContent() {
    const [jobs, setJobs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    useEffect(() => {
        fetchHistory()
    }, [page])

    const fetchHistory = async () => {
        try {
            setLoading(true)
            const response = await jobAPI.getHistory(page, 10)
            setJobs(response.data.jobs)
            setTotalPages(response.data.pagination.pages)
        } catch (err: any) {
            setError(err.response?.data?.error || '获取历史记录失败')
        } finally {
            setLoading(false)
        }
    }

    const handleDownload = async (jobId: number) => {
        try {
            await jobAPI.download(jobId)
        } catch (err: any) {
            setError('下载失败，请重试')
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className='h-5 w-5 text-green-600' />
            case 'processing':
                return <Loader className='h-5 w-5 text-blue-600 animate-spin' />
            case 'failed':
                return <XCircle className='h-5 w-5 text-red-600' />
            default:
                return <Clock className='h-5 w-5 text-gray-600' />
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'completed':
                return '已完成'
            case 'processing':
                return '处理中'
            case 'failed':
                return '失败'
            case 'pending':
                return '等待中'
            default:
                return status
        }
    }

    const getJobTypeText = (jobType: string) => {
        const types: Record<string, string> = {
            video_convert: '视频转换',
            video_compress: '视频压缩',
            video_cut: '视频裁剪',
            video_merge: '视频合并',
            video_rotate: '视频旋转',
            extract_audio: '提取音频',
            video_to_gif: '视频转GIF',
            add_watermark: '添加水印',
            image_convert: '图片转换',
            image_resize: '图片调整'
        }
        return types[jobType] || jobType
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('zh-CN')
    }

    return (
        <div className='min-h-screen bg-gray-50'>
            <Header />

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
                <h1 className='text-3xl font-bold text-gray-900 mb-8'>处理历史</h1>

                {error && (
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700'>{error}</div>
                )}

                {loading ? (
                    <div className='flex justify-center items-center py-12'>
                        <Loader className='h-8 w-8 text-primary-600 animate-spin' />
                        <span className='ml-3 text-gray-600'>加载中...</span>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className='bg-white rounded-lg shadow-md p-12 text-center'>
                        <p className='text-gray-600 mb-4'>暂无处理记录</p>
                        <a href='/dashboard' className='text-primary-600 hover:text-primary-700 font-semibold'>
                            开始处理文件
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className='hidden md:block bg-white rounded-lg shadow-md overflow-hidden'>
                            <table className='min-w-full divide-y divide-gray-200'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            处理类型
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            原始文件
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            状态
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            创建时间
                                        </th>
                                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                    {jobs.map((job) => (
                                        <tr key={job.id} className='hover:bg-gray-50'>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span className='text-sm font-medium text-gray-900'>
                                                    {getJobTypeText(job.jobType)}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <span className='text-sm text-gray-600'>{job.originalFile}</span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='flex items-center space-x-2'>
                                                    {getStatusIcon(job.status)}
                                                    <span className='text-sm text-gray-900'>
                                                        {getStatusText(job.status)}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                                                {formatDate(job.createdAt)}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                {job.status === 'completed' && job.outputFile && (
                                                    <button
                                                        onClick={() => handleDownload(job.id)}
                                                        className='flex items-center space-x-1 text-primary-600 hover:text-primary-700'
                                                    >
                                                        <Download className='h-4 w-4' />
                                                        <span className='text-sm'>下载</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className='md:hidden space-y-4'>
                            {jobs.map((job) => (
                                <div key={job.id} className='bg-white rounded-lg shadow-md p-4 space-y-3'>
                                    <div className='flex items-center justify-between'>
                                        <span className='font-semibold text-gray-900'>
                                            {getJobTypeText(job.jobType)}
                                        </span>
                                        <div className='flex items-center space-x-2'>
                                            {getStatusIcon(job.status)}
                                            <span className='text-sm text-gray-900'>{getStatusText(job.status)}</span>
                                        </div>
                                    </div>
                                    <p className='text-sm text-gray-600'>文件: {job.originalFile}</p>
                                    <p className='text-xs text-gray-500'>{formatDate(job.createdAt)}</p>
                                    {job.status === 'completed' && job.outputFile && (
                                        <button
                                            onClick={() => handleDownload(job.id)}
                                            className='w-full flex items-center justify-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700'
                                        >
                                            <Download className='h-4 w-4' />
                                            <span>下载</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className='mt-6 flex justify-center space-x-2'>
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                                >
                                    上一页
                                </button>
                                <span className='px-4 py-2'>
                                    第 {page} / {totalPages} 页
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className='px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
                                >
                                    下一页
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    )
}

export default function HistoryPage() {
    return (
        <ProtectedRoute>
            <HistoryContent />
        </ProtectedRoute>
    )
}
