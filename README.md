# Video & Image Processing Platform

基于 FFmpeg 的专业视频图片处理平台，提供格式转换、压缩、裁剪、水印等丰富功能。

## 项目概述

这是一个前后端分离的全栈应用：

- **后端**: Node.js + Express + MySQL + FFmpeg
- **前端**: React + Next.js + Tailwind CSS
- **认证**: JWT + Google OAuth 2.0
- **文件处理**: FFmpeg (云服务器部署)

## 功能特性

### 🎬 视频处理
- 格式转换 (MP4, AVI, MOV, MKV, WebM)
- 视频压缩与优化
- 视频裁剪/剪辑
- 视频合并
- 旋转/翻转
- 调整速度
- 提取音频
- 视频转 GIF
- 添加水印 (图片/文字)
- 视频截图
- 去除/替换音频

### 🖼️ 图片处理
- 格式转换 (JPG, PNG, WebP, GIF, BMP)
- 图片压缩
- 调整大小/裁剪
- 旋转/翻转
- 添加水印
- 图片转视频

### 👤 用户系统
- 邮箱密码注册/登录
- Google OAuth 2.0 登录
- JWT Token 认证
- 处理历史记录

### 📱 响应式设计
- PC 端完整体验
- 移动端适配
- 触摸友好的界面

## 项目结构

```
Video-Image-process/
├── backend/              # Node.js 后端
│   ├── src/
│   │   ├── config/      # 配置文件
│   │   ├── controllers/ # 控制器
│   │   ├── models/      # 数据库模型
│   │   ├── routes/      # 路由
│   │   ├── middleware/  # 中间件
│   │   ├── services/    # FFmpeg 处理服务
│   │   └── utils/       # 工具函数
│   └── package.json
└── frontend/            # Next.js 前端
    ├── src/
    │   ├── app/         # 页面路由
    │   ├── components/  # React 组件
    │   └── lib/         # 工具库
    └── package.json
```

## 快速开始

### 环境要求

- Node.js >= 14.x
- MySQL >= 5.7
- FFmpeg >= 4.0

### 后端设置

1. 进入后端目录并安装依赖：

```bash
cd backend
npm install
```

2. 配置环境变量：

```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库和其他参数
```

3. 创建数据库：

```sql
CREATE DATABASE video_process_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. 运行数据库迁移：

```bash
npm run migrate
```

5. 启动后端服务：

```bash
# 开发环境
npm run dev

# 生产环境
npm start
```

后端将在 http://localhost:5000 启动

### 前端设置

1. 进入前端目录并安装依赖：

```bash
cd frontend
npm install
```

2. 配置环境变量：

```bash
# 创建 .env.local 文件
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

3. 启动前端服务：

```bash
# 开发环境
npm run dev

# 生产环境
npm run build
npm start
```

前端将在 http://localhost:3000 启动

## Google OAuth 配置

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目
3. 启用 Google+ API
4. 创建 OAuth 2.0 客户端 ID
5. 配置授权重定向 URI：
   - `http://localhost:5000/api/auth/google/callback` (开发环境)
   - `https://your-domain.com/api/auth/google/callback` (生产环境)
6. 将 Client ID 和 Client Secret 配置到 `.env` 文件

## FFmpeg 安装

### Windows
```bash
choco install ffmpeg
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

### macOS
```bash
brew install ffmpeg
```

验证安装：
```bash
ffmpeg -version
```

## 部署

### 后端部署 (云服务器)

1. 安装 Node.js、MySQL 和 FFmpeg

2. 克隆代码并安装依赖：
```bash
git clone <repository-url>
cd backend
npm install
```

3. 配置生产环境变量

4. 使用 PM2 管理进程：
```bash
npm install -g pm2
pm2 start src/server.js --name video-process-api
pm2 save
pm2 startup
```

5. 配置 Nginx 反向代理：
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    client_max_body_size 500M;
}
```

### 前端部署 (Vercel 推荐)

1. 推送代码到 GitHub

2. 在 Vercel 导入项目

3. 配置环境变量：
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

4. 部署

## API 文档

### 认证接口

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/google` - Google OAuth 登录
- `POST /api/auth/refresh` - 刷新 Token
- `GET /api/auth/me` - 获取当前用户信息

### 文件上传

- `POST /api/upload/single` - 单文件上传
- `POST /api/upload/multiple` - 多文件上传

### 视频处理

- `POST /api/process/video/convert` - 格式转换
- `POST /api/process/video/compress` - 视频压缩
- `POST /api/process/video/cut` - 视频裁剪
- `POST /api/process/video/merge` - 视频合并
- `POST /api/process/video/rotate` - 旋转视频
- `POST /api/process/video/extract-audio` - 提取音频
- `POST /api/process/video/to-gif` - 转 GIF
- `POST /api/process/video/watermark` - 添加水印

### 图片处理

- `POST /api/process/image/convert` - 格式转换
- `POST /api/process/image/resize` - 调整大小

### 任务查询

- `GET /api/process/status/:jobId` - 查询处理状态
- `GET /api/process/history` - 获取处理历史
- `GET /api/process/download/:jobId` - 下载处理结果

详细 API 文档请参考 `backend/README.md`

## 技术栈

### 后端
- Node.js + Express
- MySQL + Sequelize ORM
- FFmpeg (fluent-ffmpeg)
- JWT 认证
- Passport.js (Google OAuth)
- Multer (文件上传)

### 前端
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Zustand (状态管理)
- Axios
- React Hook Form
- React Dropzone

## 安全性

- HTTPS 加密传输
- JWT Token 认证
- 密码 bcrypt 加密
- 文件类型验证
- 文件大小限制
- 请求频率限制
- CORS 配置
- 自动文件清理 (24小时)

## 性能优化

- FFmpeg 参数优化
- 文件流式传输
- 数据库查询优化
- 前端代码分割
- 图片懒加载
- CDN 部署

## 开发指南

### 添加新的视频处理功能

1. 在 `backend/src/services/ffmpegService.js` 添加处理方法
2. 在 `backend/src/controllers/processController.js` 添加控制器
3. 在 `backend/src/routes/process.js` 添加路由
4. 在前端 `frontend/src/lib/api.ts` 添加 API 调用
5. 在前端页面添加 UI 和交互

## 常见问题

### FFmpeg 命令不存在
确保 FFmpeg 已正确安装并添加到系统 PATH

### 文件上传失败
检查文件大小是否超过限制，以及文件类型是否支持

### Google OAuth 失败
检查 Client ID 和回调 URL 配置是否正确

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

如有问题或建议，请提交 Issue。

