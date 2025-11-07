import React from 'react'
import Header from '@/components/layout/Header'
import StepIndicator from './StepIndicator'

interface ToolLayoutProps {
    title: string
    currentStep?: number
    children: React.ReactNode
    showSteps?: boolean
}

const STEPS = ['上传文件', '选择处理', '设置参数', '完成']

export default function ToolLayout({ title, currentStep = 0, children, showSteps = false }: ToolLayoutProps) {
    return (
        <div>
            <Header />
            <div className='min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-50 via-white to-purple-50'>
                <main className='container mx-auto px-4 py-6 max-w-[1600px]'>
                    {/* 标题 */}
                    <h1 className='text-2xl font-bold text-gray-900 mb-6'>{title}</h1>

                    {/* 步骤指示器（可选） */}
                    {showSteps && <StepIndicator currentStep={currentStep} steps={STEPS} />}

                    {/* 主要内容 */}
                    {children}
                </main>
            </div>
        </div>
    )
}

export { StepIndicator }
