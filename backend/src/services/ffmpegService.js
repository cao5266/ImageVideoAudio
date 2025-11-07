const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const outputDir = process.env.OUTPUT_DIR || 'outputs';

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

class FFmpegService {
  // 视频格式转换
  static async convertVideo(inputPath, outputFormat, options = {}) {
    return new Promise((resolve, reject) => {
      const outputFilename = `${uuidv4()}.${outputFormat}`;
      const outputPath = path.join(outputDir, outputFilename);

      let command = ffmpeg(inputPath);

      // 设置视频编解码器
      if (options.videoCodec) {
        command = command.videoCodec(options.videoCodec);
      }

      // 设置音频编解码器
      if (options.audioCodec) {
        command = command.audioCodec(options.audioCodec);
      }

      command
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 视频压缩
  static async compressVideo(inputPath, options = {}) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      let command = ffmpeg(inputPath);

      // 设置码率
      if (options.videoBitrate) {
        command = command.videoBitrate(options.videoBitrate);
      }

      if (options.audioBitrate) {
        command = command.audioBitrate(options.audioBitrate);
      }

      // 设置分辨率
      if (options.width && options.height) {
        command = command.size(`${options.width}x${options.height}`);
      } else if (options.scale) {
        command = command.size(`${options.scale}%`);
      }

      // 设置帧率
      if (options.fps) {
        command = command.fps(options.fps);
      }

      command
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 视频裁剪
  static async cutVideo(inputPath, startTime, duration) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(duration)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 视频合并
  static async mergeVideos(inputPaths, outputFormat = 'mp4') {
    return new Promise((resolve, reject) => {
      const outputFilename = `${uuidv4()}.${outputFormat}`;
      const outputPath = path.join(outputDir, outputFilename);

      let command = ffmpeg();

      // 添加所有输入文件
      inputPaths.forEach(inputPath => {
        command = command.input(inputPath);
      });

      command
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .mergeToFile(outputPath);
    });
  }

  // 旋转视频
  static async rotateVideo(inputPath, angle) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      // FFmpeg 旋转参数: 0=90°逆时针, 1=90°顺时针, 2=180°, 3=90°逆时针+垂直翻转
      const transposeMap = {
        90: '1',
        180: '2,transpose=2',
        270: '2'
      };

      ffmpeg(inputPath)
        .videoFilters(`transpose=${transposeMap[angle] || '1'}`)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 翻转视频
  static async flipVideo(inputPath, direction) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      const filter = direction === 'horizontal' ? 'hflip' : 'vflip';

      ffmpeg(inputPath)
        .videoFilters(filter)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 调整视频速度
  static async changeSpeed(inputPath, speed) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      // speed 范围: 0.5 (慢速) - 2.0 (快速)
      const videoSpeed = 1 / speed;
      const audioSpeed = speed;

      ffmpeg(inputPath)
        .videoFilters(`setpts=${videoSpeed}*PTS`)
        .audioFilters(`atempo=${audioSpeed}`)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 提取音频
  static async extractAudio(inputPath, outputFormat = 'mp3') {
    return new Promise((resolve, reject) => {
      const outputFilename = `${uuidv4()}.${outputFormat}`;
      const outputPath = path.join(outputDir, outputFilename);

      ffmpeg(inputPath)
        .noVideo()
        .audioCodec('libmp3lame')
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 视频转 GIF
  static async videoToGif(inputPath, options = {}) {
    return new Promise((resolve, reject) => {
      const outputFilename = `${uuidv4()}.gif`;
      const outputPath = path.join(outputDir, outputFilename);

      let command = ffmpeg(inputPath);

      // 设置时间范围
      if (options.startTime) {
        command = command.setStartTime(options.startTime);
      }
      if (options.duration) {
        command = command.setDuration(options.duration);
      }

      // 设置大小和帧率
      if (options.width) {
        command = command.size(`${options.width}x?`);
      }

      command
        .fps(options.fps || 10)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 添加水印（图片）
  static async addWatermark(inputPath, watermarkPath, options = {}) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      const position = options.position || 'topright';
      const positions = {
        topleft: '10:10',
        topright: 'main_w-overlay_w-10:10',
        bottomleft: '10:main_h-overlay_h-10',
        bottomright: 'main_w-overlay_w-10:main_h-overlay_h-10',
        center: '(main_w-overlay_w)/2:(main_h-overlay_h)/2'
      };

      ffmpeg(inputPath)
        .input(watermarkPath)
        .complexFilter([
          `[1:v]scale=${options.width || 100}:-1[watermark]`,
          `[0:v][watermark]overlay=${positions[position]}`
        ])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 添加文字水印
  static async addTextWatermark(inputPath, text, options = {}) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      const fontSize = options.fontSize || 24;
      const fontColor = options.fontColor || 'white';
      const position = options.position || 'bottomright';

      const positions = {
        topleft: 'x=10:y=10',
        topright: 'x=w-text_w-10:y=10',
        bottomleft: 'x=10:y=h-text_h-10',
        bottomright: 'x=w-text_w-10:y=h-text_h-10',
        center: 'x=(w-text_w)/2:y=(h-text_h)/2'
      };

      ffmpeg(inputPath)
        .videoFilters(`drawtext=text='${text}':fontsize=${fontSize}:fontcolor=${fontColor}:${positions[position]}`)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 视频截图
  static async takeScreenshot(inputPath, time, options = {}) {
    return new Promise((resolve, reject) => {
      const outputFilename = `${uuidv4()}.jpg`;
      const outputPath = path.join(outputDir, outputFilename);

      let command = ffmpeg(inputPath)
        .screenshots({
          timestamps: [time],
          filename: outputFilename,
          folder: outputDir
        });

      if (options.width && options.height) {
        command = command.size(`${options.width}x${options.height}`);
      }

      command
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err));
    });
  }

  // 去除音频
  static async removeAudio(inputPath) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      ffmpeg(inputPath)
        .noAudio()
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 替换音频
  static async replaceAudio(videoPath, audioPath) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(videoPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      ffmpeg()
        .input(videoPath)
        .input(audioPath)
        .outputOptions(['-c:v copy', '-map 0:v:0', '-map 1:a:0'])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 图片格式转换
  static async convertImage(inputPath, outputFormat) {
    return new Promise((resolve, reject) => {
      const outputFilename = `${uuidv4()}.${outputFormat}`;
      const outputPath = path.join(outputDir, outputFilename);

      ffmpeg(inputPath)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 图片压缩/调整大小
  static async resizeImage(inputPath, options = {}) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      let command = ffmpeg(inputPath);

      if (options.width && options.height) {
        command = command.size(`${options.width}x${options.height}`);
      } else if (options.scale) {
        command = command.size(`${options.scale}%`);
      }

      if (options.quality) {
        command = command.outputOptions([`-q:v ${options.quality}`]);
      }

      command
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 图片转视频
  static async imagesToVideo(imagePaths, options = {}) {
    return new Promise((resolve, reject) => {
      const outputFilename = `${uuidv4()}.mp4`;
      const outputPath = path.join(outputDir, outputFilename);

      const duration = options.duration || 3; // 每张图片显示时长
      const fps = options.fps || 25;

      let command = ffmpeg();

      imagePaths.forEach(imagePath => {
        command = command.input(imagePath).loop(duration);
      });

      command
        .fps(fps)
        .videoCodec('libx264')
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 旋转图片
  static async rotateImage(inputPath, angle) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      const transposeMap = {
        90: '1',
        180: '2,transpose=2',
        270: '2'
      };

      ffmpeg(inputPath)
        .videoFilters(`transpose=${transposeMap[angle] || '1'}`)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }

  // 翻转图片
  static async flipImage(inputPath, direction) {
    return new Promise((resolve, reject) => {
      const ext = path.extname(inputPath);
      const outputFilename = `${uuidv4()}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);

      const filter = direction === 'horizontal' ? 'hflip' : 'vflip';

      ffmpeg(inputPath)
        .videoFilters(filter)
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(err))
        .run();
    });
  }
}

module.exports = FFmpegService;

