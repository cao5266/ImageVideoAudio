@echo off
echo ====================================
echo   视频图片处理后端启动脚本
echo ====================================
echo.

echo [1/5] 检查 Node.js 安装...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)
echo ✅ Node.js 已安装

echo.
echo [2/5] 检查 MySQL 服务...
sc query MySQL >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  未检测到 MySQL 服务，请确保 MySQL 已安装并运行
    echo    如果 MySQL 服务名不是 'MySQL'，请手动启动
)

echo.
echo [3/5] 检查依赖安装...
if not exist "node_modules\" (
    echo ⚠️  未找到 node_modules，开始安装依赖...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
) else (
    echo ✅ 依赖已安装
)

echo.
echo [4/5] 检查必要目录...
if not exist "uploads\" (
    mkdir uploads
    echo ✅ 创建 uploads 目录
)
if not exist "outputs\" (
    mkdir outputs
    echo ✅ 创建 outputs 目录
)

echo.
echo [5/5] 检查配置文件...
if not exist ".env" (
    echo ⚠️  未找到 .env 文件
    echo    已创建默认 .env 文件，请根据您的环境修改配置
    echo    特别是数据库密码 DB_PASSWORD
    pause
)

echo.
echo ====================================
echo   启动后端服务器...
echo ====================================
echo.
echo 如果遇到数据库连接错误，请：
echo 1. 确保 MySQL 服务正在运行
echo 2. 创建数据库: CREATE DATABASE video_process_db;
echo 3. 修改 .env 文件中的数据库配置
echo.

npm run dev

