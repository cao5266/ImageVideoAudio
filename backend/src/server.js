const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const path = require('path')
require('dotenv').config()

const { testConnection, sequelize } = require('./config/database')
const { startCleanupSchedule } = require('./utils/fileCleanup')

// 导入路由
const authRoutes = require('./routes/auth')
const uploadRoutes = require('./routes/upload')
const processRoutes = require('./routes/process')

const app = express()
const PORT = process.env.PORT || 5000

// 安全中间件
app.use(helmet())

// CORS 配置
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
        exposedHeaders: ['Content-Disposition', 'Content-Type']
    })
)

// 请求日志
app.use(morgan('dev'))

// 解析 JSON 和 URL 编码的请求体
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 速率限制
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分钟
    max: 100, // 限制每个 IP 100 个请求
    message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

// 静态文件服务（用于下载）
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/outputs', express.static(path.join(__dirname, '../outputs')))

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/process', processRoutes)

// 健康检查
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' })
})

// 404 处理
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('Error:', err)

    if (err.name === 'MulterError') {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large' })
        }
        return res.status(400).json({ error: err.message })
    }

    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    })
})

// 启动服务器
const startServer = async () => {
    try {
        // 测试数据库连接
        await testConnection()

        // 同步数据库模型
        await sequelize.sync({ alter: false })
        console.log('✅ Database models synchronized')

        // 启动文件清理计划
        startCleanupSchedule()
        console.log('✅ File cleanup schedule started')

        // 启动服务器
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`)
            console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
            console.log(`🌐 API URL: http://localhost:${PORT}`)
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error)
        process.exit(1)
    }
}

startServer()
