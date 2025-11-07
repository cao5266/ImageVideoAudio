@echo off
echo ====================================
echo   重启后端服务器
echo ====================================
echo.

echo [1/2] 停止占用 5000 端口的进程...
node scripts/kill-port.js

echo.
echo [2/2] 启动后端服务器...
echo.

npm run dev

