# 前端项目开发规范 (MediaPro)

## 🎯 项目概述

**项目名称**: MediaPro - 多媒体处理平台  
**技术栈**: Next.js 14 + React 18 + TypeScript + Tailwind CSS + shadcn/ui  
**国际化**: next-intl (支持中文/英文)  
**状态管理**: Zustand + persist 中间件  
**UI 组件库**: shadcn/ui + lucide-react  
**核心功能**: 图片处理、音频处理、视频处理

**路由结构**:
- `/[locale]/tools/image` - 图片处理
- `/[locale]/tools/audio` - 音频处理
- `/[locale]/tools/video` - 视频处理
- `/[locale]/profile` - 个人设置
- `/[locale]/history` - 处理历史

---

## 📂 目录结构规范

```
frontend/src/
├── app/[locale]/              # 多语言路由（必须使用 [locale] 前缀）
│   ├── (auth)/               # 路由组：认证相关
│   ├── (main)/               # 路由组：主功能
│   ├── (process)/            # 路由组：处理功能
│   ├── layout.tsx            # 多语言布局（包含 NextIntlClientProvider）
│   └── page.tsx
│
├── components/
│   ├── common/               # 通用组件（无业务逻辑）
│   ├── layout/               # 布局组件（Header, Footer）
│   ├── features/             # 功能组件（业务相关）
│   └── ui/                   # shadcn/ui 组件（不要修改）
│
├── services/api/             # API 服务层
│   ├── client.ts            # Axios 配置
│   ├── auth.service.ts
│   ├── upload.service.ts
│   ├── image.service.ts
│   ├── video.service.ts
│   ├── job.service.ts
│   └── index.ts
│
├── stores/                   # 状态管理
│   ├── auth.store.ts
│   └── index.ts
│
├── types/                    # TypeScript 类型定义
│   ├── auth.types.ts
│   ├── file.types.ts
│   ├── process.types.ts
│   ├── api.types.ts
│   └── index.ts
│
├── constants/                # 常量管理
│   ├── app.constants.ts
│   ├── api.constants.ts
│   ├── routes.constants.ts
│   ├── file.constants.ts
│   └── index.ts
│
├── utils/                    # 工具函数
│   ├── format.ts
│   ├── validation.ts
│   └── index.ts
│
├── hooks/                    # 自定义 Hooks
│   └── use-toast.ts
│
├── i18n.ts                  # 国际化配置
└── middleware.ts            # 路由中间件
```

---

## 🔧 技术栈配置

### 1. shadcn/ui 组件库

**已安装组件** (15个):
- 表单: Button, Input, Label, Form, Select
- 展示: Card, Alert, Badge, Progress
- 交互: Dialog, Dropdown Menu, Toast, Toaster
- 其他: Separator, Tabs

**使用方式**:
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function MyComponent() {
    const { toast } = useToast()
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>标题</CardTitle>
            </CardHeader>
            <CardContent>
                <Button onClick={() => toast({ title: "成功" })}>
                    点击我
                </Button>
            </CardContent>
        </Card>
    )
}
```

**添加新组件**:
```bash
npx shadcn@latest add [component-name]
```

### 2. 国际化 (next-intl)

**路由结构**: 所有路由必须包含语言前缀
- `/zh/dashboard` - 中文仪表板
- `/en/dashboard` - 英文仪表板

**关键配置**:
- `src/i18n.ts` - 国际化配置
- `src/middleware.ts` - 路由中间件
- `messages/zh.json` - 中文翻译
- `messages/en.json` - 英文翻译

**重要**: `NextIntlClientProvider` 必须同时传递 `locale` 和 `messages`:
```tsx
<NextIntlClientProvider locale={locale} messages={messages}>
    {children}
</NextIntlClientProvider>
```

**使用翻译**:
```tsx
// 服务端组件
import { useTranslations } from 'next-intl'

export default function Page() {
    const t = useTranslations('auth')
    return <h1>{t('loginTitle')}</h1>
}

// 客户端组件
'use client'
import { useTranslations, useLocale } from 'next-intl'

