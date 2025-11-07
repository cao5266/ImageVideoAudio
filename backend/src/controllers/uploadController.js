const path = require('path');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      fileId: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date()
    };

    res.json({
      message: 'File uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
};

exports.uploadMultipleFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const filesInfo = req.files.map(file => ({
      fileId: file.filename,
      originalName: file.originalname,
      filePath: file.path,
      size: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date()
    }));

    res.json({
      message: 'Files uploaded successfully',
      files: filesInfo
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Files upload failed' });
  }
};

