# 测试指南

本文档提供详细的测试步骤，确保应用所有功能正常工作。

## 前置准备

### 1. 确保所有服务正常运行

**后端服务：**
```bash
cd backend
npm run dev
```
应该看到：
```
✅ Database connection established successfully.
✅ Database models synchronized
✅ File cleanup schedule started
🚀 Server is running on port 5000
```

**前端服务：**
```bash
cd frontend
npm run dev
```
应该看到：
```
ready - started server on 0.0.0.0:3000
```

### 2. 验证数据库连接

```bash
mysql -u root -p
USE video_process_db;
SHOW TABLES;
```

应该看到三个表：
- `users`
- `processing_jobs`
- `refresh_tokens`

### 3. 验证 FFmpeg 安装

```bash
ffmpeg -version
```

## 测试清单

### ✅ 用户认证测试

#### 1. 邮箱密码注册
1. 访问 http://localhost:3000/register
2. 填写注册信息：
   - 姓名: 测试用户
   - 邮箱: test@example.com
   - 密码: 123456
   - 确认密码: 123456
3. 点击"注册"
4. **预期结果**：成功注册并跳转到仪表板

#### 2. 邮箱密码登录
1. 访问 http://localhost:3000/login
2. 填写登录信息：
   - 邮箱: test@example.com
   - 密码: 123456
3. 点击"登录"
4. **预期结果**：成功登录并跳转到仪表板

#### 3. Google OAuth 登录
1. 访问 http://localhost:3000/login
2. 点击"使用 Google 账号登录"
3. 选择 Google 账号并授权
4. **预期结果**：成功登录并跳转到仪表板

**注意**：Google OAuth 需要正确配置 Client ID 和回调 URL

#### 4. 退出登录
1. 在仪表板点击用户菜单
2. 点击"退出登录"
3. **预期结果**：退出登录并跳转到首页

### ✅ 视频处理测试

准备测试文件：
- 短视频文件（MP4 格式，建议 < 50MB）
- 放在桌面或容易访问的位置

#### 1. 视频格式转换
1. 登录后访问 http://localhost:3000/process/video
2. 上传测试视频（拖拽或点击上传）
3. 选择处理类型：**格式转换**
4. 选择输出格式：**AVI**
5. 点击"开始处理"
6. **预期结果**：
   - 显示"处理中..."
   - 处理完成后显示绿色成功提示
   - 可以点击"下载处理结果"

**验证**：
```bash
# 检查后端目录
ls backend/uploads/  # 应该有上传的文件
ls backend/outputs/  # 应该有处理后的文件
```

#### 2. 视频压缩
1. 上传测试视频
2. 选择处理类型：**视频压缩**
3. 设置参数：
   - 视频码率: 500k
   - 音频码率: 96k
   - 宽度: 640
   - 高度: 360
4. 点击"开始处理"
5. **预期结果**：成功处理并可下载

#### 3. 视频裁剪
1. 上传测试视频
2. 选择处理类型：**视频裁剪**
3. 设置参数：
   - 开始时间: 00:00:05
   - 持续时间: 00:00:10
4. 点击"开始处理"
5. **预期结果**：成功裁剪 5-15 秒的片段

#### 4. 视频旋转
1. 上传测试视频
2. 选择处理类型：**旋转视频**
3. 选择旋转角度：**90° 顺时针**
4. 点击"开始处理"
5. **预期结果**：视频成功旋转 90 度

#### 5. 提取音频
1. 上传测试视频
2. 选择处理类型：**提取音频**
3. 点击"开始处理"
4. **预期结果**：成功提取 MP3 音频文件

#### 6. 视频转 GIF
1. 上传测试视频
2. 选择处理类型：**转 GIF**
3. 设置参数：
   - 开始时间: 00:00:00
   - 持续时间: 00:00:05
   - 宽度: 400
   - 帧率: 10
4. 点击"开始处理"
5. **预期结果**：成功生成 GIF 文件

### ✅ 图片处理测试

准备测试文件：
- 图片文件（JPG 或 PNG 格式）

#### 1. 图片格式转换
1. 访问 http://localhost:3000/process/image
2. 上传测试图片
3. 选择处理类型：**格式转换**
4. 选择输出格式：**PNG**
5. 点击"开始处理"
6. **预期结果**：成功转换格式

#### 2. 图片调整大小
1. 上传测试图片
2. 选择处理类型：**调整大小**
3. 设置参数：
   - 宽度: 800
   - 高度: 600
   - 质量: 85
4. 点击"开始处理"
5. **预期结果**：成功调整大小

#### 3. 图片按比例缩放
1. 上传测试图片
2. 选择处理类型：**调整大小**
3. 设置参数：
   - 按比例缩放: 50
   - 质量: 90
4. 点击"开始处理"
5. **预期结果**：图片缩放到原来的 50%

### ✅ 处理历史测试

1. 访问 http://localhost:3000/history
2. **预期结果**：
   - 显示所有处理记录
   - 显示处理状态（已完成/处理中/失败）
   - 可以点击下载按钮下载文件
   - 分页功能正常

### ✅ 个人设置测试

1. 访问 http://localhost:3000/profile
2. **预期结果**：
   - 显示用户信息（姓名、邮箱、头像）
   - 显示注册时间
   - 显示使用统计

### ✅ 移动端测试

#### 使用浏览器开发者工具

1. 打开 Chrome 开发者工具 (F12)
2. 点击设备模拟器图标（Toggle device toolbar）
3. 选择设备：iPhone 12 Pro 或 iPad
4. 测试以下功能：
   - 导航菜单（汉堡菜单）
   - 文件上传
   - 处理参数设置
   - 处理历史查看

