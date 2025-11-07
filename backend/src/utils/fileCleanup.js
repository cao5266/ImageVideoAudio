const fs = require('fs');
const path = require('path');

// 清理旧文件
const cleanupOldFiles = (directory, hours = 24) => {
  const now = Date.now();
  const maxAge = hours * 60 * 60 * 1000;

  if (!fs.existsSync(directory)) {
    return;
  }

  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directory}:`, err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(directory, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for ${filePath}:`, err);
          return;
        }

        if (stats.isFile() && (now - stats.mtimeMs) > maxAge) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Error deleting file ${filePath}:`, err);
            } else {
              console.log(`Deleted old file: ${filePath}`);
            }
          });
        }
      });
    });
  });
};

// 启动定时清理任务
const startCleanupSchedule = () => {
  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  const outputDir = process.env.OUTPUT_DIR || 'outputs';
  const hours = parseInt(process.env.FILE_RETENTION_HOURS) || 24;

  // 每小时执行一次清理
  setInterval(() => {
    console.log('Running file cleanup...');
    cleanupOldFiles(uploadDir, hours);
    cleanupOldFiles(outputDir, hours);
  }, 60 * 60 * 1000);

  // 启动时立即执行一次
  cleanupOldFiles(uploadDir, hours);
  cleanupOldFiles(outputDir, hours);
};

module.exports = { cleanupOldFiles, startCleanupSchedule };

