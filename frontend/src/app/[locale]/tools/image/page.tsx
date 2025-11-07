'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Header from '@/components/layout/Header'
import FileUploader from '@/components/features/file-upload/FileUploader'
import { imageAPI, jobAPI } from '@/lib/api'
import {
    Download,
    CheckCircle,
    Image as ImageIcon,
    Maximize2,
    Minimize2,
    Crop,
    FileImage,
    AlertCircle,
    History,
    Trash2
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

function ImageProcessContent() {
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
    const [processType, setProcessType] = useState('convert')
    const [processing, setProcessing] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [error, setError] = useState('')
    const [progress, setProgress] = useState(0)
    const [historyResults, setHistoryResults] = useState<any[]>([])
    const [activeTab, setActiveTab] = useState('process')

    const [convertOptions, setConvertOptions] = useState({
        outputFormat: 'png',
        quality: '85'
    })

    const [resizeOptions, setResizeOptions] = useState({
        mode: 'scale',
        width: '',
        height: '',
        scale: '50',
        keepRatio: true
    })

    const [compressOptions, setCompressOptions] = useState({
        quality: '85',
        enableResize: false,
        resizeScale: '80'
    })

    const [cropOptions] = useState({
        mode: 'preset',
        preset: '1:1',
        width: '',
        height: '',
        x: '0',
        y: '0'
    })

    const handleUploadSuccess = (fileInfo: any) => {
        const files = Array.isArray(fileInfo) ? fileInfo : [fileInfo]
        setUploadedFiles(files)
        setResults([])
        setError('')
        setProgress(0)
    }

    const handleProcess = async () => {
        if (uploadedFiles.length === 0) {
            setError('请先上传文件')
            return
        }

        setProcessing(true)
        setError('')
        setProgress(0)
        const processedResults = []

        try {
            for (let i = 0; i < uploadedFiles.length; i++) {
                const file = uploadedFiles[i]
                let response

                switch (processType) {
                    case 'convert':
                        response = await imageAPI.convert({
                            fileId: file.fileId,
                            outputFormat: convertOptions.outputFormat
                        })
                        break
                    case 'resize':
                        if (resizeOptions.mode === 'scale') {
                            response = await imageAPI.resize({
                                fileId: file.fileId,
                                scale: parseInt(resizeOptions.scale),
                                quality: parseInt(convertOptions.quality)
                            })
                        } else {
                            response = await imageAPI.resize({
                                fileId: file.fileId,
                                width: resizeOptions.width ? parseInt(resizeOptions.width) : undefined,
                                height: resizeOptions.height ? parseInt(resizeOptions.height) : undefined,
                                quality: parseInt(convertOptions.quality)
                            })
                        }
                        break
                    case 'compress':
                        response = await imageAPI.resize({
                            fileId: file.fileId,
                            scale: compressOptions.enableResize ? parseInt(compressOptions.resizeScale) : 100,
                            quality: parseInt(compressOptions.quality)
                        })
                        break
                    default:
                        throw new Error('Unknown process type')
                }

                processedResults.push({ ...response.data, originalFile: file.originalName })
                setProgress(Math.round(((i + 1) / uploadedFiles.length) * 100))
            }

            setResults(processedResults)
            // 将当前结果添加到历史记录
            setHistoryResults((prev) => [...processedResults, ...prev])
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

    const handleRemoveFile = (index: number) => {
        setUploadedFiles((files) => files.filter((_, i) => i !== index))
    }

    const handleClearHistory = () => {
        setHistoryResults([])
    }

    const handleRemoveHistoryItem = (index: number) => {
        setHistoryResults((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div>
            <Header />
            <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-purple-50'>
                <div className='container mx-auto px-4 py-6 max-w-[1600px]'>
                    <div className='flex items-center gap-3 mb-6'>
                        <ImageIcon className='h-7 w-7 text-primary-600' />
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>图片处理工具</h1>
                            <p className='text-sm text-gray-600'>支持格式转换、调整大小、压缩、裁剪</p>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 xl:grid-cols-4 gap-4'>
                        <div className='xl:col-span-1'>
                            <Card className='sticky top-20'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg'>上传文件</CardTitle>
                                    <CardDescription className='text-xs'>支持 JPG, PNG, WebP, GIF, BMP</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FileUploader
                                        onUploadSuccess={handleUploadSuccess}
                                        accept={{
                                            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
                                        }}
                                        maxSize={50 * 1024 * 1024}
                                        multiple={true}
                                    />
                                    {uploadedFiles.length > 0 && (
                                        <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                                            <div className='flex items-center gap-2 text-sm text-blue-900'>
                                                <FileImage className='h-4 w-4' />
                                                <span className='font-medium'>
                                                    已选择 {uploadedFiles.length} 个文件
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className='xl:col-span-3'>
                            <Card>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg'>处理选项</CardTitle>
                                    <CardDescription className='text-xs'>选择处理类型并配置参数</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className='grid w-full grid-cols-2 h-auto p-1 mb-4'>
                                            <TabsTrigger value='process' className='text-sm px-3 py-2'>
                                                <FileImage className='h-4 w-4 mr-2' />
                                                处理文件
                                            </TabsTrigger>
                                            <TabsTrigger value='history' className='text-sm px-3 py-2'>
                                                <History className='h-4 w-4 mr-2' />
                                                历史记录
                                            </TabsTrigger>
                                        </TabsList>

                                        <TabsContent value='process' className='space-y-4 mt-0'>
                                            <Tabs value={processType} onValueChange={setProcessType}>
                                                <TabsList className='grid w-full grid-cols-4 h-auto p-1'>
                                                    <TabsTrigger value='convert' className='text-sm px-3 py-1.5'>
                                                        <FileImage className='h-4 w-4 mr-1' />
                                                        格式转换
                                                    </TabsTrigger>
                                                    <TabsTrigger value='resize' className='text-sm px-3 py-1.5'>
                                                        <Maximize2 className='h-4 w-4 mr-1' />
                                                        调整大小
                                                    </TabsTrigger>
                                                    <TabsTrigger value='compress' className='text-sm px-3 py-1.5'>
                                                        <Minimize2 className='h-4 w-4 mr-1' />
                                                        压缩
                                                    </TabsTrigger>
                                                    <TabsTrigger value='crop' className='text-sm px-3 py-1.5'>
                                                        <Crop className='h-4 w-4 mr-1' />
                                                        裁剪
                                                    </TabsTrigger>
                                                </TabsList>

                                                <TabsContent value='convert' className='space-y-4 mt-4'>
                                                    <div className='space-y-2'>
                                                        <Label htmlFor='output-format' className='text-sm'>
                                                            输出格式
                                                        </Label>
                                                        <Select
                                                            value={convertOptions.outputFormat}
                                                            onValueChange={(value) =>
                                                                setConvertOptions({
                                                                    ...convertOptions,
                                                                    outputFormat: value
                                                                })
                                                            }
                                                        >
                                                            <SelectTrigger id='output-format'>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='jpg'>JPG</SelectItem>
                                                                <SelectItem value='png'>PNG</SelectItem>
                                                                <SelectItem value='webp'>WebP</SelectItem>
                                                                <SelectItem value='gif'>GIF</SelectItem>
                                                                <SelectItem value='bmp'>BMP</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className='space-y-2'>
                                                        <Label htmlFor='quality' className='text-sm'>
                                                            质量 (1-100)
                                                        </Label>
                                                        <Input
                                                            id='quality'
                                                            type='number'
                                                            min='1'
                                                            max='100'
                                                            value={convertOptions.quality}
                                                            onChange={(e) =>
                                                                setConvertOptions({
                                                                    ...convertOptions,
                                                                    quality: e.target.value
                                                                })
                                                            }
                                                        />
                                                        <p className='text-xs text-gray-500'>
                                                            建议值：高质量 90，标准 85，中等 75
                                                        </p>
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value='resize' className='space-y-4 mt-4'>
                                                    <div className='space-y-2'>
                                                        <Label className='text-sm'>缩放模式</Label>
                                                        <Select
                                                            value={resizeOptions.mode}
                                                            onValueChange={(value) =>
                                                                setResizeOptions({ ...resizeOptions, mode: value })
                                                            }
                                                        >
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='scale'>按比例缩放</SelectItem>
                                                                <SelectItem value='fixedWidth'>固定宽度</SelectItem>
                                                                <SelectItem value='fixedHeight'>固定高度</SelectItem>
                                                                <SelectItem value='fixedSize'>固定尺寸</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {resizeOptions.mode === 'scale' && (
                                                        <div className='space-y-2'>
                                                            <Label htmlFor='scale' className='text-sm'>
                                                                缩放比例 (%)
                                                            </Label>
                                                            <Input
                                                                id='scale'
                                                                type='number'
                                                                value={resizeOptions.scale}
                                                                onChange={(e) =>
                                                                    setResizeOptions({
                                                                        ...resizeOptions,
                                                                        scale: e.target.value
                                                                    })
                                                                }
                                                                placeholder='50'
                                                            />
                                                            <p className='text-xs text-gray-500'>
                                                                例如：50 表示缩放到原来的 50%
                                                            </p>
                                                        </div>
                                                    )}

                                                    {resizeOptions.mode !== 'scale' && (
                                                        <div className='grid grid-cols-2 gap-4'>
                                                            {(resizeOptions.mode === 'fixedWidth' ||
                                                                resizeOptions.mode === 'fixedSize') && (
                                                                <div className='space-y-2'>
                                                                    <Label htmlFor='width' className='text-sm'>
                                                                        宽度 (像素)
                                                                    </Label>
                                                                    <Input
                                                                        id='width'
                                                                        type='number'
                                                                        value={resizeOptions.width}
                                                                        onChange={(e) =>
                                                                            setResizeOptions({
                                                                                ...resizeOptions,
                                                                                width: e.target.value
                                                                            })
                                                                        }
                                                                        placeholder='800'
                                                                    />
                                                                </div>
                                                            )}

                                                            {(resizeOptions.mode === 'fixedHeight' ||
                                                                resizeOptions.mode === 'fixedSize') && (
                                                                <div className='space-y-2'>
                                                                    <Label htmlFor='height' className='text-sm'>
                                                                        高度 (像素)
                                                                    </Label>
                                                                    <Input
                                                                        id='height'
                                                                        type='number'
                                                                        value={resizeOptions.height}
                                                                        onChange={(e) =>
                                                                            setResizeOptions({
                                                                                ...resizeOptions,
                                                                                height: e.target.value
                                                                            })
                                                                        }
                                                                        placeholder='600'
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </TabsContent>

                                                <TabsContent value='compress' className='space-y-4 mt-4'>
                                                    <div className='space-y-2'>
                                                        <Label htmlFor='compress-quality' className='text-sm'>
                                                            压缩质量 (1-100)
                                                        </Label>
                                                        <Input
                                                            id='compress-quality'
                                                            type='number'
                                                            min='1'
                                                            max='100'
                                                            value={compressOptions.quality}
                                                            onChange={(e) =>
                                                                setCompressOptions({
                                                                    ...compressOptions,
                                                                    quality: e.target.value
                                                                })
                                                            }
                                                        />
                                                        <div className='flex gap-2 flex-wrap'>
                                                            {[
                                                                { label: '高质量', value: '90' },
                                                                { label: '标准', value: '85' },
                                                                { label: '中等', value: '75' },
                                                                { label: '低质量', value: '60' }
                                                            ].map((preset) => (
                                                                <Button
                                                                    key={preset.value}
                                                                    variant='outline'
                                                                    size='sm'
                                                                    onClick={() =>
                                                                        setCompressOptions({
                                                                            ...compressOptions,
                                                                            quality: preset.value
                                                                        })
                                                                    }
                                                                >
                                                                    {preset.label}
                                                                </Button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <Separator />

                                                    <div className='space-y-2'>
                                                        <div className='flex items-center gap-2'>
                                                            <input
                                                                type='checkbox'
                                                                id='enable-resize'
                                                                checked={compressOptions.enableResize}
                                                                onChange={(e) =>
                                                                    setCompressOptions({
                                                                        ...compressOptions,
                                                                        enableResize: e.target.checked
                                                                    })
                                                                }
                                                                className='rounded'
                                                            />
                                                            <Label htmlFor='enable-resize'>同时缩小尺寸</Label>
                                                        </div>

                                                        {compressOptions.enableResize && (
                                                            <div className='space-y-2 pl-6'>
                                                                <Label htmlFor='resize-scale' className='text-sm'>
                                                                    缩放比例 (%)
                                                                </Label>
                                                                <Input
                                                                    id='resize-scale'
                                                                    type='number'
                                                                    value={compressOptions.resizeScale}
                                                                    onChange={(e) =>
                                                                        setCompressOptions({
                                                                            ...compressOptions,
                                                                            resizeScale: e.target.value
                                                                        })
                                                                    }
                                                                    placeholder='80'
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TabsContent>

                                                <TabsContent value='crop' className='space-y-4 mt-4'>
                                                    <Alert>
                                                        <AlertCircle className='h-4 w-4' />
                                                        <AlertDescription className='text-sm'>
                                                            裁剪功能即将推出，敬请期待！
                                                        </AlertDescription>
                                                    </Alert>

                                                    <div className='space-y-2 opacity-50 pointer-events-none'>
                                                        <Label className='text-sm'>裁剪模式</Label>
                                                        <Select value={cropOptions.mode}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value='preset'>预设比例</SelectItem>
                                                                <SelectItem value='custom'>自定义区域</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </TabsContent>
                                            </Tabs>

                                            <Separator className='my-4' />

                                            <div className='space-y-3'>
                                                {processing && (
                                                    <div className='space-y-2'>
                                                        <div className='flex justify-between text-xs text-gray-600'>
                                                            <span>处理进度</span>
                                                            <span className='font-medium'>{progress}%</span>
                                                        </div>
                                                        <Progress value={progress} />
                                                    </div>
                                                )}

                                                <Button
                                                    onClick={handleProcess}
                                                    disabled={
                                                        uploadedFiles.length === 0 ||
                                                        processing ||
                                                        processType === 'crop'
                                                    }
                                                    className='w-full'
                                                    size='default'
                                                >
                                                    {processing
                                                        ? `处理中... (${Math.round(
                                                              (progress / 100) * uploadedFiles.length
                                                          )}/${uploadedFiles.length})`
                                                        : `开始处理 (${uploadedFiles.length} 个文件)`}
                                                </Button>
                                            </div>

                                            {error && (
                                                <Alert variant='destructive' className='mt-3'>
                                                    <AlertCircle className='h-4 w-4' />
                                                    <AlertDescription className='text-sm'>{error}</AlertDescription>
                                                </Alert>
                                            )}

                                            {results.length > 0 && (
                                                <div className='mt-4 space-y-3'>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center gap-2'>
                                                            <CheckCircle className='h-5 w-5 text-green-600' />
                                                            <span className='text-sm font-semibold text-green-900'>
                                                                处理完成 ({results.length})
                                                            </span>
                                                        </div>
                                                        <Button
                                                            size='sm'
                                                            variant='outline'
                                                            onClick={() => {
                                                                results.forEach((result) =>
                                                                    handleDownload(result.jobId)
                                                                )
                                                            }}
                                                            className='text-xs'
                                                        >
                                                            <Download className='h-3 w-3 mr-1' />
                                                            全部下载
                                                        </Button>
                                                    </div>
                                                    <div className='grid grid-cols-1 gap-2'>
                                                        {results.map((result, index) => (
                                                            <div
                                                                key={index}
                                                                className='flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg'
                                                            >
                                                                <div className='flex items-center gap-3 flex-1 min-w-0'>
                                                                    <div className='flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white font-semibold text-xs flex-shrink-0'>
                                                                        {index + 1}
                                                                    </div>
                                                                    <span className='text-sm text-gray-900 truncate'>
                                                                        {result.originalFile}
                                                                    </span>
                                                                </div>
                                                                <Button
                                                                    size='sm'
                                                                    onClick={() => handleDownload(result.jobId)}
                                                                    className='bg-green-600 hover:bg-green-700 flex-shrink-0'
                                                                >
                                                                    <Download className='h-4 w-4 mr-1' />
                                                                    下载
                                                                </Button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </TabsContent>

                                        <TabsContent value='history' className='space-y-4 mt-0'>
                                            <div className='flex items-center justify-between mb-4'>
                                                <div className='flex items-center gap-2'>
                                                    <History className='h-5 w-5 text-gray-600' />
                                                    <span className='text-sm font-semibold text-gray-900'>
                                                        历史记录 ({historyResults.length})
                                                    </span>
                                                </div>
                                                {historyResults.length > 0 && (
                                                    <Button
                                                        size='sm'
                                                        variant='outline'
                                                        onClick={handleClearHistory}
                                                        className='text-xs text-red-600 hover:text-red-700'
                                                    >
                                                        <Trash2 className='h-3 w-3 mr-1' />
                                                        清空历史
                                                    </Button>
                                                )}
                                            </div>

                                            {historyResults.length === 0 ? (
                                                <div className='text-center py-12'>
                                                    <History className='h-12 w-12 text-gray-300 mx-auto mb-3' />
                                                    <p className='text-sm text-gray-500'>暂无历史记录</p>
                                                    <p className='text-xs text-gray-400 mt-1'>
                                                        处理完成的文件会显示在这里
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className='space-y-2 max-h-[600px] overflow-y-auto pr-1'>
                                                    {historyResults.map((result, index) => (
                                                        <div
                                                            key={index}
                                                            className='flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group'
                                                        >
                                                            <div className='flex items-center gap-3 flex-1 min-w-0'>
                                                                <FileImage className='h-4 w-4 text-gray-400 flex-shrink-0' />
                                                                <span className='text-sm text-gray-900 truncate'>
                                                                    {result.originalFile}
                                                                </span>
                                                            </div>
                                                            <div className='flex items-center gap-2'>
                                                                <Button
                                                                    size='sm'
                                                                    variant='ghost'
                                                                    onClick={() => handleDownload(result.jobId)}
                                                                    className='flex-shrink-0 w-9 h-9 p-0 hover:bg-primary-50'
                                                                    title='下载文件'
                                                                >
                                                                    <Download className='h-4 w-4 text-primary-600' />
                                                                </Button>
                                                                <Button
                                                                    size='sm'
                                                                    variant='ghost'
                                                                    onClick={() => handleRemoveHistoryItem(index)}
                                                                    className='opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 p-0 hover:bg-red-50'
                                                                    title='删除'
                                                                >
                                                                    <Trash2 className='h-4 w-4 text-red-500' />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
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