**预期结果**：所有功能在移动端正常显示和工作

### ✅ 错误处理测试

#### 1. 上传不支持的文件类型
1. 尝试上传 .txt 或 .pdf 文件
2. **预期结果**：显示错误提示"文件类型不支持"

#### 2. 上传过大文件
1. 尝试上传 > 500MB 的文件
2. **预期结果**：显示错误提示"文件过大"

#### 3. 未登录访问受保护页面
1. 退出登录
2. 直接访问 http://localhost:3000/dashboard
3. **预期结果**：自动跳转到登录页面

#### 4. Token 过期测试
1. 登录后等待 Token 过期（默认 7 天）
2. 或手动清除 localStorage 中的 token
3. 刷新页面
4. **预期结果**：自动跳转到登录页面

#### 5. 网络错误测试
1. 停止后端服务
2. 尝试上传文件或处理文件
3. **预期结果**：显示网络错误提示

## API 接口测试

使用 Postman 或 curl 测试 API：

### 1. 用户注册

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api-test@example.com",
    "password": "123456",
    "name": "API Test User"
  }'
```

**预期响应**：
```json
{
  "user": {
    "id": 2,
    "email": "api-test@example.com",
    "name": "API Test User"
  },
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc..."
}
```

### 2. 用户登录

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "api-test@example.com",
    "password": "123456"
  }'
```

### 3. 文件上传

```bash
# 将 YOUR_TOKEN 替换为实际的 accessToken
curl -X POST http://localhost:5000/api/upload/single \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@/path/to/your/video.mp4"
```

### 4. 视频格式转换

```bash
curl -X POST http://localhost:5000/api/process/video/convert \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileId": "uploaded-file-id.mp4",
    "outputFormat": "avi",
    "videoCodec": "libx264",
    "audioCodec": "aac"
  }'
```

### 5. 查询处理状态

```bash
curl -X GET http://localhost:5000/api/process/status/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. 获取处理历史

```bash
curl -X GET http://localhost:5000/api/process/history \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 性能测试

### 1. 文件上传性能

测试上传 100MB 视频文件的时间：
- **预期**：< 30 秒（取决于网络速度）

### 2. 视频处理性能

测试转换 100MB 视频文件的时间：
- **预期**：< 5 分钟（取决于服务器配置）

### 3. 并发处理

同时上传和处理多个文件：
- **预期**：后端能够处理多个并发请求

## 数据库测试

### 1. 验证用户数据

```sql
SELECT * FROM users;
```

应该看到注册的用户信息。

### 2. 验证处理任务记录

```sql
SELECT id, user_id, job_type, status, created_at 
FROM processing_jobs 
ORDER BY created_at DESC 
LIMIT 10;
```

应该看到所有处理任务记录。

### 3. 验证 Token 记录

```sql
SELECT id, user_id, expires_at 
FROM refresh_tokens 
WHERE expires_at > NOW();
```

应该看到有效的 refresh token。

## 文件清理测试

### 1. 验证清理功能

```bash
# 创建一个旧文件进行测试
touch backend/uploads/old-test-file.mp4
touch -t 202301010000 backend/uploads/old-test-file.mp4

# 等待文件清理任务执行（每小时执行一次）
# 或重启后端服务触发立即清理

# 检查文件是否被删除
ls backend/uploads/old-test-file.mp4
```

**预期结果**：超过 24 小时的文件应该被删除

## 安全测试

### 1. SQL 注入测试

尝试使用恶意输入：
```
email: test'; DROP TABLE users; --
password: 123456
```

**预期结果**：请求被拒绝或安全处理，数据库不受影响

### 2. XSS 测试

在姓名字段输入：
```
<script>alert('XSS')</script>
```

**预期结果**：输入被转义，不执行脚本

### 3. 未授权访问测试

```bash
# 不带 token 访问受保护的接口
curl -X GET http://localhost:5000/api/auth/me
```

**预期响应**：
```json
{
  "error": "Access token required"
}
```

## 测试报告

完成所有测试后，记录结果：

| 测试项 | 状态 | 备注 |
|--------|------|------|
| 用户注册 | ✅ / ❌ | |
| 用户登录 | ✅ / ❌ | |
| Google OAuth | ✅ / ❌ | |
| 视频格式转换 | ✅ / ❌ | |
| 视频压缩 | ✅ / ❌ | |
| 视频裁剪 | ✅ / ❌ | |
| 视频旋转 | ✅ / ❌ | |
| 提取音频 | ✅ / ❌ | |
| 视频转 GIF | ✅ / ❌ | |
| 图片格式转换 | ✅ / ❌ | |
| 图片调整大小 | ✅ / ❌ | |
| 处理历史 | ✅ / ❌ | |
| 移动端适配 | ✅ / ❌ | |
| 错误处理 | ✅ / ❌ | |
| 文件清理 | ✅ / ❌ | |
| 安全测试 | ✅ / ❌ | |

## 常见问题

### FFmpeg 处理失败

**检查项**：
1. FFmpeg 是否正确安装
2. 文件格式是否支持
3. 服务器资源是否充足
4. 检查后端日志错误信息

### 文件上传失败

**检查项**：
1. 文件大小是否超过限制
2. 文件类型是否支持
3. uploads 目录权限是否正确
4. 网络连接是否稳定

### Token 认证失败

**检查项**：
1. Token 是否过期
2. JWT_SECRET 配置是否正确
3. 前后端 API URL 配置是否一致

## 总结

完成所有测试后，确认：

- ✅ 所有核心功能正常工作
- ✅ 错误处理正确
- ✅ 移动端适配良好
- ✅ API 响应符合预期
- ✅ 安全措施有效

如果发现任何问题，请在 GitHub 提交 Issue。