export default function Component() {
    const t = useTranslations('nav')
    const locale = useLocale()
    return <Link href={`/${locale}/dashboard`}>{t('dashboard')}</Link>
}
```

**语言切换器**:
- 已创建 `LanguageSwitcher` 组件
- 从 pathname 中智能提取当前语言
- 正确处理语言前缀，避免重复

### 3. 状态管理 (Zustand)

**使用新的 stores 结构**:
```tsx
import { useAuthStore } from '@/stores'

function Component() {
    const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore()
}
```

**状态持久化**: 使用 `persist` 中间件自动同步到 localStorage
```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            setAuth: (user, tokens) => set({ user, ...tokens, isAuthenticated: true }),
            clearAuth: () => set({ user: null, isAuthenticated: false })
        }),
        {
            name: 'auth-storage',  // localStorage key
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
```

**重要**: 使用 persist 后，不需要手动调用 `loadAuthFromStorage()`，状态会自动恢复

### 4. API 服务层

**使用新的 services 结构**:
```tsx
import { authService, imageService, uploadService } from '@/services/api'

// 登录
const response = await authService.login({ email, password })

// 上传文件
const file = await uploadService.uploadSingle(fileObject)

// 图片处理
const job = await imageService.convert({ fileId, outputFormat: 'png' })
```

**自动功能**:
- ✅ 自动添加 Authorization header
- ✅ Token 过期自动刷新
- ✅ 401 错误自动重定向到登录

---

## 📝 代码规范

### 1. 组件规范

**组件文件结构**:
```
ComponentName/
├── index.ts                      # 导出: export { default } from './ComponentName'
├── ComponentName.tsx            # 组件实现
├── ComponentName.types.ts       # 类型定义 (可选)
└── ComponentName.test.tsx       # 测试文件 (可选)
```

**组件模板**:
```tsx
'use client' // 仅客户端组件需要

import { useTranslations } from 'next-intl'
import type { ComponentProps } from './ComponentName.types'

export default function ComponentName({ prop1, prop2 }: ComponentProps) {
    const t = useTranslations('namespace')
    
    return (
        <div className='container'>
            {/* 组件内容 */}
        </div>
    )
}
```

### 2. 页面规范

**页面必须在 `[locale]` 下**:
```
app/[locale]/
├── login/page.tsx
├── dashboard/page.tsx
└── process/image/page.tsx
```

**页面模板**:
```tsx
import { useTranslations } from 'next-intl'
import Header from '@/components/layout/Header'

export default function MyPage() {
    const t = useTranslations('pageName')
    
    return (
        <div>
            <Header />
            <main>
                <h1>{t('title')}</h1>
            </main>
        </div>
    )
}
```

### 3. 客户端组件规范

**何时使用 'use client'**:
- 使用 React hooks (useState, useEffect 等)
- 需要浏览器 API
- 需要事件处理
- 使用 zustand store

**客户端组件模板**:
```tsx
'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

export default function ClientComponent() {
    const locale = useLocale()
    const t = useTranslations()
    const [state, setState] = useState()
    
    return <div>{/* ... */}</div>
}
```

### 4. API 调用规范

**使用 services 层**:
```tsx
import { authService } from '@/services/api'
import { useAuthStore } from '@/stores'

const handleLogin = async (credentials) => {
    try {
        const { user, accessToken, refreshToken } = await authService.login(credentials)
        setAuth(user, { accessToken, refreshToken })
    } catch (error) {
        // 错误处理
    }
}
```

### 5. 类型定义规范

**使用集中的类型定义**:
```tsx
import type { User, AuthResponse, ProcessingJob } from '@/types'
```

**组件 Props 类型**:
```tsx
interface MyComponentProps {
    title: string
    onSubmit: (data: FormData) => void
    isLoading?: boolean
}

export default function MyComponent({ title, onSubmit, isLoading = false }: MyComponentProps) {
    // ...
}
```

### 6. 常量使用规范

**使用集中的常量**:
```tsx
import { API_ENDPOINTS, ROUTES, FILE_SIZE_LIMITS, STORAGE_KEYS } from '@/constants'

// API 调用
apiClient.post(API_ENDPOINTS.AUTH.LOGIN, data)

// 路由
router.push(ROUTES.DASHBOARD)

// 文件大小限制
maxSize={FILE_SIZE_LIMITS.IMAGE}

// localStorage
localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
```

---

## 🌍 国际化开发规范

### 1. 路由结构

**所有 URL 必须包含语言前缀**:
- ✅ `/zh/dashboard`
- ✅ `/en/login`
- ❌ `/dashboard` (错误)

### 2. 链接使用

**内部链接必须包含语言前缀**:
```tsx
import { useLocale } from 'next-intl'
import Link from 'next/link'

function MyComponent() {
    const locale = useLocale()
    return <Link href={`/${locale}/dashboard`}>Dashboard</Link>
}
```

### 3. 翻译文件结构

**使用嵌套结构组织翻译**:
```json
{
  "nav": {
    "dashboard": "Dashboard",
    "login": "Login"
  },
  "auth": {
    "loginTitle": "Welcome Back",
    "emailPlaceholder": "your@email.com"
  }
}
```

### 4. 使用翻译

**使用命名空间**:
```tsx
const t = useTranslations('auth')
// t('loginTitle') -> "Welcome Back"
```

**嵌套访问**:
```tsx
const t = useTranslations()
// t('auth.loginTitle') -> "Welcome Back"
```

### 5. 语言切换

**已有 LanguageSwitcher 组件**:
```tsx
import LanguageSwitcher from '@/components/features/language/LanguageSwitcher'

<LanguageSwitcher />
```

**核心逻辑**:
- 从 pathname 提取当前语言
- 移除旧语言前缀，添加新语言前缀
- 使用 `router.push()` 导航

---

## 🎨 UI 组件使用规范

### 1. 优先使用 shadcn/ui 组件

**而不是手写组件**:
```tsx
// ✅ 好的做法
import { Button } from '@/components/ui/button'
<Button variant='outline'>Click</Button>

// ❌ 避免
<button className='px-4 py-2 border...'>Click</button>
```

### 布局和样式规范

**统一的容器宽度**:
```tsx
// 所有主要页面使用统一的容器宽度
<div className='container mx-auto px-4 py-6 max-w-[1600px]'>
    {/* 页面内容 */}
</div>
```

**最小高度设置**:
```tsx
// Header 高度固定为 64px (h-16)
// 内容区域应该是 100vh - 64px，避免出现滚动条
<div>
    <Header />  {/* h-16 = 64px */}
    <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-purple-50'>
        {/* 内容 */}
    </div>
</div>
```

**统一的背景渐变**:
```tsx
className='bg-gradient-to-br from-blue-50 via-white to-purple-50'
```

**间距规范**:
- 页面内边距: `px-4 py-6`
- 标题下间距: `mb-6`
- Card 间距: `gap-4`
- 标签页高度: 主标签 `h-auto p-1`，内部标签 `px-3 py-2`

### 2. 组件变体

**Button 变体**:
```tsx
<Button variant='default'>默认</Button>
<Button variant='destructive'>危险</Button>
<Button variant='outline'>轮廓</Button>
<Button variant='ghost'>幽灵</Button>  {/* 无背景，常用于图标按钮 */}
<Button variant='link'>链接</Button>
```

**Button 尺寸**:
```tsx
<Button size='lg'>大</Button>
<Button size='default'>默认</Button>
<Button size='sm'>小</Button>
<Button size='icon'>图标</Button>

// 自定义图标按钮
<Button variant='ghost' className='w-9 h-9 p-0' title='提示文本'>
    <Download className='h-4 w-4' />
</Button>
```

**Tabs 使用规范**:
```tsx
// 主标签页 - 较大
<TabsList className='grid w-full grid-cols-2 h-auto p-1'>
    <TabsTrigger value='tab1' className='text-sm px-3 py-2'>
        <Icon className='h-4 w-4 mr-2' />
        标签1
    </TabsTrigger>
</TabsList>

// 次级标签页 - 较小
<TabsList className='grid w-full grid-cols-4 h-auto p-1'>
    <TabsTrigger value='sub1' className='text-sm px-3 py-1.5'>
        <Icon className='h-4 w-4 mr-1' />
        子标签1
    </TabsTrigger>
</TabsList>
```

**Card 使用规范**:
```tsx
<Card className='sticky top-20'>  {/* 左侧固定卡片 */}
    <CardHeader className='pb-3'>
        <CardTitle className='text-lg'>标题</CardTitle>
        <CardDescription className='text-xs'>描述</CardDescription>
    </CardHeader>
    <CardContent className='space-y-4'>
        {/* 内容 */}
    </CardContent>
</Card>
```

### 3. Form 组件

**集成 react-hook-form**:
```tsx
import { useForm } from 'react-hook-form'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function MyForm() {
    const form = useForm()

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>邮箱</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit'>提交</Button>
            </form>
        </Form>
    )
}
```

### 4. Toast 通知

**已在 layout 中配置 Toaster**:
```tsx
import { useToast } from '@/hooks/use-toast'

