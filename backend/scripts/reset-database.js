/**
 * 数据库重置脚本
 * 警告：此脚本会删除所有数据！
 */

const readline = require('readline')
const { Sequelize } = require('sequelize')
require('dotenv').config()

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'video_process_db'
}

console.log('====================================')
console.log('  ⚠️  数据库重置脚本')
console.log('====================================\n')

console.log('⚠️  警告: 此操作将删除所有数据表和数据！')
console.log(`   数据库: ${dbConfig.database}\n`)

rl.question('确认要重置数据库吗？(输入 YES 确认): ', async answer => {
    if (answer !== 'YES') {
        console.log('❌ 操作已取消\n')
        rl.close()
        process.exit(0)
    }

    try {
        const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: 'mysql',
            logging: false
        })

        console.log('\n正在重置数据库...\n')

        // 导入模型
        const { User, ProcessingJob, RefreshToken } = require('../src/models')

        // 删除所有表并重新创建
        await sequelize.sync({ force: true })

        console.log('✅ 数据库已重置')
        console.log('✅ 表结构已重新创建\n')

        await sequelize.close()

        console.log('====================================')
        console.log('  ✅ 重置完成')
        console.log('====================================\n')

        rl.close()
        process.exit(0)
    } catch (error) {
        console.error('❌ 重置失败:', error.message)
        rl.close()
        process.exit(1)
    }
})
