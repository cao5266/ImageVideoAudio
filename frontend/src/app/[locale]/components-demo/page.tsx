'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { AlertCircle, CheckCircle2, Info, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function ComponentsDemo() {
    const { toast } = useToast()

    return (
        <div className='min-h-screen bg-background'>
            {/* Header */}
            <div className='border-b'>
                <div className='container mx-auto px-4 py-6'>
                    <div className='flex items-center justify-between'>
                        <div>
                            <h1 className='text-3xl font-bold'>shadcn/ui 组件展示</h1>
                            <p className='text-muted-foreground mt-2'>预览所有已安装的组件</p>
                        </div>
                        <Link href='/dashboard'>
                            <Button variant='outline'>返回首页</Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 py-8 space-y-8'>
                {/* Buttons Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>按钮 (Buttons)</CardTitle>
                        <CardDescription>不同样式和尺寸的按钮组件</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='flex flex-wrap gap-3'>
                            <Button variant='default'>默认按钮</Button>
                            <Button variant='secondary'>次要按钮</Button>
                            <Button variant='destructive'>危险按钮</Button>
                            <Button variant='outline'>轮廓按钮</Button>
                            <Button variant='ghost'>幽灵按钮</Button>
                            <Button variant='link'>链接按钮</Button>
                        </div>
                        <Separator />
                        <div className='flex flex-wrap gap-3 items-center'>
                            <Button size='lg'>大按钮</Button>
                            <Button size='default'>默认</Button>
                            <Button size='sm'>小按钮</Button>
                            <Button size='icon'>
                                <Sparkles className='h-4 w-4' />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Alerts Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>警告提示 (Alerts)</CardTitle>
                        <CardDescription>用于显示重要信息的警告组件</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <Alert>
                            <Info className='h-4 w-4' />
                            <AlertTitle>提示</AlertTitle>
                            <AlertDescription>这是一条普通的提示信息。</AlertDescription>
                        </Alert>

                        <Alert variant='destructive'>
                            <AlertCircle className='h-4 w-4' />
                            <AlertTitle>错误</AlertTitle>
                            <AlertDescription>发生了一个错误，请重试。</AlertDescription>
                        </Alert>

                        <Alert className='border-green-500 text-green-700 dark:text-green-400'>
                            <CheckCircle2 className='h-4 w-4' />
                            <AlertTitle>成功</AlertTitle>
                            <AlertDescription>操作已成功完成！</AlertDescription>
                        </Alert>
                    </CardContent>
                </Card>

                {/* Form Elements Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>表单元素 (Form Elements)</CardTitle>
                        <CardDescription>输入框、标签和选择器</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                        <div className='space-y-2'>
                            <Label htmlFor='email'>邮箱地址</Label>
                            <Input id='email' type='email' placeholder='your@email.com' />
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor='select'>选择选项</Label>
                            <Select>
                                <SelectTrigger id='select' className='w-full'>
                                    <SelectValue placeholder='请选择一个选项' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='option1'>选项 1</SelectItem>
                                    <SelectItem value='option2'>选项 2</SelectItem>
                                    <SelectItem value='option3'>选项 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Badges Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>徽章 (Badges)</CardTitle>
                        <CardDescription>用于标记和分类的小标签</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-wrap gap-3'>
                            <Badge variant='default'>默认</Badge>
                            <Badge variant='secondary'>次要</Badge>
                            <Badge variant='destructive'>危险</Badge>
                            <Badge variant='outline'>轮廓</Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Progress Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>进度条 (Progress)</CardTitle>
                        <CardDescription>显示任务完成进度</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='space-y-2'>
                            <div className='flex justify-between text-sm'>
                                <span>25%</span>
                            </div>
                            <Progress value={25} />
                        </div>
                        <div className='space-y-2'>
                            <div className='flex justify-between text-sm'>
                                <span>60%</span>
                            </div>
                            <Progress value={60} />
                        </div>
                        <div className='space-y-2'>
                            <div className='flex justify-between text-sm'>
                                <span>90%</span>
                            </div>
                            <Progress value={90} />
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>标签页 (Tabs)</CardTitle>
                        <CardDescription>组织相关内容的标签页组件</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue='tab1' className='w-full'>
                            <TabsList className='grid w-full grid-cols-3'>
                                <TabsTrigger value='tab1'>标签 1</TabsTrigger>
                                <TabsTrigger value='tab2'>标签 2</TabsTrigger>
                                <TabsTrigger value='tab3'>标签 3</TabsTrigger>
                            </TabsList>
                            <TabsContent value='tab1' className='mt-4'>
                                <p className='text-sm text-muted-foreground'>这是标签 1 的内容区域。</p>
                            </TabsContent>
                            <TabsContent value='tab2' className='mt-4'>
                                <p className='text-sm text-muted-foreground'>这是标签 2 的内容区域。</p>
                            </TabsContent>
                            <TabsContent value='tab3' className='mt-4'>
                                <p className='text-sm text-muted-foreground'>这是标签 3 的内容区域。</p>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Interactive Components Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>交互组件 (Interactive)</CardTitle>
                        <CardDescription>对话框和消息通知</CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-4'>
                        <div className='flex flex-wrap gap-3'>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant='outline'>打开对话框</Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>对话框标题</DialogTitle>
                                        <DialogDescription>这是一个示例对话框。您可以在这里放置任何内容。</DialogDescription>
                                    </DialogHeader>
                                    <div className='py-4'>
                                        <p className='text-sm'>对话框主要内容区域...</p>
                                    </div>
                                    <div className='flex justify-end gap-2'>
                                        <Button variant='outline'>取消</Button>
                                        <Button>确认</Button>
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button
                                variant='outline'
                                onClick={() => {
                                    toast({
                                        title: '成功',
                                        description: '这是一条成功的消息通知！'
                                    })
                                }}
                            >
                                显示成功通知
                            </Button>

                            <Button
                                variant='outline'
                                onClick={() => {
                                    toast({
                                        title: '错误',
                                        description: '这是一条错误消息。',
                                        variant: 'destructive'
                                    })
                                }}
                            >
                                显示错误通知
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Card Examples Section */}
                <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                    <Card>
                        <CardHeader>
                            <CardTitle>卡片 1</CardTitle>
                            <CardDescription>这是一个基础卡片</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className='text-sm text-muted-foreground'>卡片内容区域可以放置任何元素。</p>
                        </CardContent>
                        <CardFooter>
                            <Button className='w-full'>操作</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>卡片 2</CardTitle>
                            <CardDescription>带有徽章的卡片</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='flex gap-2'>
                                <Badge>标签1</Badge>
                                <Badge variant='secondary'>标签2</Badge>
                            </div>
                        </CardContent>
                        <CardFooter className='flex gap-2'>
                            <Button variant='outline' className='flex-1'>
                                取消
                            </Button>
                            <Button className='flex-1'>确认</Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>卡片 3</CardTitle>
                            <CardDescription>带有进度的卡片</CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-2'>
                            <p className='text-sm text-muted-foreground'>任务进度: 75%</p>
                            <Progress value={75} />
                        </CardContent>
                        <CardFooter>
                            <Button variant='secondary' className='w-full'>
                                查看详情
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Info Section */}
                <Card className='bg-primary/5 border-primary/20'>
                    <CardHeader>
                        <CardTitle className='flex items-center gap-2'>
                            <Sparkles className='h-5 w-5 text-primary' />
                            安装完成！
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2'>
                        <p className='text-sm'>所有 shadcn/ui 组件已成功安装并可以使用。</p>
                        <p className='text-sm text-muted-foreground'>
                            查看 <code className='bg-muted px-1.5 py-0.5 rounded'>frontend/SHADCN_USAGE.md</code> 了解详细使用说明。
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