function MyComponent() {
    const { toast } = useToast()

    toast({
        title: '成功',
        description: '操作完成'
    })

    toast({
        title: '错误',
        description: '操作失败',
        variant: 'destructive'
    })
}
```

### 5. Dialog 使用规范

**用于显示处理结果或详细信息**:
```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className='max-w-2xl'>
        <DialogHeader>
            <DialogTitle>标题</DialogTitle>
            <DialogDescription>描述</DialogDescription>
        </DialogHeader>
        <div>{/* 内容 */}</div>
    </DialogContent>
</Dialog>
```

### 6. DropdownMenu 使用规范

**用于下拉菜单**:
```tsx
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

<DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
            <User className='h-5 w-5' />
            <span>用户名</span>
            <ChevronDown className='h-4 w-4' />
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem asChild>
            <Link href='/profile'>个人设置</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>退出登录</DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
```

---

## 🔐 认证和路由保护

### 1. 路由保护

**使用 ProtectedRoute**:
```tsx
import ProtectedRoute from '@/components/common/ProtectedRoute'

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    )
}
```

**ProtectedRoute 工作原理**:
- 自动检查 `isAuthenticated` 状态（从 persist 恢复）
- 未登录用户重定向到 `/[locale]/login`
- 显示加载动画，避免闪烁

### 2. 认证状态

**使用 authStore**:
```tsx
import { useAuthStore } from '@/stores'

