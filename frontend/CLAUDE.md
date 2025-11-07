[根目录](../CLAUDE.md) > **frontend**

# 前端模块文档

## 模块职责

基于 Next.js 14 + React 18 + TypeScript 的现代化前端应用，提供用户界面、文件上传、处理配置等功能。

## 入口与启动

### 主入口文件
- **文件**: `src/app/[locale]/layout.tsx`
- **端口**: 3000 (默认)
- **框架**: Next.js 14 (App Router)

### 启动脚本
```bash
# 开发环境
npm run dev

# 生产构建
npm run build
npm start

# 代码检查
npm run lint
npm run type-check
```

### 应用架构
- **国际化**: next-intl 多语言支持
- **样式**: Tailwind CSS + 响应式设计
- **状态管理**: Zustand
- **HTTP 客户端**: Axios

## 对外接口

### API 封装 (`src/lib/api.ts`)

#### 认证 API
- `authAPI.register()` - 用户注册
- `authAPI.login()` - 用户登录
- `authAPI.refreshToken()` - 刷新 Token
- `authAPI.getCurrentUser()` - 获取当前用户

#### 文件上传 API
- `uploadAPI.uploadSingle()` - 单文件上传
- `uploadAPI.uploadMultiple()` - 多文件上传

#### 视频处理 API
- `videoAPI.convert()` - 格式转换
- `videoAPI.compress()` - 视频压缩
- `videoAPI.cut()` - 视频裁剪
- `videoAPI.merge()` - 视频合并
- `videoAPI.rotate()` - 旋转视频
- `videoAPI.extractAudio()` - 提取音频
- `videoAPI.toGif()` - 转 GIF
- `videoAPI.addWatermark()` - 添加水印

#### 图片处理 API
- `imageAPI.convert()` - 格式转换
- `imageAPI.resize()` - 调整大小

#### 任务查询 API
- `jobAPI.getStatus()` - 查询处理状态
- `jobAPI.getHistory()` - 获取处理历史
- `jobAPI.download()` - 下载处理结果

## 关键依赖与配置

### 核心依赖
- **next**: React 框架
- **react**: UI 库
- **typescript**: 类型安全
- **tailwindcss**: CSS 框架
- **zustand**: 状态管理
- **axios**: HTTP 客户端

### UI 组件库
- **@radix-ui**: 无头组件
- **lucide-react**: 图标库
- **react-hook-form**: 表单管理
- **react-dropzone**: 文件拖拽

### 开发工具
- **eslint**: 代码检查
- **prettier**: 代码格式化
- **autoprefixer**: CSS 前缀
- **postcss**: CSS 处理

### 配置文件
- **Tailwind**: `tailwind.config.js`
- **PostCSS**: `postcss.config.js`
- **组件配置**: `components.json`
- **环境变量**: `.env.local`

## 页面结构

### 主要页面
- `src/app/[locale]/page.tsx` - 首页
- `src/app/[locale]/login/page.tsx` - 登录页
- `src/app/[locale]/register/page.tsx` - 注册页
- `src/app/[locale]/dashboard/page.tsx` - 仪表板
- `src/app/[locale]/process/video/page.tsx` - 视频处理
- `src/app/[locale]/process/image/page.tsx` - 图片处理
- `src/app/[locale]/history/page.tsx` - 处理历史
- `src/app/[locale]/profile/page.tsx` - 个人设置

### 布局组件
- `src/app/[locale]/layout.tsx` - 根布局
- 国际化支持
- 全局样式引入
- Toast 通知系统

## 核心组件

### UI 组件 (`src/components/ui/`)
- `button.tsx` - 按钮组件
- `input.tsx` - 输入框组件
- `label.tsx` - 标签组件

### 业务组件
- `Header.tsx` - 导航栏
- `FileUploader.tsx` - 文件上传组件
- `ProtectedRoute.tsx` - 路由保护组件

## 工具函数

### API 工具 (`src/lib/api.ts`)
- 自动 Token 管理
- 请求/响应拦截器
- Token 自动刷新
- 错误处理

### 工具函数 (`src/lib/utils.ts`)
- 通用工具函数
- 样式合并工具
- 类型定义

## 测试与质量

### 测试策略
- 组件单元测试
- 页面集成测试
- API 接口测试
- 移动端适配测试

### 质量工具
- **TypeScript**: 类型检查
- **ESLint**: 代码规范
- **Prettier**: 代码格式化
- **Next.js**: 内置优化

### 性能优化
- 代码分割
- 图片懒加载
- 静态资源优化
- 响应式设计

## 常见问题 (FAQ)

### Token 管理问题
1. 检查 localStorage 权限
2. 验证 Token 自动刷新逻辑
3. 确认 API URL 配置

### 文件上传失败
1. 检查文件大小限制
2. 验证文件类型支持
3. 确认网络连接

### 国际化问题
1. 检查语言包配置
2. 验证路由参数
3. 确认消息文件存在

## 相关文件清单

### 页面文件
- `src/app/[locale]/page.tsx` - 首页
- `src/app/[locale]/login/page.tsx` - 登录页
- `src/app/[locale]/register/page.tsx` - 注册页

### 组件文件
- `src/components/ui/button.tsx` - 按钮组件
- `src/components/ui/input.tsx` - 输入框组件
- `src/components/ui/label.tsx` - 标签组件

### 工具文件
- `src/lib/api.ts` - API 封装
- `src/lib/utils.ts` - 工具函数

### 样式文件
- `src/app/globals.css` - 全局样式
- `tailwind.config.js` - Tailwind 配置

## 变更记录 (Changelog)

### 2025-10-29
- 创建前端模块 CLAUDE.md
- 记录模块结构和接口
- 描述页面和组件
- 列出相关文件清单

### 覆盖率
- 已扫描文件: 12/35 (34%)
- 主要缺口: 剩余页面和组件
- 建议: 扫描剩余前端文件，添加测试