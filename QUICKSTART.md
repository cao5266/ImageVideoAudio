# 快速启动指南

10 分钟快速启动项目并开始使用。

## 前置要求

确保已安装：
- Node.js (>= 14.x)
- MySQL (>= 5.7)
- FFmpeg (>= 4.0)

## 步骤 1: 安装 FFmpeg

### Windows
```bash
# 使用 Chocolatey
choco install ffmpeg

# 或从官网下载：https://ffmpeg.org/download.html
```

### macOS
```bash
brew install ffmpeg
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install ffmpeg
```

验证安装：
```bash
ffmpeg -version
```

## 步骤 2: 设置数据库

```bash
# 登录 MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE video_process_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出
EXIT;
```

## 步骤 3: 启动后端

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 复制环境变量文件
cp .env.example .env

# 编辑 .env 文件，配置数据库信息
# 至少需要配置：
# DB_USER=root
# DB_PASSWORD=your_password
# JWT_SECRET=your-secret-key

# 运行数据库迁移
npm run migrate

# 启动开发服务器
npm run dev
```

看到以下输出表示成功：
```
✅ Database connection established successfully.
🚀 Server is running on port 5000
```

## 步骤 4: 启动前端

打开新的终端窗口：

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

看到以下输出表示成功：
```
ready - started server on 0.0.0.0:3000
```

## 步骤 5: 访问应用

打开浏览器访问：
- **前端**: http://localhost:3000
- **后端 API**: http://localhost:5000

## 步骤 6: 创建第一个账户

1. 访问 http://localhost:3000/register
2. 填写注册信息：
   - 姓名: 你的名字
   - 邮箱: your@email.com
   - 密码: 至少 6 个字符
3. 点击"注册"
4. 自动跳转到仪表板

## 步骤 7: 处理第一个视频

1. 点击"视频处理"
2. 上传一个视频文件（支持 MP4, AVI, MOV 等）
3. 选择处理类型，例如"格式转换"
4. 选择输出格式
5. 点击"开始处理"
6. 等待处理完成
7. 点击"下载处理结果"

🎉 恭喜！您已成功运行项目！

## 可选：配置 Google OAuth

如果需要 Google 登录功能：

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建 OAuth 2.0 客户端 ID
3. 配置授权回调 URI：`http://localhost:5000/api/auth/google/callback`
4. 在后端 `.env` 文件中配置：
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```
5. 重启后端服务

## 目录结构

```
Video-Image-process/
├── backend/              # 后端服务
│   ├── src/             # 源代码
│   ├── uploads/         # 上传文件（自动创建）
│   ├── outputs/         # 处理结果（自动创建）
│   └── .env            # 环境变量配置
└── frontend/            # 前端应用
    ├── src/            # 源代码
    └── .env.local      # 环境变量配置（可选）
```

## 常用命令

### 后端

```bash
# 开发模式
npm run dev

# 生产模式
npm start

# 数据库迁移
npm run migrate
```

### 前端

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm start
```

## 故障排查

### 后端无法启动

**问题**：数据库连接失败
```
❌ Unable to connect to the database
```

**解决**：
1. 检查 MySQL 是否运行：`sudo systemctl status mysql`
2. 检查 `.env` 中的数据库配置
3. 确认数据库已创建

---

**问题**：端口 5000 已被占用
```
Error: listen EADDRINUSE: address already in use :::5000
```

**解决**：
1. 修改 `.env` 中的 `PORT` 为其他端口
2. 或关闭占用 5000 端口的程序

---

### 前端无法启动

**问题**：依赖安装失败

**解决**：
```bash
# 清除缓存
rm -rf node_modules package-lock.json
npm install
```

---

### FFmpeg 处理失败

**问题**：FFmpeg 命令未找到

**解决**：
1. 确认 FFmpeg 已安装：`ffmpeg -version`
2. 确认 FFmpeg 在系统 PATH 中
3. 重启终端或计算机

---

### 文件上传失败

**问题**：文件过大

**解决**：
修改 `backend/.env` 中的 `MAX_FILE_SIZE`（单位：字节）

---

## 下一步

- 📖 查看完整文档：[README.md](./README.md)
- 🧪 运行测试：[TESTING.md](./TESTING.md)
- 🚀 部署应用：[DEPLOYMENT.md](./DEPLOYMENT.md)

## 获取帮助

遇到问题？
- 查看详细文档
- 检查后端和前端日志
- 在 GitHub 提交 Issue

祝使用愉快！🎬🖼️