function MyComponent() {
    const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore()
    
    if (!isAuthenticated) {
        return <div>请登录</div>
    }
    
    return <div>欢迎, {user?.name}</div>
}
```

**重要**: 不需要手动调用 `loadAuthFromStorage()`，persist 中间件会自动处理

### 3. 登录流程

```tsx
import { authAPI } from '@/lib/api'
import { useAuthStore } from '@/stores'

const handleLogin = async (credentials) => {
    try {
        const response = await authAPI.login(credentials)
        const { user, accessToken, refreshToken } = response.data
        setAuth(user, { accessToken, refreshToken })
        router.push(`/${locale}/dashboard`)
    } catch (error) {
        // 错误处理
    }
}
```

### 4. 登出流程

```tsx
const handleLogout = () => {
    clearAuth()  // 自动清除 localStorage
    router.push(`/${locale}`)
}
```

---

## 📏 代码风格规范

### 1. ESLint 规则

- ✅ 优先使用 `const`
- ⚠️ `console.log` 会警告（使用 console.error 或 console.warn）
- ⚠️ `any` 类型会警告
- ❌ 禁止使用 `var`

### 2. Prettier 格式化

- 不使用分号
- 使用单引号（JSX 属性可以用单引号或双引号，保持一致）
- 缩进：4 空格
- 每行最大：120 字符

### 3. 样式类名规范

**使用 Tailwind CSS**:
```tsx
// ✅ 好的做法 - 使用 Tailwind 原子类
<div className='flex items-center gap-3 p-4 bg-white rounded-lg shadow-md'>

// ❌ 避免 - 内联样式
<div style={{ display: 'flex', padding: '16px' }}>

// ✅ 条件类名 - 使用 cn 工具函数
import { cn } from '@/lib/utils'
<div className={cn(
    'base-class',
    isActive && 'active-class',
    error && 'error-class'
)} />
```

**常用的类名组合**:
```tsx
// 卡片容器
className='bg-white rounded-lg shadow-md p-6'

// 渐变背景
className='bg-gradient-to-br from-blue-50 via-white to-purple-50'

// 居中容器
className='flex items-center justify-center min-h-screen'

// 网格布局
className='grid grid-cols-1 xl:grid-cols-4 gap-4'

// 固定定位
className='sticky top-20'

