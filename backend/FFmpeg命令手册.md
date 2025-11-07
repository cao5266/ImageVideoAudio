# FFmpeg 命令分类手册

## 📋 目录
- [视频处理](#视频处理)
  - [格式转换](#1-格式转换)
  - [视频压缩](#2-视频压缩)
  - [视频裁剪](#3-视频裁剪)
  - [视频合并](#4-视频合并)
  - [旋转翻转](#5-旋转翻转)
  - [提取音频](#6-提取音频)
  - [视频转GIF](#7-视频转gif)
  - [添加水印](#8-添加水印)
  - [调整分辨率](#9-调整分辨率)
  - [调整帧率](#10-调整帧率)
  - [提取帧](#11-提取帧)
- [图片处理](#图片处理)
  - [格式转换](#1-格式转换-1)
  - [调整大小](#2-调整大小)
  - [图片压缩](#3-图片压缩)
  - [裁剪图片](#4-裁剪图片)
  - [添加水印](#5-添加水印)
  - [批量处理](#6-批量处理)
- [音频处理](#音频处理)
  - [格式转换](#1-音频格式转换)
  - [音频压缩](#2-音频压缩)
  - [音频裁剪](#3-音频裁剪)
  - [音频合并](#4-音频合并)

---

## 视频处理

### 1. 格式转换

#### 1.1 基本格式转换
```bash
# MP4 转 AVI
ffmpeg -i input.mp4 output.avi

# AVI 转 MP4
ffmpeg -i input.avi -c:v libx264 -c:a aac output.mp4

# MOV 转 MP4
ffmpeg -i input.mov -c:v libx264 -c:a aac output.mp4

# MKV 转 MP4
ffmpeg -i input.mkv -c:v copy -c:a copy output.mp4

# MP4 转 WebM
ffmpeg -i input.mp4 -c:v libvpx-vp9 -c:a libopus output.webm
```

**参数说明：**
- `-i`: 输入文件
- `-c:v`: 视频编码器（libx264, libx265, libvpx-vp9）
- `-c:a`: 音频编码器（aac, mp3, opus）
- `copy`: 直接复制流，不重新编码

**前端实现参数：**
```json
{
  "功能": "格式转换",
  "输入": "input.mp4",
  "输出格式": ["mp4", "avi", "mov", "mkv", "webm", "flv"],
  "视频编码": ["libx264", "libx265", "libvpx-vp9"],
  "音频编码": ["aac", "mp3", "opus", "libvorbis"]
}
```

---

### 2. 视频压缩

#### 2.1 使用 CRF 压缩（推荐）
```bash
# H.264 压缩（CRF 值：0-51，越小质量越好）
ffmpeg -i input.mp4 -c:v libx264 -crf 23 output.mp4

# 高质量压缩
ffmpeg -i input.mp4 -c:v libx264 -crf 18 output.mp4

# 中等质量压缩
ffmpeg -i input.mp4 -c:v libx264 -crf 28 output.mp4

# H.265 压缩（体积更小）
ffmpeg -i input.mp4 -c:v libx265 -crf 28 output.mp4

# 多线程压缩
ffmpeg -i input.mp4 -threads 4 -c:v libx264 -crf 26 output.mp4
```

**参数说明：**
- `-crf`: 恒定质量模式（18=高质量, 23=默认, 28=中等）
- `-threads`: 线程数（建议CPU核心数）

#### 2.2 使用码率压缩
```bash
# 指定视频码率
ffmpeg -i input.mp4 -b:v 1000k -c:a copy output.mp4

# 指定视频和音频码率
ffmpeg -i input.mp4 -b:v 1000k -b:a 128k output.mp4

# 两次编码（质量更好）
ffmpeg -i input.mp4 -b:v 1000k -pass 1 -f mp4 /dev/null && \
ffmpeg -i input.mp4 -b:v 1000k -pass 2 output.mp4
```

**参数说明：**
- `-b:v`: 视频码率（500k, 1000k, 2000k）
- `-b:a`: 音频码率（96k, 128k, 192k）
- `-pass`: 多次编码

**前端实现参数：**
```json
{
  "功能": "视频压缩",
  "压缩模式": ["CRF质量", "码率控制"],
  "CRF值": {
    "min": 0,
    "max": 51,
    "default": 23,
    "建议": {
      "高质量": 18,
      "标准": 23,
      "中等": 28
    }
  },
  "视频码率": ["500k", "1000k", "2000k", "自定义"],
  "音频码率": ["96k", "128k", "192k", "256k"],
  "线程数": [1, 2, 4, 8]
}
```

---

### 3. 视频裁剪

#### 3.1 按时间裁剪
```bash
# 从第10秒开始，截取30秒
ffmpeg -i input.mp4 -ss 00:00:10 -t 00:00:30 -c copy output.mp4

# 从第10秒开始到第40秒结束
ffmpeg -i input.mp4 -ss 00:00:10 -to 00:00:40 -c copy output.mp4

# 精确裁剪（重新编码）
ffmpeg -i input.mp4 -ss 00:00:10 -t 00:00:30 -c:v libx264 -c:a aac output.mp4
```

**参数说明：**
- `-ss`: 开始时间（HH:MM:SS 或秒数）
- `-t`: 持续时间
- `-to`: 结束时间
- `-c copy`: 快速裁剪（不重新编码）

#### 3.2 按画面裁剪
```bash
# 裁剪画面区域（宽x高:x偏移:y偏移）
ffmpeg -i input.mp4 -vf "crop=640:480:0:0" output.mp4

# 裁剪为 16:9
ffmpeg -i input.mp4 -vf "crop=iw:iw*9/16" output.mp4

# 裁剪为 1:1（正方形）
ffmpeg -i input.mp4 -vf "crop=min(iw\,ih):min(iw\,ih)" output.mp4
```

**参数说明：**
- `crop=w:h:x:y`: 宽:高:X偏移:Y偏移
- `iw/ih`: 输入宽度/高度

**前端实现参数：**
```json
{
  "功能": "视频裁剪",
  "裁剪类型": ["时间裁剪", "画面裁剪"],
  "时间裁剪": {
    "开始时间": "HH:MM:SS",
    "结束时间": "HH:MM:SS 或持续时间",
    "快速模式": true
  },
  "画面裁剪": {
    "预设": ["16:9", "4:3", "1:1", "9:16", "自定义"],
    "自定义": {
      "宽度": "number",
      "高度": "number",
      "X偏移": "number",
      "Y偏移": "number"
    }
  }
}
```

---

### 4. 视频合并

#### 4.1 简单合并（相同格式）
```bash
# 创建文件列表
echo "file 'video1.mp4'" > list.txt
echo "file 'video2.mp4'" >> list.txt
echo "file 'video3.mp4'" >> list.txt

# 合并
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4
```

#### 4.2 不同格式合并（重新编码）
```bash
# 先统一格式再合并
ffmpeg -i video1.avi -c:v libx264 -c:a aac temp1.mp4
ffmpeg -i video2.mov -c:v libx264 -c:a aac temp2.mp4
ffmpeg -f concat -safe 0 -i list.txt -c copy merged.mp4
```

**前端实现参数：**
```json
{
  "功能": "视频合并",
  "输入": ["文件1", "文件2", "文件3", "..."],
  "合并模式": ["快速合并（需相同格式）", "兼容合并（自动转换）"],
  "输出格式": "mp4"
}
```

---

### 5. 旋转/翻转

#### 5.1 旋转
```bash
# 顺时针旋转 90°
ffmpeg -i input.mp4 -vf "transpose=1" output.mp4

# 逆时针旋转 90°
ffmpeg -i input.mp4 -vf "transpose=2" output.mp4

# 旋转 180°
ffmpeg -i input.mp4 -vf "transpose=1,transpose=1" output.mp4
```

**参数说明：**
- `transpose=0`: 逆时针90° + 垂直翻转
- `transpose=1`: 顺时针90°
- `transpose=2`: 逆时针90°
- `transpose=3`: 顺时针90° + 垂直翻转

#### 5.2 翻转
```bash
# 水平翻转
ffmpeg -i input.mp4 -vf "hflip" output.mp4

# 垂直翻转
ffmpeg -i input.mp4 -vf "vflip" output.mp4
```

**前端实现参数：**
```json
{
  "功能": "旋转/翻转",
  "操作类型": ["旋转", "翻转"],
  "旋转角度": ["90°", "180°", "270°"],
  "旋转方向": ["顺时针", "逆时针"],
  "翻转方向": ["水平翻转", "垂直翻转"]
}
```

---

### 6. 提取音频

```bash
# 提取为 MP3
ffmpeg -i input.mp4 -vn -c:a libmp3lame -q:a 2 output.mp3

# 提取为 AAC
ffmpeg -i input.mp4 -vn -c:a aac -b:a 192k output.aac

# 提取为 WAV
ffmpeg -i input.mp4 -vn -c:a pcm_s16le output.wav

# 提取为 FLAC（无损）
ffmpeg -i input.mp4 -vn -c:a flac output.flac

# 直接复制音频流（最快）
ffmpeg -i input.mp4 -vn -c:a copy output.aac
```

**参数说明：**
- `-vn`: 不包含视频
- `-q:a`: 音频质量（0-9，越小越好）
- `-b:a`: 音频码率

**前端实现参数：**
```json
{
  "功能": "提取音频",
  "输出格式": ["mp3", "aac", "wav", "flac", "ogg"],
  "音频质量": {
    "mp3": {"min": 0, "max": 9, "default": 2},
    "aac": {"码率": ["96k", "128k", "192k", "256k"]}
  }
}
```

---

### 7. 视频转GIF

```bash
# 基本转换
ffmpeg -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos" output.gif

# 高质量 GIF（使用调色板）
ffmpeg -i input.mp4 -vf "fps=15,scale=480:-1:flags=lanczos,palettegen" palette.png
ffmpeg -i input.mp4 -i palette.png -filter_complex "fps=15,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse" output.gif

# 截取片段转 GIF
ffmpeg -ss 00:00:10 -t 00:00:05 -i input.mp4 -vf "fps=10,scale=320:-1" output.gif
```

**参数说明：**
- `fps`: 帧率（10-30）
- `scale`: 尺寸（-1 表示自动计算保持比例）
- `palettegen`: 生成调色板（提高质量）

**前端实现参数：**
```json
{
  "功能": "视频转GIF",
  "帧率": [10, 15, 20, 25, 30],
  "宽度": [320, 480, 640, "自定义"],
  "质量模式": ["标准", "高质量（调色板）"],
  "时间范围": {
    "开始时间": "HH:MM:SS",
    "持续时间": "秒数"
  }
}
```

---

### 8. 添加水印

#### 8.1 图片水印
```bash
# 右下角水印
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=W-w-10:H-h-10" output.mp4

# 左上角水印
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=10:10" output.mp4

# 居中水印
ffmpeg -i input.mp4 -i watermark.png -filter_complex "overlay=(W-w)/2:(H-h)/2" output.mp4

# 半透明水印
ffmpeg -i input.mp4 -i watermark.png -filter_complex "[1:v]format=rgba,colorchannelmixer=aa=0.5[logo];[0:v][logo]overlay=W-w-10:H-h-10" output.mp4
```

#### 8.2 文字水印
```bash
# 添加文字
ffmpeg -i input.mp4 -vf "drawtext=text='My Watermark':x=10:y=10:fontsize=24:fontcolor=white" output.mp4

# 带背景的文字
ffmpeg -i input.mp4 -vf "drawtext=text='Copyright':x=10:y=H-th-10:fontsize=20:fontcolor=white:box=1:boxcolor=black@0.5" output.mp4
```

**参数说明：**
- `overlay=x:y`: 水印位置
- `W/H`: 视频宽度/高度
- `w/h`: 水印宽度/高度

**前端实现参数：**
```json
{
  "功能": "添加水印",
  "水印类型": ["图片水印", "文字水印"],
  "图片水印": {
    "位置": ["左上", "右上", "左下", "右下", "居中", "自定义"],
    "透明度": {"min": 0, "max": 1, "default": 1},
    "边距": {"x": 10, "y": 10}
  },
  "文字水印": {
    "文本": "string",
    "位置": ["左上", "右上", "左下", "右下", "居中"],
    "字体大小": [12, 16, 20, 24, 32],
    "颜色": "white",
    "背景": true
  }
}
```

---

### 9. 调整分辨率

```bash
# 调整为 720p（保持比例）
ffmpeg -i input.mp4 -vf "scale=-1:720" output.mp4

# 调整为 1080p
ffmpeg -i input.mp4 -vf "scale=-1:1080" output.mp4

# 固定宽度 1280（高度自动）
ffmpeg -i input.mp4 -vf "scale=1280:-1" output.mp4

# 固定尺寸（可能变形）
ffmpeg -i input.mp4 -vf "scale=1920:1080" output.mp4

# 按比例缩放（50%）
ffmpeg -i input.mp4 -vf "scale=iw*0.5:ih*0.5" output.mp4
```

**前端实现参数：**
```json
{
  "功能": "调整分辨率",
  "模式": ["预设分辨率", "自定义尺寸", "按比例缩放"],
  "预设": [
    {"name": "4K", "width": 3840, "height": 2160},
    {"name": "1080p", "width": 1920, "height": 1080},
    {"name": "720p", "width": 1280, "height": 720},
    {"name": "480p", "width": 854, "height": 480}
  ],
  "自定义": {
    "宽度": "number",
    "高度": "number",
    "保持比例": true
  },
  "缩放比例": [25, 50, 75, 100, 150, 200]
}
```

---

### 10. 调整帧率

```bash
# 调整为 30fps
ffmpeg -i input.mp4 -r 30 output.mp4

# 调整为 60fps
ffmpeg -i input.mp4 -r 60 output.mp4

# 调整为 24fps（电影帧率）
ffmpeg -i input.mp4 -r 24 output.mp4

# 减少帧率（压缩）
ffmpeg -i input.mp4 -r 15 output.mp4
```

**前端实现参数：**
```json
{
  "功能": "调整帧率",
  "帧率选项": [15, 24, 25, 30, 50, 60, "自定义"],
  "说明": {
    "24": "电影标准",
    "25": "PAL标准",
    "30": "NTSC标准",
    "60": "高帧率"
  }
}
```

---

### 11. 提取帧

```bash
# 每秒提取1帧
ffmpeg -i input.mp4 -vf "fps=1" frame_%04d.png

# 提取指定时间的帧
ffmpeg -ss 00:00:10 -i input.mp4 -frames:v 1 screenshot.png

# 每10秒提取1帧
ffmpeg -i input.mp4 -vf "fps=1/10" frame_%04d.jpg

# 提取所有帧
ffmpeg -i input.mp4 frame_%04d.png
```

**前端实现参数：**
```json
{
  "功能": "提取帧",
  "模式": ["单帧", "按间隔", "全部帧"],
  "单帧": {
    "时间点": "HH:MM:SS"
  },
  "按间隔": {
    "间隔": [1, 5, 10, 30, 60],
    "单位": "秒"
  },
  "输出格式": ["png", "jpg"]
}
```

---

## 图片处理

### 1. 格式转换

```bash
# JPG 转 PNG
ffmpeg -i input.jpg output.png

# PNG 转 JPG
ffmpeg -i input.png -q:v 2 output.jpg

# 转 WebP（高压缩）
ffmpeg -i input.jpg -c:v libwebp -q:v 50 output.webp

# 转 WebP（无损）
ffmpeg -i input.png -c:v libwebp -lossless 1 output.webp

# 批量转换
for i in *.jpg; do ffmpeg -i "$i" "${i%.jpg}.png"; done
```

**参数说明：**
- `-q:v`: 质量（2=高质量, 5=中等, 10=低质量）
- `-lossless`: 无损压缩（WebP）

**前端实现参数：**
```json
{
  "功能": "格式转换",
  "输出格式": ["jpg", "png", "webp", "gif", "bmp", "tiff"],
  "质量设置": {
    "jpg": {"min": 1, "max": 31, "default": 2},
    "webp": {
      "模式": ["有损", "无损"],
      "质量": {"min": 0, "max": 100, "default": 80}
    }
  }
}
```

---

### 2. 调整大小

```bash
# 按宽度缩放（保持比例）
ffmpeg -i input.jpg -vf "scale=800:-1" output.jpg

# 按高度缩放
ffmpeg -i input.jpg -vf "scale=-1:600" output.jpg

# 固定尺寸
ffmpeg -i input.jpg -vf "scale=800:600" output.jpg

# 按比例缩放（50%）
ffmpeg -i input.jpg -vf "scale=iw*0.5:ih*0.5" output.jpg

# 最大边限制（保持比例）
ffmpeg -i input.jpg -vf "scale='min(1920,iw)':'min(1080,ih)':force_original_aspect_ratio=decrease" output.jpg
```

**前端实现参数：**
```json
{
  "功能": "调整大小",
  "模式": ["固定宽度", "固定高度", "固定尺寸", "按比例", "最大边限制"],
  "固定宽度": {"width": "number", "保持比例": true},
  "固定高度": {"height": "number", "保持比例": true},
  "固定尺寸": {"width": "number", "height": "number"},
  "按比例": [10, 25, 50, 75, 100, 150, 200],
  "最大边": {"max": 1920}
}
```

---

### 3. 图片压缩

```bash
# JPG 压缩（质量控制）
ffmpeg -i input.jpg -q:v 10 output.jpg

# PNG 压缩
ffmpeg -i input.png -compression_level 9 output.png

# WebP 压缩（推荐）
ffmpeg -i input.jpg -c:v libwebp -q:v 75 output.webp

# 同时缩小尺寸和压缩
ffmpeg -i input.jpg -vf "scale=iw*0.8:ih*0.8" -q:v 8 output.jpg
```

**前端实现参数：**
```json
{
  "功能": "图片压缩",
  "质量": {
    "min": 1,
    "max": 100,
    "default": 85,
    "建议": {
      "高质量": 90,
      "标准": 85,
      "中等": 75,
      "低质量": 60
    }
  },
  "同时缩放": {
    "enable": false,
    "scale": 80
  }
}
```

---

### 4. 裁剪图片

```bash
# 裁剪指定区域（宽x高:x偏移:y偏移）
ffmpeg -i input.jpg -vf "crop=800:600:100:50" output.jpg

# 裁剪为正方形（居中）
ffmpeg -i input.jpg -vf "crop=min(iw\,ih):min(iw\,ih)" output.jpg

# 裁剪为 16:9
ffmpeg -i input.jpg -vf "crop=ih*16/9:ih" output.jpg
```

**前端实现参数：**
```json
{
  "功能": "裁剪图片",
  "模式": ["预设比例", "自定义区域"],
  "预设比例": ["1:1", "16:9", "4:3", "3:2", "9:16"],
  "自定义": {
    "宽度": "number",
    "高度": "number",
    "X偏移": "number",
    "Y偏移": "number"
  }
}
```

---

### 5. 添加水印

```bash
# 图片水印（右下角）
ffmpeg -i input.jpg -i watermark.png -filter_complex "overlay=W-w-10:H-h-10" output.jpg

# 文字水印
ffmpeg -i input.jpg -vf "drawtext=text='Copyright':x=10:y=H-th-10:fontsize=24:fontcolor=white:box=1:boxcolor=black@0.5" output.jpg
```

**前端实现参数：**
```json
{
  "功能": "添加水印",
  "类型": ["图片", "文字"],
  "位置": ["左上", "右上", "左下", "右下", "居中"],
  "透明度": 0.8
}
```

---

### 6. 批量处理

```bash
# 批量转换格式
for i in *.jpg; do
  ffmpeg -i "$i" -c:v libwebp -q:v 80 "${i%.jpg}.webp"
done

# 批量调整大小
for i in *.jpg; do
  ffmpeg -i "$i" -vf "scale=800:-1" "resized_$i"
done

# 批量压缩
for i in *.png; do
  ffmpeg -i "$i" -compression_level 9 "compressed_$i"
done
```

**前端实现参数：**
```json
{
  "功能": "批量处理",
  "操作": ["格式转换", "调整大小", "压缩", "添加水印"],
  "输入": "多个文件",
  "应用相同设置": true
}
```

---

## 音频处理

### 1. 音频格式转换

```bash
# MP3 转 AAC
ffmpeg -i input.mp3 -c:a aac -b:a 192k output.aac

# WAV 转 MP3
ffmpeg -i input.wav -c:a libmp3lame -q:a 2 output.mp3

# 转 FLAC（无损）
ffmpeg -i input.wav -c:a flac output.flac

# 转 OGG
ffmpeg -i input.mp3 -c:a libvorbis -q:a 5 output.ogg
```

---

### 2. 音频压缩

```bash
# 降低码率
ffmpeg -i input.mp3 -b:a 128k output.mp3

# 降低采样率
ffmpeg -i input.wav -ar 22050 output.wav

# 单声道
ffmpeg -i input.mp3 -ac 1 output.mp3
```

---

### 3. 音频裁剪

```bash
# 裁剪音频片段
ffmpeg -i input.mp3 -ss 00:00:10 -t 00:00:30 -c copy output.mp3
```

---

### 4. 音频合并

```bash
# 合并音频文件
echo "file 'audio1.mp3'" > list.txt
echo "file 'audio2.mp3'" >> list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy merged.mp3
```

---

## 📊 推荐实现优先级

### 高优先级（核心功能）
1. ✅ **视频格式转换**
2. ✅ **视频压缩**
3. ✅ **视频裁剪（时间）**
4. ✅ **提取音频**
5. ✅ **图片格式转换**
6. ✅ **图片调整大小**

### 中优先级
7. ⭐ **视频转GIF**
8. ⭐ **调整分辨率**
9. ⭐ **旋转/翻转**
10. ⭐ **图片压缩**

### 低优先级（进阶功能）
11. 💎 **视频合并**
12. 💎 **添加水印**
13. 💎 **提取帧**
14. 💎 **音频处理**

---

## 🎯 前端页面建议实现方式

### 1. 基础模式（当前）
```
[上传文件] → [选择处理类型] → [设置基础参数] → [处理]
```

### 2. 进阶模式（可选）
```
[上传文件] → [选择处理类型] → [高级参数面板] → [预览命令] → [处理]
```

### 3. 预设模板（推荐）
```
常用场景：
- 🎬 "压缩视频以便分享" → 自动CRF 28 + 720p
- 📱 "转换为手机格式" → MP4 + H.264 + AAC
- 🌐 "网页优化" → WebM + VP9
- 🎨 "制作表情包" → GIF + 480p + 15fps
```

---

## 💡 后端实现建议

### 1. 命令构建器
```javascript
class FFmpegCommandBuilder {
  constructor(inputFile, operation) {
    this.input = inputFile
    this.operation = operation
    this.params = []
  }
  
  // 视频压缩
  compress(crf = 23, threads = 4) {
    return `ffmpeg -i ${this.input} -threads ${threads} -c:v libx264 -crf ${crf} output.mp4`
  }
  
  // 格式转换
  convert(outputFormat, videoCodec, audioCodec) {
    return `ffmpeg -i ${this.input} -c:v ${videoCodec} -c:a ${audioCodec} output.${outputFormat}`
  }
  
  // ... 更多方法
}
```

### 2. 参数验证
```javascript
const validators = {
  crf: (val) => val >= 0 && val <= 51,
  fps: (val) => val > 0 && val <= 120,
  bitrate: (val) => /^\d+[km]$/i.test(val)
}
```

---

## 📚 参考资源

- FFmpeg 官方文档: https://ffmpeg.org/documentation.html
- FFmpeg Wiki: https://trac.ffmpeg.org/wiki
- 视频编码指南: https://trac.ffmpeg.org/wiki/Encode/H.264

---

**最后更新**: 2024-10-28

