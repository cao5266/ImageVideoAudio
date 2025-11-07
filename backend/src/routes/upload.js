const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const uploadController = require('../controllers/uploadController');
const { authenticateToken } = require('../middleware/auth');

// 单文件上传
router.post('/single', 
  authenticateToken,
  upload.single('file'),
  uploadController.uploadFile
);

// 多文件上传
router.post('/multiple',
  authenticateToken,
  upload.array('files', 10),
  uploadController.uploadMultipleFiles
);

module.exports = router;

