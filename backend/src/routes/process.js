const express = require('express');
const router = express.Router();
const processController = require('../controllers/processController');
const { authenticateToken } = require('../middleware/auth');

// 视频处理路由
router.post('/video/convert', authenticateToken, processController.convertVideo);
router.post('/video/compress', authenticateToken, processController.compressVideo);
router.post('/video/cut', authenticateToken, processController.cutVideo);
router.post('/video/merge', authenticateToken, processController.mergeVideos);
router.post('/video/rotate', authenticateToken, processController.rotateVideo);
router.post('/video/extract-audio', authenticateToken, processController.extractAudio);
router.post('/video/to-gif', authenticateToken, processController.videoToGif);
router.post('/video/watermark', authenticateToken, processController.addWatermark);

// 图片处理路由
router.post('/image/convert', authenticateToken, processController.convertImage);
router.post('/image/resize', authenticateToken, processController.resizeImage);

// 任务查询和下载
router.get('/status/:jobId', authenticateToken, processController.getJobStatus);
router.get('/history', authenticateToken, processController.getHistory);
router.get('/download/:jobId', authenticateToken, processController.downloadFile);

module.exports = router;

