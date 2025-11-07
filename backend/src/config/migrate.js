const { sequelize } = require('./database');
const { User, ProcessingJob, RefreshToken } = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // 同步所有模型
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrate();