// 可滚动区域
className='max-h-[600px] overflow-y-auto'
```

### 3. 命名规范

**组件**: PascalCase
```tsx
export default function UserProfile() { }
```

**函数/变量**: camelCase
```tsx
const handleSubmit = () => { }
const isLoading = true
```

**常量**: UPPER_SNAKE_CASE
```tsx
export const API_BASE_URL = '...'
export const MAX_FILE_SIZE = 50 * 1024 * 1024
```

**类型/接口**: PascalCase
```tsx
interface User { }
type AuthState = { }
```

**文件名**:
- 组件: `ComponentName.tsx`
- 服务: `xxx.service.ts`
- Store: `xxx.store.ts`
- 类型: `xxx.types.ts`
- 常量: `xxx.constants.ts`

---

## 🔄 组件开发工作流

### 1. 创建新组件

```bash
# 1. 选择合适的目录
components/
├── common/          # 通用组件
├── layout/          # 布局组件
└── features/        # 功能组件

# 2. 创建组件文件夹
mkdir -p src/components/features/my-feature/MyComponent

# 3. 创建文件
- index.ts
- MyComponent.tsx
- MyComponent.types.ts (可选)
```

### 2. 组件模板

```tsx
// MyComponent.tsx
'use client' // 如果需要

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { MyComponentProps } from './MyComponent.types'

export default function MyComponent({ title, onAction }: MyComponentProps) {
    const t = useTranslations('namespace')
    
    return (
        <div className='p-4'>
            <h2>{title}</h2>
            <Button onClick={onAction}>{t('action')}</Button>
        </div>
    )
}
```

```tsx
// MyComponent.types.ts
export interface MyComponentProps {
    title: string
    onAction: () => void
    isLoading?: boolean
}
```

```tsx
// index.ts
export { default } from './MyComponent'
export type { MyComponentProps } from './MyComponent.types'
```

### 3. 导入组件

```tsx
import MyComponent from '@/components/features/my-feature/MyComponent'
```

---

## 🛣️ 路由规范

### 1. 路由常量

**使用 routes.constants.ts**:
```tsx
import { ROUTES, getLocalizedRoute } from '@/constants'

// 获取带语言的路由
const dashboardUrl = getLocalizedRoute(ROUTES.DASHBOARD, locale)
```

### 2. 页面组织

**使用路由组 (Route Groups)**:
```
app/[locale]/
├── (auth)/              # 不影响 URL
│   ├── login/
│   └── register/
├── (main)/
│   ├── dashboard/
│   └── profile/
└── (process)/
    └── process/
```

### 3. 动态路由

```tsx
// app/[locale]/user/[id]/page.tsx
export default function UserPage({ params }: { params: { id: string, locale: string } }) {
    const t = useTranslations()
    return <div>User ID: {params.id}</div>
}
```

---

## 🎯 最佳实践

### 1. 组件设计

✅ **好的做法**:
- 组件保持小而专注（< 200 行）
- 提取业务逻辑到 hooks
- 使用 TypeScript 定义所有 props
- 避免深层嵌套（< 3 层）
- 使用 shadcn/ui 组件而不是手写样式

❌ **避免**:
- 组件过大（> 500 行）
- 在组件中直接调用 API
- 使用 `any` 类型
- 硬编码文本（应使用翻译）
- 手写基础 UI 组件（button, input 等）

### 2. 状态管理

✅ **好的做法**:
- 全局状态 → Zustand + persist 中间件
- 本地状态 → useState
- 表单状态 → react-hook-form
- 服务器状态 → 直接从 API 获取
- 列表数据 → 使用 useState 管理

❌ **避免**:
- 过度使用全局状态
- prop drilling（层层传递 props）
- 在多个组件中重复调用 loadAuthFromStorage()

### 3. 页面布局设计原则

✅ **好的做法**:
- 左右分栏布局（1:3 或 1:4 比例）
- 左侧固定（sticky top-20），右侧可滚动
- 使用 Card 组件分组内容
- 历史记录/结果列表设置最大高度并可滚动
- 使用 Dialog 展示详细信息，而不是占用页面空间

**示例布局**:
```tsx
<div className='grid grid-cols-1 xl:grid-cols-4 gap-4'>
    <div className='xl:col-span-1'>
        <Card className='sticky top-20'>
            {/* 固定的侧边栏：上传、文件列表等 */}
        </Card>
    </div>
    <div className='xl:col-span-3'>
        <Card>
            {/* 主工作区：处理选项、结果等 */}
        </Card>
    </div>
