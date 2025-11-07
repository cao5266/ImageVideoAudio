[根目录](../CLAUDE.md) > **backend**

# 后端模块文档

## 模块职责

基于 Node.js + Express 的后端服务，提供视频图片处理、用户认证、文件管理等功能。

## 入口与启动

### 主入口文件
- **文件**: `src/server.js`
- **端口**: 5000 (默认)
- **环境**: 开发/生产环境自动识别

### 启动脚本
```bash
# 开发环境
npm run dev

# 生产环境
npm start

# 数据库迁移
npm run migrate
```

### 服务初始化流程
1. 测试数据库连接
2. 同步数据库模型
3. 启动文件清理计划
4. 启动 Express 服务器

## 对外接口

### 认证接口 (`/api/auth`)
- `POST /register` - 用户注册
- `POST /login` - 用户登录
- `GET /google` - Google OAuth 登录
- `POST /refresh` - 刷新 Token
- `GET /me` - 获取当前用户信息

### 文件上传接口 (`/api/upload`)
- `POST /single` - 单文件上传
- `POST /multiple` - 多文件上传

### 视频处理接口 (`/api/process/video`)
- `POST /convert` - 格式转换 (MP4, AVI, MOV, MKV, WebM)
- `POST /compress` - 视频压缩
- `POST /cut` - 视频裁剪
- `POST /merge` - 视频合并
- `POST /rotate` - 旋转视频
- `POST /extract-audio` - 提取音频
- `POST /to-gif` - 转 GIF
- `POST /watermark` - 添加水印

### 图片处理接口 (`/api/process/image`)
- `POST /convert` - 格式转换 (JPG, PNG, WebP, GIF, BMP)
- `POST /resize` - 调整大小

### 任务查询接口
- `GET /api/process/status/:jobId` - 查询处理状态
- `GET /api/process/history` - 获取处理历史
- `GET /api/process/download/:jobId` - 下载处理结果

## 关键依赖与配置

### 核心依赖
- **express**: Web 框架
- **mysql2**: MySQL 数据库驱动
- **sequelize**: ORM 框架
- **fluent-ffmpeg**: FFmpeg 封装
- **multer**: 文件上传中间件
- **passport**: 认证中间件
- **jsonwebtoken**: JWT Token
- **bcryptjs**: 密码加密

### 安全中间件
- **helmet**: 安全头设置
- **cors**: 跨域配置
- **express-rate-limit**: 请求频率限制
- **express-validator**: 输入验证

### 配置文件
- **数据库配置**: `src/config/database.js`
- **Passport 配置**: `src/config/passport.js`
- **数据库迁移**: `src/config/migrate.js`
- **环境变量**: `.env` (参考 `.env.example`)

## 数据模型

### User 模型 (`src/models/User.js`)
- `id`: 主键
- `email`: 邮箱 (唯一)
- `password`: 加密密码
- `name`: 用户名
- `avatar`: 头像 URL
- `created_at`: 创建时间

### ProcessingJob 模型 (`src/models/ProcessingJob.js`)
- `id`: 主键
- `user_id`: 用户 ID
- `job_type`: 任务类型
- `input_file`: 输入文件路径
- `output_file`: 输出文件路径
- `status`: 任务状态
- `created_at`: 创建时间

### RefreshToken 模型 (`src/models/RefreshToken.js`)
- `id`: 主键
- `user_id`: 用户 ID
- `token`: 刷新 Token
- `expires_at`: 过期时间

### 模型关联
- User 1:N ProcessingJob
- User 1:N RefreshToken

## 核心服务

### FFmpegService (`src/services/ffmpegService.js`)
提供 21 种视频图片处理功能：

#### 视频处理 (14 种)
- 格式转换
- 视频压缩
- 视频裁剪
- 视频合并
- 旋转视频
- 翻转视频
- 调整速度
- 提取音频
- 视频转 GIF
- 添加图片水印
- 添加文字水印
- 视频截图
- 去除音频
- 替换音频

#### 图片处理 (7 种)
- 格式转换
- 图片压缩
- 调整大小
- 旋转图片
- 翻转图片
- 添加水印
- 图片转视频

## 测试与质量

### 测试策略
- API 接口测试
- 文件处理功能测试
- 数据库操作测试
- 安全测试
- 性能测试

### 质量工具
- **nodemon**: 开发热重载
- **morgan**: 请求日志
- **自动文件清理**: 24 小时清理旧文件

### 数据库脚本
- `scripts/init-database.js`: 初始化数据库
- `scripts/reset-database.js`: 重置数据库
- `scripts/check-database.js`: 检查数据库连接

## 常见问题 (FAQ)

### FFmpeg 处理失败
1. 检查 FFmpeg 是否正确安装
2. 验证文件格式支持
3. 检查服务器资源
4. 查看后端日志

### 文件上传失败
1. 检查文件大小限制 (500MB)
2. 验证文件类型白名单
3. 检查 uploads 目录权限
4. 确认网络连接

### Token 认证失败
1. 检查 Token 是否过期
2. 验证 JWT_SECRET 配置
3. 确认 API URL 配置

## 相关文件清单

### 控制器
- `src/controllers/authController.js` - 认证控制器
- `src/controllers/uploadController.js` - 上传控制器
- `src/controllers/processController.js` - 处理控制器

### 路由
- `src/routes/auth.js` - 认证路由
- `src/routes/upload.js` - 上传路由
- `src/routes/process.js` - 处理路由

### 中间件
- `src/middleware/auth.js` - JWT 认证中间件
- `src/middleware/upload.js` - Multer 上传中间件

### 工具函数
- `src/utils/fileCleanup.js` - 文件清理工具

## 变更记录 (Changelog)

### 2025-10-29
- 创建后端模块 CLAUDE.md
- 记录模块结构和接口
- 描述核心服务功能
- 列出相关文件清单

### 覆盖率
- 已扫描文件: 18/25 (72%)
- 主要缺口: 测试文件
- 建议: 添加单元测试和集成测试