# 图片处理页面布局优化方案

## 当前问题分析

通过对现有图片处理页面的分析，发现以下布局问题：

1. **设计风格不统一**：与视频处理页面的设计风格存在差异
2. **步骤引导不清晰**：缺少明确的操作步骤指示
3. **处理类型选择不够直观**：使用标签页切换处理类型，视觉反馈不够明显
4. **参数设置区域复杂**：多个处理类型的参数设置混杂在一起
5. **结果展示不够突出**：处理结果的展示方式不够清晰

## 优化目标

1. **统一设计语言**：与视频处理页面保持一致的设计风格
2. **清晰的步骤引导**：使用步骤指示器帮助用户理解操作流程
3. **直观的操作体验**：处理类型选择更加直观，参数设置更加清晰
4. **响应式布局**：在不同设备上都能良好显示
5. **增强的用户反馈**：处理过程中的进度和结果展示更加明确

## 设计方案

### 1. 整体布局结构

采用步骤式布局，包含以下四个步骤：
- 步骤1：上传文件
- 步骤2：选择处理类型
- 步骤3：设置参数
- 步骤4：处理完成

### 2. 步骤指示器

使用ToolLayout组件提供的步骤指示器，显示当前所处的操作步骤，让用户清楚地了解操作流程。

### 3. 文件上传区域

- 使用白色背景的卡片式设计
- 提供清晰的文件类型和大小说明
- 支持批量上传多个文件
- 显示已选择文件的数量

### 4. 处理类型选择

- 使用卡片式按钮替代标签页
- 每个处理类型按钮包含图标和文字说明
- 选中状态有明显的视觉反馈（边框颜色和背景色变化）
- 响应式网格布局，在不同屏幕尺寸下自动调整列数

### 5. 参数设置区域

- 每种处理类型有独立的参数设置面板
- 使用清晰的标签和说明文字
- 对于复杂参数提供预设选项
- 布局整洁，避免参数混杂

### 6. 处理按钮和结果展示

- 处理按钮始终显示在页面底部，方便操作
- 处理过程中显示进度条和具体进度信息
- 错误信息以醒目的方式展示
- 处理结果以卡片形式展示，支持批量下载
- 单个文件结果支持单独下载

## 具体实现代码结构

```tsx
<ToolLayout title='图片处理' currentStep={currentStep} showSteps={true}>
  {/* 步骤 1: 文件上传 */}
  <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
    <h2 className='text-xl font-semibold text-gray-900 mb-4'>上传图片文件</h2>
    <FileUploader
      onUploadSuccess={handleUploadSuccess}
      accept={{
        'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp']
      }}
      multiple={true}
    />
    <p className='mt-2 text-sm text-gray-500'>💡 支持批量上传多个文件</p>
  </div>

  {/* 步骤 2: 选择处理类型 */}
  {uploadedFiles.length > 0 && (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>选择处理类型</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {processTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => {
              setProcessType(type.value)
              setCurrentStep(2)
            }}
            className={`p-4 rounded-lg border-2 transition-colors flex flex-col items-center ${
              processType === type.value
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-300 hover:border-primary-300'
            }`}
          >
            <type.icon className='h-6 w-6 mb-2' />
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  )}

  {/* 步骤 3: 参数设置 */}
  {currentStep >= 2 && (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>设置参数</h2>
      {/* 各种处理类型的参数设置 */}
      {renderProcessOptions()}
    </div>
  )}

  {/* 处理按钮和结果展示 */}
  <div className='bg-white rounded-lg shadow-md p-6'>
    {/* 处理进度 */}
    {processing && (
      <div className='mb-4'>
        <div className='flex justify-between text-sm text-gray-600 mb-1'>
          <span>处理进度</span>
          <span className='font-medium'>{progress}%</span>
        </div>
        <Progress value={progress} />
      </div>
    )}

    {/* 错误信息 */}
    {error && (
      <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-red-700'>
        {error}
      </div>
    )}

    {/* 结果展示 */}
    {results.length > 0 && (
      <div className='bg-green-50 border border-green-200 rounded-lg p-4 mb-4'>
        <div className='flex items-center mb-3'>
          <CheckCircle className='h-5 w-5 text-green-600 mr-2' />
          <h3 className='text-lg font-semibold text-green-900'>处理完成！({results.length} 个文件)</h3>
        </div>
        <div className='space-y-2'>
          {results.map((result, index) => (
            <div key={index} className='flex items-center justify-between bg-white p-3 rounded-lg'>
              <span className='text-sm text-gray-700 truncate'>{result.originalFile}</span>
              <button
                onClick={() => handleDownload(result.jobId)}
                className='flex items-center space-x-1 bg-green-600 text-white px-3 py-1.5 rounded text-sm hover:bg-green-700'
              >
                <Download className='h-4 w-4' />
                <span>下载</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    )}

    {/* 处理按钮 */}
    <button
      onClick={handleProcess}
      disabled={uploadedFiles.length === 0 || processing}
      className='w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-semibold'
    >
      {processing
        ? `处理中... (${Math.round((progress / 100) * uploadedFiles.length)}/${uploadedFiles.length})`
        : `开始处理 (${uploadedFiles.length} 个文件)`}
    </button>
  </div>
</ToolLayout>
```

## 主要改进点总结

1. **统一的步骤指示器**：使用ToolLayout组件提供的步骤指示器，让用户清楚当前所处的操作步骤
2. **卡片式处理类型选择**：替代原有的标签页设计，提供更直观的视觉反馈
3. **清晰的参数设置区域**：每种处理类型有独立的参数设置面板，避免混淆
4. **增强的结果展示**：处理结果以卡片形式展示，支持批量下载
5. **实时进度反馈**：在处理过程中显示进度条和具体进度信息
6. **响应式设计**：在不同屏幕尺寸下都能良好显示
7. **一致的设计语言**：与视频处理页面保持一致的视觉风格和交互模式

这种新的布局设计将提供更一致的用户体验，同时保持功能的完整性，让用户能够更轻松地完成图片处理任务。