</div>
```

### 3. 性能优化

✅ **好的做法**:
- 使用 `React.memo` 优化重渲染
- 大列表使用虚拟滚动
- 图片使用 Next.js Image 组件
- 路由使用 `<Link>` 组件

### 4. 错误处理

✅ **好的做法**:
```tsx
try {
    const result = await someAPI()
} catch (error) {
    toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive'
    })
}
```

### 5. 加载状态

✅ **好的做法**:
```tsx
const [loading, setLoading] = useState(false)

{loading ? (
    <LoadingSpinner />
) : (
    <Content />
)}
```

---

## 🔧 工具和配置

### 1. 路径别名

已配置以下别名:
```
@/components/*  → src/components/*
@/hooks/*       → src/hooks/*
@/services/*    → src/services/*
@/stores/*      → src/stores/*
@/types/*       → src/types/*
@/constants/*   → src/constants/*
@/utils/*       → src/utils/*
```

### 2. 工具函数

**格式化**:
```tsx
import { formatFileSize, formatDate, formatDuration } from '@/utils'

formatFileSize(1024000)  // "1 MB"
formatDate(new Date())   // "2025-10-27 10:30:00"
```

**验证**:
```tsx
import { isValidEmail, isValidPassword, isValidFileType } from '@/utils'

if (!isValidEmail(email)) {
    // 错误处理
}
```

**类名合并**:
```tsx
import { cn } from '@/utils'

<div className={cn(
    'base-class',
    isActive && 'active-class',
    className
)} />
```

### 3. 常用 Hooks

```tsx
import { useAuthStore } from '@/stores'
import { useLocale, useTranslations } from 'next-intl'
import { useToast } from '@/hooks/use-toast'
import { useRouter, usePathname } from 'next/navigation'
```

---

## 📋 开发检查清单

### 新功能开发

- [ ] 创建必要的类型定义 (`types/`)
- [ ] 创建 API 服务 (`services/api/`)
- [ ] 创建 Zustand store (如需要)
- [ ] 创建自定义 hooks (如需要)
- [ ] 创建组件（遵循目录结构）
- [ ] 添加翻译键 (`messages/zh.json`, `messages/en.json`)
- [ ] 测试中英文切换
- [ ] 测试响应式布局
- [ ] 运行 ESLint 检查
- [ ] 测试构建: `npm run build`

### 代码提交前

- [ ] 运行 `npm run lint`
- [ ] 运行 `npm run type-check`
- [ ] 运行 `npm run build`
- [ ] 测试主要功能
- [ ] 检查控制台无错误

---

## 🚨 常见问题和解决方案

### 1. 语言切换问题

**问题**: 切换语言后 URL 变成 `/en/en/...`

**原因**: pathname 处理不当

**解决**: 使用提供的 LanguageSwitcher 组件，它已正确处理

### 2. 翻译不显示

**问题**: 使用了 `useTranslations()` 但显示的是键名

**原因**: 
- `NextIntlClientProvider` 没有传递 `locale` prop
- 翻译文件中缺少对应的键

**解决**: 
```tsx
// layout.tsx
<NextIntlClientProvider locale={locale} messages={messages}>
```

### 3. 客户端组件中获取不到 locale

**问题**: `useLocale()` 返回 undefined

**原因**: 组件不在 `NextIntlClientProvider` 内

**解决**: 确保组件被 `[locale]/layout.tsx` 包裹

### 4. API 调用 401 错误

**问题**: 接口返回 401 未授权

**原因**: Token 过期或未登录

**解决**: apiClient 已自动处理 token 刷新和重定向

### 5. 路由 404

**问题**: 访问 `/dashboard` 返回 404

**原因**: 忘记添加语言前缀

**解决**: 使用 `/zh/dashboard` 或 `/en/dashboard`

---

## 📚 学习资源

### 官方文档
- [Next.js 14](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [next-intl](https://next-intl-docs.vercel.app/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### 项目文档
- `ARCHITECTURE.md` - 详细架构说明
- `SHADCN_USAGE.md` - UI 组件使用指南
- `README.md` - 项目简介

---

## ✅ 重构完成清单

### 已完成
- [x] 创建 `types/` 目录和类型定义
- [x] 创建 `constants/` 目录和常量管理
- [x] 创建 `services/api/` 重构 API 层
- [x] 创建 `stores/` 重构状态管理
- [x] 创建 `utils/` 工具函数
- [x] 重构组件到 `common/`, `layout/`, `features/`
- [x] 配置 ESLint 和 Prettier
- [x] 配置 TypeScript 路径别名
- [x] 创建工程化文档

### 兼容性
- [x] ~~保留 `lib/api.ts` 和 `lib/store.ts` 向后兼容~~
- [x] 已删除重复的 `lib/store.ts`
- [x] 统一使用 `@/stores` 导入
- [x] 所有页面已迁移到新的 stores 结构

### 最新更新
- [x] 实现 Zustand persist 中间件持久化登录状态
- [x] 优化 ProtectedRoute 逻辑，去除不必要的 loadAuthFromStorage 调用
- [x] 统一页面容器宽度为 max-w-[1600px]
- [x] 统一最小高度为 min-h-[calc(100vh-64px)]
- [x] 实现图片处理页面（格式转换、调整大小、压缩、裁剪）
- [x] 创建音频处理页面（基础框架）
- [x] 优化 Header 导航（DropdownMenu 实现用户菜单）
- [x] 语言切换器显示 "Chinese" 和 "English"
- [x] 三大处理模块：图片、音频、视频

---

## 📄 页面开发模板

### 1. 标准处理页面模板

**适用于图片、视频、音频处理页面**:
```tsx
'use client'

import { useState } from 'react'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import Header from '@/components/layout/Header'
import FileUploader from '@/components/features/file-upload/FileUploader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'

function ProcessContent() {
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
    const [processType, setProcessType] = useState('convert')
    const [processing, setProcessing] = useState(false)
    const [results, setResults] = useState<any[]>([])
    const [progress, setProgress] = useState(0)
    const [activeTab, setActiveTab] = useState('process')
    const [historyResults, setHistoryResults] = useState<any[]>([])

    const handleUploadSuccess = (fileInfo: any) => {
        const files = Array.isArray(fileInfo) ? fileInfo : [fileInfo]
        setUploadedFiles(files)
        setResults([])
        setProgress(0)
    }

    const handleProcess = async () => {
        // 处理逻辑
    }

    return (
        <div>
            <Header />
            <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-purple-50'>
                <div className='container mx-auto px-4 py-6 max-w-[1600px]'>
                    {/* 页面标题 */}
                    <div className='flex items-center gap-3 mb-6'>
                        <Icon className='h-7 w-7 text-primary-600' />
                        <div>
                            <h1 className='text-2xl font-bold text-gray-900'>页面标题</h1>
                            <p className='text-sm text-gray-600'>页面描述</p>
                        </div>
                    </div>

                    {/* 主要内容 - 左右分栏 */}
                    <div className='grid grid-cols-1 xl:grid-cols-4 gap-4'>
                        {/* 左侧：上传区 */}
                        <div className='xl:col-span-1'>
                            <Card className='sticky top-20'>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg'>上传文件</CardTitle>
                                    <CardDescription className='text-xs'>支持的格式</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FileUploader onUploadSuccess={handleUploadSuccess} />
                                </CardContent>
                            </Card>
                        </div>

                        {/* 右侧：处理选项 */}
                        <div className='xl:col-span-3'>
                            <Card>
                                <CardHeader className='pb-3'>
                                    <CardTitle className='text-lg'>处理选项</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className='grid w-full grid-cols-2 h-auto p-1 mb-4'>
                                            <TabsTrigger value='process'>处理文件</TabsTrigger>
                                            <TabsTrigger value='history'>历史记录</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value='process'>
                                            {/* 处理选项和结果 */}
                                        </TabsContent>
                                        <TabsContent value='history'>
                                            {/* 历史记录列表 */}
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function ProcessPage() {
    return (
        <ProtectedRoute>
            <ProcessContent />
        </ProtectedRoute>
    )
}
```

### 2. 页面布局最佳实践

**网格布局比例**:
- 图片/视频/音频处理: `1:3` (xl:col-span-1 + xl:col-span-3)
- 个人设置: `1:2` (xl:col-span-1 + xl:col-span-2)

**左侧栏固定**:
```tsx
<Card className='sticky top-20'>
    {/* 左侧内容会固定在视口顶部20px的位置 */}
