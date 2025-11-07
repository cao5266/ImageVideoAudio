# 后端启动问题排查指南

## 快速启动（Windows）

直接双击运行 `START.bat` 文件即可自动检查并启动后端。

## 手动启动步骤

### 1. 安装依赖

```bash
cd backend
npm install
```

### 2. 创建数据库

打开 MySQL 命令行或 MySQL Workbench，执行：

```sql
CREATE DATABASE video_process_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. 配置环境变量

编辑 `backend/.env` 文件，**务必修改以下配置**：

```env
# 数据库密码（根据您的 MySQL 配置修改）
DB_PASSWORD=your_mysql_password

# 如果 MySQL 不在本地或使用不同端口，也需要修改
DB_HOST=localhost
DB_PORT=3306
```

### 4. 运行数据库迁移

```bash
npm run migrate
```

应该看到：
```
✅ Database migration completed successfully!
```

### 5. 启动服务器

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm start
```

## 常见错误及解决方案

### ❌ 错误 1: "Cannot find module"

**原因**: 依赖未安装

**解决**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ 错误 2: "Unable to connect to the database"

**原因**: 数据库配置错误或 MySQL 未运行

**解决**:
1. 确保 MySQL 服务正在运行
   ```bash
   # Windows
   net start MySQL
   
   # 或在服务管理器中启动 MySQL 服务
   ```

2. 检查 `.env` 文件中的数据库配置：
   - `DB_HOST` (默认: localhost)
   - `DB_PORT` (默认: 3306)
   - `DB_USER` (默认: root)
   - `DB_PASSWORD` (您的 MySQL 密码)
   - `DB_NAME` (默认: video_process_db)

3. 测试数据库连接：
   ```bash
   mysql -u root -p
   # 输入密码后，如果能进入 MySQL 命令行说明连接正常
   ```

---

### ❌ 错误 3: "Database 'video_process_db' doesn't exist"

**原因**: 数据库未创建

**解决**:
```sql
CREATE DATABASE video_process_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

### ❌ 错误 4: "Port 5000 is already in use"

**原因**: 端口被占用

**解决**:
1. 修改 `.env` 文件中的端口：
   ```env
   PORT=5001
   ```

2. 或关闭占用 5000 端口的程序：
   ```bash
   # Windows: 查找占用端口的进程
   netstat -ano | findstr :5000
   
   # 结束进程（PID 是上面命令显示的最后一列数字）
   taskkill /PID <PID> /F
   ```

---

### ❌ 错误 5: "ENOENT: no such file or directory, open '.env'"

**原因**: 缺少 .env 配置文件

**解决**:
项目根目录已经有 `.env` 文件，如果丢失，请重新创建或从 `.env.example` 复制。

---

### ❌ 错误 6: FFmpeg 相关错误

**原因**: FFmpeg 未安装

**解决**:
1. 安装 FFmpeg:
   ```bash
   # Windows (使用 Chocolatey)
   choco install ffmpeg
   
   # 或从官网下载: https://ffmpeg.org/download.html
   ```

2. 验证安装:
   ```bash
   ffmpeg -version
   ```

## 验证启动成功

启动成功后应该看到：

```
✅ Database connection established successfully.
✅ Database models synchronized
✅ File cleanup schedule started
🚀 Server is running on port 5000
📝 Environment: development
🌐 API URL: http://localhost:5000
```

访问 http://localhost:5000/health 应该返回：
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## 完整的启动检查清单

- [ ] Node.js 已安装 (node --version)
- [ ] MySQL 已安装并运行
- [ ] 数据库 video_process_db 已创建
- [ ] 依赖已安装 (node_modules 文件夹存在)
- [ ] .env 文件已配置（特别是 DB_PASSWORD）
- [ ] 数据库迁移已运行 (npm run migrate)
- [ ] FFmpeg 已安装（可选，不影响启动）
- [ ] uploads 和 outputs 目录已创建

## 需要帮助？

如果按照上述步骤仍然无法启动，请：

1. 查看完整的错误信息
2. 检查 `.env` 文件配置是否正确
3. 尝试手动连接 MySQL 测试数据库配置

## 下一步

后端启动成功后：

1. 测试 API: 访问 http://localhost:5000/health
2. 启动前端: `cd frontend && npm install && npm run dev`
3. 访问前端: http://localhost:3000

