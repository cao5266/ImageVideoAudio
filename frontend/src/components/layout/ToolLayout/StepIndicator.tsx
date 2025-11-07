interface StepIndicatorProps {
    currentStep: number
    steps: string[]
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
    return (
        <div className='mb-8'>
            <div className='flex items-center justify-center'>
                {steps.map((step, index) => (
                    <div key={index} className='flex items-center'>
                        {/* 步骤圆圈 */}
                        <div className='flex flex-col items-center'>
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-colors ${
                                    index < currentStep
                                        ? 'bg-green-500 text-white'
                                        : index === currentStep
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-200 text-gray-500'
                                }`}
                            >
                                {index < currentStep ? '✓' : index + 1}
                            </div>
                            <span
                                className={`mt-2 text-sm font-medium ${
                                    index <= currentStep ? 'text-gray-900' : 'text-gray-500'
                                }`}
                            >
                                {step}
                            </span>
                        </div>

                        {/* 连接线 */}
                        {index < steps.length - 1 && (
                            <div
                                className={`w-16 md:w-24 h-1 mx-2 transition-colors ${
                                    index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