</Card>
```

**处理结果展示**:
- 本轮处理结果：直接显示在处理按钮下方
- 历史记录：独立的标签页，设置最大高度并可滚动

---

## 🎓 编码示例

### 完整的功能模块示例

```tsx
// 1. 定义类型 (types/my-feature.types.ts)
export interface MyFeatureData {
    id: string
    name: string
}

// 2. 创建 API 服务 (services/api/my-feature.service.ts)
import { apiClient } from './client'

export const myFeatureService = {
    getAll: async () => {
        const response = await apiClient.get<MyFeatureData[]>('/my-feature')
        return response.data
    }
}

// 3. 创建 Store (可选)
import { create } from 'zustand'

export const useMyFeatureStore = create((set) => ({
    data: [],
    setData: (data) => set({ data })
}))

// 4. 创建组件
'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { myFeatureService } from '@/services/api'
import { useMyFeatureStore } from '@/stores'
import { Card } from '@/components/ui/card'

export default function MyFeature() {
    const t = useTranslations('myFeature')
    const { data, setData } = useMyFeatureStore()
    
    useEffect(() => {
        loadData()
    }, [])
    
    const loadData = async () => {
        const result = await myFeatureService.getAll()
        setData(result)
    }
    
    return (
        <Card>
            <h2>{t('title')}</h2>
            {/* 渲染数据 */}
        </Card>
    )
}

