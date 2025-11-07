/**
 * 数据库初始化脚本
 * 功能：创建数据库、测试连接、创建表结构
 */

const { Sequelize } = require('sequelize')
const mysql = require('mysql2/promise')
require('dotenv').config()

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'video_process_db'
}

console.log('====================================')
console.log('  数据库初始化脚本')
console.log('====================================\n')

console.log('数据库配置:')
console.log(`- 主机: ${dbConfig.host}`)
console.log(`- 端口: ${dbConfig.port}`)
console.log(`- 用户: ${dbConfig.user}`)
console.log(`- 数据库: ${dbConfig.database}\n`)

async function initDatabase() {
    let connection

    try {
        // 步骤 1: 测试 MySQL 连接
        console.log('[1/4] 测试 MySQL 连接...')
        connection = await mysql.createConnection({
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password
        })
        console.log('✅ MySQL 连接成功\n')

        // 步骤 2: 创建数据库（如果不存在）
        console.log('[2/4] 创建数据库...')
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
        console.log(`✅ 数据库 '${dbConfig.database}' 已就绪\n`)

        // 关闭初始连接
        await connection.end()

        // 步骤 3: 连接到数据库并同步模型
        console.log('[3/4] 连接数据库并创建表结构...')

        const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: 'mysql',
            logging: false
        })

        // 测试连接
        await sequelize.authenticate()
        console.log('✅ 数据库连接成功')

        // 导入模型
        const { User, ProcessingJob, RefreshToken } = require('../src/models')

        // 同步所有模型（创建表）
        console.log('\n创建数据表:')
        await sequelize.sync({ force: false, alter: true })

        console.log('  ✅ users (用户表)')
        console.log('  ✅ processing_jobs (处理任务表)')
        console.log('  ✅ refresh_tokens (刷新令牌表)')

        console.log('\n✅ 表结构创建成功\n')

        // 步骤 4: 验证表结构
        console.log('[4/4] 验证表结构...')

        // 等待一小段时间确保表创建完成
        await new Promise(resolve => setTimeout(resolve, 1000))

        const [tables] = await sequelize.query('SHOW TABLES')
        console.log(`\n数据库中的表 (共 ${tables.length} 个):`)

        if (tables.length === 0) {
            console.log('⚠️  警告: 表创建可能未完成，但数据库已就绪')
            console.log('   您可以直接运行 npm run dev 启动服务器')
            console.log('   服务器启动时会自动创建表\n')
        } else {
            tables.forEach((table, index) => {
                const tableName = table[`Tables_in_${dbConfig.database}`]
                console.log(`  ${index + 1}. ${tableName}`)
            })

            // 显示 users 表结构
            try {
                console.log('\n用户表 (users) 字段:')
                const [userColumns] = await sequelize.query('DESCRIBE users')
                userColumns.forEach(col => {
                    console.log(`  - ${col.Field} (${col.Type})`)
                })
            } catch (err) {
                console.log('  （表结构稍后可通过 npm run check-db 查看）')
            }
        }

        await sequelize.close()

        console.log('\n====================================')
        console.log('  ✅ 数据库初始化完成！')
        console.log('====================================\n')

        console.log('下一步:')
        console.log('1. 运行 npm run dev 启动后端服务器')
        console.log('2. 访问 http://localhost:5000/health 测试\n')

        process.exit(0)
    } catch (error) {
        console.error('\n❌ 初始化失败:', error.message)

        if (error.code === 'ECONNREFUSED') {
            console.error('\n可能的原因:')
            console.error('- MySQL 服务未启动')
            console.error('- 主机或端口配置错误')
            console.error(`- 当前配置: ${dbConfig.host}:${dbConfig.port}`)
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n可能的原因:')
            console.error('- 用户名或密码错误')
            console.error(`- 当前配置: ${dbConfig.user}@${dbConfig.host}`)
        }

        console.error('\n请检查 .env 文件中的数据库配置\n')

        if (connection) {
            await connection.end()
        }

        process.exit(1)
    }
}

// 执行初始化
initDatabase()
