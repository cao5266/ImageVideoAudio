const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProcessingJob = sequelize.define('ProcessingJob', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  original_file: {
    type: DataTypes.STRING,
    allowNull: false
  },
  output_file: {
    type: DataTypes.STRING,
    allowNull: true
  },
  job_type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'video_convert, video_compress, image_resize, etc.'
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  parameters: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Processing parameters in JSON format'
  },
  error_message: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'processing_jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ProcessingJob;

