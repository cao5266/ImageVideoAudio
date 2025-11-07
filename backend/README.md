# Video Image Process Backend

基于 Node.js + Express + FFmpeg 的视频图片处理后端服务

## 功能特性

### 用户认证
- 邮箱密码注册/登录
- Google OAuth 2.0 登录
- JWT Token 认证
- Refresh Token 机制

### 视频处理
- 格式转换（MP4, AVI, MOV, MKV, WebM 等）
- 视频压缩
- 视频裁剪/剪辑
- 视频合并
- 旋转/翻转视频
- 调整视频速度
- 提取音频
- 视频转 GIF
- 添加水印（图片/文字）
- 视频截图
- 去除/替换音频

### 图片处理
- 格式转换（JPG, PNG, WebP, GIF, BMP 等）
- 图片压缩
- 调整大小/裁剪
- 旋转/翻转
- 添加水印
- 图片转视频

## 环境要求

- Node.js >= 14.x
- MySQL >= 5.7
- FFmpeg >= 4.0

## 安装步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 安装 FFmpeg

**Windows:**
```bash
# 使用 Chocolatey
choco install ffmpeg

# 或下载二进制文件
# https://ffmpeg.org/download.html
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install ffmpeg
```

**macOS:**
```bash
brew install ffmpeg
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=video_process_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. 创建数据库

```sql
CREATE DATABASE video_process_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 5. 运行数据库迁移

```bash
npm run migrate
```

### 6. 启动服务器

开发环境：
```bash
npm run dev
```

生产环境：
```bash
npm start
```

## API 文档

### 认证接口

#### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Google OAuth
```http
GET /api/auth/google
```

### 文件上传

#### 单文件上传
```http
POST /api/upload/single
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: <binary>
```

### 视频处理

#### 视频格式转换
```http
POST /api/process/video/convert
Authorization: Bearer {token}
Content-Type: application/json

{
  "fileId": "uploaded-file-id",
  "outputFormat": "mp4",
  "videoCodec": "libx264",
  "audioCodec": "aac"
}
```

#### 视频压缩
```http
POST /api/process/video/compress
Authorization: Bearer {token}
Content-Type: application/json

{
  "fileId": "uploaded-file-id",
  "videoBitrate": "1000k",
  "audioBitrate": "128k",
  "width": 1280,
  "height": 720,
  "fps": 30
}
```

#### 视频裁剪
```http
POST /api/process/video/cut
Authorization: Bearer {token}
Content-Type: application/json

{
  "fileId": "uploaded-file-id",
  "startTime": "00:00:10",
  "duration": "00:00:30"
}
```

### 图片处理

#### 图片格式转换
```http
POST /api/process/image/convert
Authorization: Bearer {token}
Content-Type: application/json

{
  "fileId": "uploaded-file-id",
  "outputFormat": "png"
}
```

#### 图片调整大小
```http
POST /api/process/image/resize
Authorization: Bearer {token}
Content-Type: application/json

{
  "fileId": "uploaded-file-id",
  "width": 800,
  "height": 600,
  "quality": 90
}
```

### 任务查询

#### 查询处理状态
```http
GET /api/process/status/{jobId}
Authorization: Bearer {token}
```

#### 获取处理历史
```http
GET /api/process/history?page=1&limit=20
Authorization: Bearer {token}
```

#### 下载处理结果
```http
GET /api/process/download/{jobId}
Authorization: Bearer {token}
```

## 部署

### 使用 PM2

```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start src/server.js --name video-process-api

# 查看状态
pm2 status

# 查看日志
pm2 logs video-process-api

# 重启
pm2 restart video-process-api

# 停止
pm2 stop video-process-api
```

### Nginx 反向代理配置

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
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    client_max_body_size 500M;
}
```

## 安全建议

1. 使用强密码作为 JWT_SECRET
2. 启用 HTTPS
3. 定期更新依赖包
4. 限制文件上传大小
5. 实施请求频率限制
6. 定期备份数据库

## 许可证

MIT

