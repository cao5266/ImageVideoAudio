const FFmpegService = require('../services/ffmpegService')
const { ProcessingJob } = require('../models')
const path = require('path')
const fs = require('fs')

// 视频格式转换
exports.convertVideo = async (req, res) => {
    try {
        const { fileId, outputFormat, videoCodec, audioCodec } = req.body
        const inputPath = path.join(process.env.UPLOAD_DIR || 'uploads', fileId)

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: 'File not found' })
        }

        // 创建处理任务记录
        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPath,
            job_type: 'video_convert',
            status: 'processing',
            parameters: { outputFormat, videoCodec, audioCodec }
        })

        // 执行转换
        try {
            const outputPath = await FFmpegService.convertVideo(inputPath, outputFormat, {
                videoCodec,
                audioCodec
            })

            // 更新任务状态
            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'Video converted successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Convert video error:', error)
        res.status(500).json({ error: 'Video conversion failed', details: error.message })
    }
}

// 视频压缩
exports.compressVideo = async (req, res) => {
    try {
        const { fileId, videoBitrate, audioBitrate, width, height, scale, fps } = req.body
        const inputPath = path.join(process.env.UPLOAD_DIR || 'uploads', fileId)

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: 'File not found' })
        }

        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPath,
            job_type: 'video_compress',
            status: 'processing',
            parameters: { videoBitrate, audioBitrate, width, height, scale, fps }
        })

        try {
            const outputPath = await FFmpegService.compressVideo(inputPath, {
                videoBitrate,
                audioBitrate,
                width,
                height,
                scale,
                fps
            })

            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'Video compressed successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Compress video error:', error)
        res.status(500).json({ error: 'Video compression failed', details: error.message })
    }
}

// 视频裁剪
exports.cutVideo = async (req, res) => {
    try {
        const { fileId, startTime, duration } = req.body
        const inputPath = path.join(process.env.UPLOAD_DIR || 'uploads', fileId)

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: 'File not found' })
        }

        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPath,
            job_type: 'video_cut',
            status: 'processing',
            parameters: { startTime, duration }
        })

        try {
            const outputPath = await FFmpegService.cutVideo(inputPath, startTime, duration)

            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'Video cut successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Cut video error:', error)
        res.status(500).json({ error: 'Video cutting failed', details: error.message })
    }
}

// 视频合并
exports.mergeVideos = async (req, res) => {
    try {
        const { fileIds, outputFormat } = req.body
        const uploadDir = process.env.UPLOAD_DIR || 'uploads'

        const inputPaths = fileIds.map(fileId => path.join(uploadDir, fileId))

        // 检查所有文件是否存在
        for (const inputPath of inputPaths) {
            if (!fs.existsSync(inputPath)) {
                return res.status(404).json({ error: `File not found: ${path.basename(inputPath)}` })
            }
        }

        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPaths.join(','),
            job_type: 'video_merge',
            status: 'processing',
            parameters: { fileIds, outputFormat }
        })

        try {
            const outputPath = await FFmpegService.mergeVideos(inputPaths, outputFormat)

            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'Videos merged successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Merge videos error:', error)
        res.status(500).json({ error: 'Video merging failed', details: error.message })
    }
}

// 旋转视频
exports.rotateVideo = async (req, res) => {
    try {
        const { fileId, angle } = req.body
        const inputPath = path.join(process.env.UPLOAD_DIR || 'uploads', fileId)

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: 'File not found' })
        }

        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPath,
            job_type: 'video_rotate',
            status: 'processing',
            parameters: { angle }
        })

        try {
            const outputPath = await FFmpegService.rotateVideo(inputPath, angle)

            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'Video rotated successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Rotate video error:', error)
        res.status(500).json({ error: 'Video rotation failed', details: error.message })
    }
}

// 提取音频
exports.extractAudio = async (req, res) => {
    try {
        const { fileId, outputFormat } = req.body
        const inputPath = path.join(process.env.UPLOAD_DIR || 'uploads', fileId)

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: 'File not found' })
        }

        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPath,
            job_type: 'extract_audio',
            status: 'processing',
            parameters: { outputFormat }
        })

        try {
            const outputPath = await FFmpegService.extractAudio(inputPath, outputFormat)

            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'Audio extracted successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Extract audio error:', error)
        res.status(500).json({ error: 'Audio extraction failed', details: error.message })
    }
}

// 视频转 GIF
exports.videoToGif = async (req, res) => {
    try {
        const { fileId, startTime, duration, width, fps } = req.body
        const inputPath = path.join(process.env.UPLOAD_DIR || 'uploads', fileId)

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: 'File not found' })
        }

        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPath,
            job_type: 'video_to_gif',
            status: 'processing',
            parameters: { startTime, duration, width, fps }
        })

        try {
            const outputPath = await FFmpegService.videoToGif(inputPath, {
                startTime,
                duration,
                width,
                fps
            })

            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'GIF created successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Video to GIF error:', error)
        res.status(500).json({ error: 'GIF creation failed', details: error.message })
    }
}