// 5. 添加翻译 (messages/zh.json)
{
  "myFeature": {
    "title": "我的功能"
  }
}
```

---

## 🚀 快速命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 代码检查
npm run lint
npm run lint:fix

# 类型检查
npm run type-check

# 格式化代码
npm run format

# 添加 shadcn/ui 组件
npx shadcn@latest add [component-name]
```

---

---

## 🎨 设计系统规范

### 颜色使用
- **主色**: `primary-600` - 按钮、链接、重要元素
- **成功**: `green-600` - 成功提示、完成状态
- **警告**: `yellow-600` - 警告信息
- **错误**: `red-600` - 错误提示、危险操作
- **灰色**: `gray-50/100/200/...` - 背景、边框、文本

### 图标规范
- **导航图标**: `h-5 w-5`
- **页面标题图标**: `h-7 w-7`
- **卡片内图标**: `h-4 w-4`
- **按钮内图标**: `h-4 w-4` 或 `h-3 w-3`

### 字体大小
- **页面主标题**: `text-2xl font-bold`
- **卡片标题**: `text-lg` (CardTitle)
- **卡片描述**: `text-xs` (CardDescription)
- **正文**: `text-sm`
- **辅助文字**: `text-xs`

### 间距系统
- **页面容器**: `py-6`
- **卡片间距**: `gap-4`
- **元素间距**: `space-y-4` 或 `gap-3`
- **Card padding**: `p-6` (默认), `pb-3` (header)

---

## 🔍 Header 导航规范

### 菜单结构
```tsx
// 已登录状态
[图片处理] [音频处理] [视频处理] [语言切换] [用户菜单▼]

// 未登录状态
[语言切换] [登录] [注册]
```

### 菜单间距
```tsx
// 容器
<div className='hidden md:flex items-center space-x-12'>

// 菜单项（增加点击区域）
<Link className='text-gray-700 hover:text-primary-600 px-2'>
```

### 用户菜单
使用 `DropdownMenu` 组件，点击展开，而非 hover:
```tsx
<DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button variant='ghost'>
            <User /><span>用户名</span><ChevronDown />
        </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
            <Link href='/profile'>个人设置</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>退出登录</DropdownMenuItem>
    </DropdownMenuContent>
</DropdownMenu>
```

---

## 📱 响应式设计规范

### 断点
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 布局响应
```tsx
// 移动端单列，大屏幕多列
<div className='grid grid-cols-1 xl:grid-cols-4 gap-4'>

// 移动端隐藏，桌面端显示
<div className='hidden md:flex'>

// 移动端显示，桌面端隐藏
<div className='md:hidden'>
```

---

**最后更新**: 2025-10-28  
**版本**: 2.0.0  
**维护**: 开发团队

