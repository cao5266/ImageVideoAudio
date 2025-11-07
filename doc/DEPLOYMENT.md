# 部署指南

本文档提供详细的部署步骤，帮助您将应用部署到生产环境。

## 目录

1. [准备工作](#准备工作)
2. [后端部署（云服务器）](#后端部署云服务器)
3. [前端部署](#前端部署)
4. [Google OAuth 配置](#google-oauth-配置)
5. [SSL 证书配置](#ssl-证书配置)
6. [性能优化](#性能优化)
7. [监控和维护](#监控和维护)

## 准备工作

### 服务器要求

- **操作系统**: Ubuntu 20.04 LTS 或更高版本
- **CPU**: 2核心以上
- **内存**: 4GB 以上
- **存储**: 50GB 以上
- **网络**: 公网 IP 和域名

### 安装基础软件

```bash
# 更新系统
sudo apt update
sudo apt upgrade -y

# 安装 Node.js (使用 NodeSource)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node --version
npm --version

# 安装 MySQL
sudo apt install -y mysql-server
sudo mysql_secure_installation

# 安装 FFmpeg
sudo apt install -y ffmpeg

# 验证 FFmpeg
ffmpeg -version

# 安装 Nginx
sudo apt install -y nginx

# 安装 PM2
sudo npm install -g pm2
```

## 后端部署（云服务器）

### 1. 克隆代码

```bash
# 创建应用目录
sudo mkdir -p /var/www
cd /var/www

# 克隆代码（使用你的仓库地址）
git clone <your-repository-url> video-process
cd video-process/backend
```

### 2. 安装依赖

```bash
npm install --production
```

### 3. 配置数据库

```bash
# 登录 MySQL
sudo mysql -u root -p

# 创建数据库和用户
CREATE DATABASE video_process_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'video_user'@'localhost' IDENTIFIED BY 'your_strong_password';
GRANT ALL PRIVILEGES ON video_process_db.* TO 'video_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 4. 配置环境变量

```bash
# 创建生产环境配置
cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=video_process_db
DB_USER=video_user
DB_PASSWORD=your_strong_password

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback

# Frontend URL
FRONTEND_URL=https://yourdomain.com

# File Upload Configuration
MAX_FILE_SIZE=524288000
UPLOAD_DIR=uploads
OUTPUT_DIR=outputs
FILE_RETENTION_HOURS=24
EOF

# 设置文件权限
chmod 600 .env
```

### 5. 运行数据库迁移

```bash
npm run migrate
```

### 6. 创建必要的目录

```bash
mkdir -p uploads outputs
chmod 755 uploads outputs
```

### 7. 使用 PM2 启动应用

```bash
# 启动应用
pm2 start src/server.js --name video-process-api

# 保存 PM2 配置
pm2 save

# 设置开机自启
pm2 startup
# 执行命令输出的指令
```

### 8. 配置 Nginx 反向代理

```bash
# 创建 Nginx 配置文件
sudo nano /etc/nginx/sites-available/video-process-api
```

添加以下内容：

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    # 日志配置
    access_log /var/log/nginx/video-process-api-access.log;
    error_log /var/log/nginx/video-process-api-error.log;

    # 文件上传大小限制
    client_max_body_size 500M;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        
        # 代理头设置
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # 超时设置
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
        
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置：

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/video-process-api /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

## 前端部署

### 方案 1: Vercel 部署（推荐）

1. **推送代码到 GitHub**

```bash
# 在本地
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **在 Vercel 部署**

- 访问 https://vercel.com
- 登录并点击 "New Project"
- 导入 GitHub 仓库
- 选择 `frontend` 目录作为根目录
- 配置环境变量：
  - `NEXT_PUBLIC_API_URL`: `https://api.yourdomain.com`
  - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: `your-google-client-id`
- 点击 "Deploy"

3. **配置自定义域名**

- 在 Vercel 项目设置中添加自定义域名
- 更新 DNS 记录指向 Vercel

### 方案 2: 云服务器部署

```bash
cd /var/www/video-process/frontend

# 安装依赖
npm install

# 构建生产版本
npm run build

# 使用 PM2 启动
pm2 start npm --name "video-process-frontend" -- start
pm2 save
```

配置 Nginx：

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Google OAuth 配置

### 1. 创建 Google Cloud 项目

1. 访问 https://console.cloud.google.com/
2. 创建新项目或选择现有项目
3. 在左侧菜单选择 "API和服务" > "凭据"

### 2. 配置 OAuth 同意屏幕

1. 点击 "配置同意屏幕"
2. 选择 "外部" 用户类型
3. 填写应用信息：
   - 应用名称
   - 用户支持电子邮件
   - 开发者联系信息
4. 添加作用域：`email`, `profile`, `openid`
5. 保存并继续

### 3. 创建 OAuth 客户端 ID

1. 点击 "创建凭据" > "OAuth 客户端 ID"
2. 应用类型选择 "Web 应用"
3. 添加授权的重定向 URI：
   - `https://api.yourdomain.com/api/auth/google/callback`
4. 保存并复制 Client ID 和 Client Secret
5. 更新后端 `.env` 文件中的配置

## SSL 证书配置

使用 Let's Encrypt 免费 SSL 证书：

```bash
# 安装 Certbot
sudo apt install -y certbot python3-certbot-nginx

# 为后端 API 申请证书
sudo certbot --nginx -d api.yourdomain.com

# 为前端申请证书（如果部署在服务器上）
sudo certbot --nginx -d yourdomain.com

# 设置自动续期
sudo certbot renew --dry-run
```

Certbot 会自动修改 Nginx 配置，添加 SSL 相关设置。

## 性能优化

### 1. 数据库优化

```sql
-- 为常用查询添加索引
USE video_process_db;

CREATE INDEX idx_user_email ON users(email);
CREATE INDEX idx_job_user_status ON processing_jobs(user_id, status);
CREATE INDEX idx_job_created ON processing_jobs(created_at);
CREATE INDEX idx_refresh_token ON refresh_tokens(token);
```

### 2. Nginx 缓存配置

编辑 Nginx 配置，添加静态资源缓存：

```nginx
# 静态资源缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. PM2 集群模式

```bash
# 停止当前进程
pm2 stop video-process-api

# 使用集群模式启动（利用多核 CPU）
pm2 start src/server.js -i max --name video-process-api

pm2 save
```

### 4. 启用 Gzip 压缩

编辑 Nginx 配置：

```nginx
# 启用 Gzip
gzip on;
gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_types text/plain text/css text/xml application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;
```

## 监控和维护

### 1. PM2 监控

```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs video-process-api

# 查看实时监控
pm2 monit

# 重启应用
pm2 restart video-process-api
```

### 2. 日志管理

```bash
# 配置日志轮转
pm2 install pm2-logrotate

# 设置日志保留天数
pm2 set pm2-logrotate:retain 7

# 设置日志最大大小
pm2 set pm2-logrotate:max_size 100M
```

### 3. 定期备份

创建备份脚本：

```bash
#!/bin/bash
# /root/backup.sh

BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# 备份数据库
mysqldump -u video_user -p'your_password' video_process_db > $BACKUP_DIR/db_$DATE.sql

# 备份上传文件（可选）
# tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/video-process/backend/uploads

# 删除 7 天前的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete

echo "Backup completed: $DATE"
```

设置定时任务：

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2 点备份
0 2 * * * /root/backup.sh >> /root/backup.log 2>&1
```

### 4. 文件清理监控

确保文件清理服务正常运行：

```bash
# 查看后端日志，确认清理任务执行
pm2 logs video-process-api | grep "cleanup"
```

### 5. 系统监控

```bash
# 安装系统监控工具
sudo apt install -y htop

# 查看系统资源使用
htop

# 查看磁盘使用
df -h

# 查看目录大小
du -sh /var/www/video-process/backend/uploads
du -sh /var/www/video-process/backend/outputs
```

## 常见问题排查

### 后端无法启动

```bash
# 检查端口占用
sudo lsof -i :5000

# 检查 PM2 日志
pm2 logs video-process-api --lines 100

# 检查环境变量
pm2 env 0
```

### 数据库连接失败

```bash
# 测试数据库连接
mysql -u video_user -p video_process_db

# 检查 MySQL 服务状态
sudo systemctl status mysql
```

### FFmpeg 处理失败

```bash
# 验证 FFmpeg 安装
which ffmpeg
ffmpeg -version

# 检查文件权限
ls -la /var/www/video-process/backend/uploads
ls -la /var/www/video-process/backend/outputs
```

### Nginx 502 错误

```bash
# 检查后端是否运行
pm2 status

# 检查 Nginx 错误日志
sudo tail -f /var/log/nginx/video-process-api-error.log

# 测试 Nginx 配置
sudo nginx -t
```

## 安全建议

1. **定期更新系统和软件包**
```bash
sudo apt update && sudo apt upgrade -y
```

2. **配置防火墙**
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

3. **限制 SSH 登录**
- 禁用 root 登录
- 使用 SSH 密钥认证
- 修改默认 SSH 端口

4. **定期检查日志**
```bash
# 检查异常登录
sudo tail -f /var/log/auth.log

# 检查 Nginx 访问日志
sudo tail -f /var/log/nginx/video-process-api-access.log
```

## 总结

完成以上步骤后，您的应用应该已经成功部署并运行。记得：

- ✅ 定期备份数据库
- ✅ 监控系统资源使用
- ✅ 检查日志文件
- ✅ 更新依赖包
- ✅ 定期更新 SSL 证书

如遇到问题，请查看日志文件或提交 Issue。