// 添加水印
exports.addWatermark = async (req, res) => {
    try {
        const { fileId, watermarkFileId, position, width } = req.body
        const uploadDir = process.env.UPLOAD_DIR || 'uploads'
        const inputPath = path.join(uploadDir, fileId)
        const watermarkPath = path.join(uploadDir, watermarkFileId)

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: 'Input file not found' })
        }

        if (!fs.existsSync(watermarkPath)) {
            return res.status(404).json({ error: 'Watermark file not found' })
        }

        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPath,
            job_type: 'add_watermark',
            status: 'processing',
            parameters: { watermarkFileId, position, width }
        })

        try {
            const outputPath = await FFmpegService.addWatermark(inputPath, watermarkPath, {
                position,
                width
            })

            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'Watermark added successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Add watermark error:', error)
        res.status(500).json({ error: 'Watermark addition failed', details: error.message })
    }
}

// 图片格式转换
exports.convertImage = async (req, res) => {
    try {
        const { fileId, outputFormat } = req.body
        const inputPath = path.join(process.env.UPLOAD_DIR || 'uploads', fileId)

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: 'File not found' })
        }

        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPath,
            job_type: 'image_convert',
            status: 'processing',
            parameters: { outputFormat }
        })

        try {
            const outputPath = await FFmpegService.convertImage(inputPath, outputFormat)

            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'Image converted successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Convert image error:', error)
        res.status(500).json({ error: 'Image conversion failed', details: error.message })
    }
}

// 图片调整大小
exports.resizeImage = async (req, res) => {
    try {
        const { fileId, width, height, scale, quality } = req.body
        const inputPath = path.join(process.env.UPLOAD_DIR || 'uploads', fileId)

        if (!fs.existsSync(inputPath)) {
            return res.status(404).json({ error: 'File not found' })
        }

        const job = await ProcessingJob.create({
            user_id: req.user.userId,
            original_file: inputPath,
            job_type: 'image_resize',
            status: 'processing',
            parameters: { width, height, scale, quality }
        })

        try {
            const outputPath = await FFmpegService.resizeImage(inputPath, {
                width,
                height,
                scale,
                quality
            })

            job.output_file = outputPath
            job.status = 'completed'
            job.completed_at = new Date()
            await job.save()

            res.json({
                message: 'Image resized successfully',
                jobId: job.id,
                outputFile: path.basename(outputPath)
            })
        } catch (error) {
            job.status = 'failed'
            job.error_message = error.message
            await job.save()
            throw error
        }
    } catch (error) {
        console.error('Resize image error:', error)
        res.status(500).json({ error: 'Image resizing failed', details: error.message })
    }
}

// 查询处理状态
exports.getJobStatus = async (req, res) => {
    try {
        const { jobId } = req.params

        const job = await ProcessingJob.findOne({
            where: { id: jobId, user_id: req.user.userId }
        })

        if (!job) {
            return res.status(404).json({ error: 'Job not found' })
        }

        res.json({
            jobId: job.id,
            status: job.status,
            jobType: job.job_type,
            outputFile: job.output_file ? path.basename(job.output_file) : null,
            errorMessage: job.error_message,
            createdAt: job.created_at,
            completedAt: job.completed_at
        })
    } catch (error) {
        console.error('Get job status error:', error)
        res.status(500).json({ error: 'Failed to get job status' })
    }
}

// 获取处理历史
exports.getHistory = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query
        const offset = (page - 1) * limit

        const { count, rows } = await ProcessingJob.findAndCountAll({
            where: { user_id: req.user.userId },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        })

        const jobs = rows.map(job => ({
            id: job.id,
            jobType: job.job_type,
            status: job.status,
            originalFile: path.basename(job.original_file),
            outputFile: job.output_file ? path.basename(job.output_file) : null,
            parameters: job.parameters,
            createdAt: job.created_at,
            completedAt: job.completed_at
        }))

        res.json({
            jobs,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        })
    } catch (error) {
        console.error('Get history error:', error)
        res.status(500).json({ error: 'Failed to get processing history' })
    }
}

// 下载处理后的文件
exports.downloadFile = async (req, res) => {
    try {
        const { jobId } = req.params

        const job = await ProcessingJob.findOne({
            where: { id: jobId, user_id: req.user.userId }
        })

        if (!job) {
            return res.status(404).json({ error: 'Job not found' })
        }

        if (!job.output_file || !fs.existsSync(job.output_file)) {
            return res.status(404).json({ error: 'Output file not found' })
        }

        // 获取文件名和扩展名
        const filename = path.basename(job.output_file)
        const ext = path.extname(filename).toLowerCase()

        // 根据扩展名设置 MIME 类型
        const mimeTypes = {
            '.mp4': 'video/mp4',
            '.avi': 'video/x-msvideo',
            '.mov': 'video/quicktime',
            '.mkv': 'video/x-matroska',
            '.webm': 'video/webm',
            '.flv': 'video/x-flv',
            '.gif': 'image/gif',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp',
            '.bmp': 'image/bmp',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.aac': 'audio/aac'
        }

        const mimeType = mimeTypes[ext] || 'application/octet-stream'

        // 设置响应头 - 使用双重编码确保兼容性
        res.setHeader('Content-Type', mimeType)
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`)
        res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition')

        // 使用 res.download 方法
        res.download(job.output_file, filename, err => {
            if (err) {
                console.error('Download error:', err)
                if (!res.headersSent) {
                    res.status(500).json({ error: 'File download failed' })
                }
            }
        })
    } catch (error) {
        console.error('Download file error:', error)
        if (!res.headersSent) {
            res.status(500).json({ error: 'File download failed' })
        }
    }
}
