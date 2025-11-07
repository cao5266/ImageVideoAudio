const User = require('./User');
const ProcessingJob = require('./ProcessingJob');
const RefreshToken = require('./RefreshToken');

// 定义关联关系
User.hasMany(ProcessingJob, { foreignKey: 'user_id', as: 'jobs' });
ProcessingJob.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refresh_tokens' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  User,
  ProcessingJob,
  RefreshToken
};

