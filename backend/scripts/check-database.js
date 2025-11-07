/**
 * 数据库检查脚本
 * 功能：检查数据库连接、表结构、数据统计
 */

const { Sequelize } = require('sequelize')
require('dotenv').config()

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'video_process_db'
}

console.log('====================================')
console.log('  数据库状态检查')
console.log('====================================\n')

async function checkDatabase() {
    try {
        const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
            host: dbConfig.host,
            port: dbConfig.port,
            dialect: 'mysql',
            logging: false
        })

        // 测试连接
        console.log('[1/3] 测试数据库连接...')
        await sequelize.authenticate()
        console.log('✅ 数据库连接正常\n')

        // 检查表
        console.log('[2/3] 检查数据表...')
        const [tables] = await sequelize.query('SHOW TABLES')

        if (tables.length === 0) {
            console.log('⚠️  数据库中没有表')
            console.log('   请运行: npm run init-db\n')
        } else {
            console.log(`✅ 找到 ${tables.length} 个表:\n`)

            for (const table of tables) {
                const tableName = table[`Tables_in_${dbConfig.database}`]

                // 获取表的行数
                const [rows] = await sequelize.query(`SELECT COUNT(*) as count FROM ${tableName}`)
                const count = rows[0].count

                // 获取表结构信息
                const [columns] = await sequelize.query(`DESCRIBE ${tableName}`)

                console.log(`📊 ${tableName}`)
                console.log(`   记录数: ${count}`)
                console.log(`   字段数: ${columns.length}`)

                // 显示前几个字段
                const fieldNames = columns
                    .slice(0, 5)
                    .map(col => col.Field)
                    .join(', ')
                console.log(`   字段: ${fieldNames}${columns.length > 5 ? '...' : ''}\n`)
            }
        }

        // 数据统计
        console.log('[3/3] 数据统计...')

        try {
            const [userCount] = await sequelize.query('SELECT COUNT(*) as count FROM users')
            const [jobCount] = await sequelize.query('SELECT COUNT(*) as count FROM processing_jobs')

            console.log('✅ 数据统计:')
            console.log(`   用户数: ${userCount[0].count}`)
            console.log(`   处理任务数: ${jobCount[0].count}\n`)

            // 如果有任务，显示任务状态分布
            if (jobCount[0].count > 0) {
                const [jobStats] = await sequelize.query('SELECT status, COUNT(*) as count FROM processing_jobs GROUP BY status')

                console.log('   任务状态分布:')
                jobStats.forEach(stat => {
                    console.log(`     ${stat.status}: ${stat.count}`)
                })
                console.log()
            }
        } catch (err) {
            console.log('⚠️  无法获取数据统计（表可能为空）\n')
        }

        await sequelize.close()

        console.log('====================================')
        console.log('  ✅ 检查完成')
        console.log('====================================\n')

        process.exit(0)
    } catch (error) {
        console.error('❌ 检查失败:', error.message)

        if (error.code === 'ECONNREFUSED') {
            console.error('\nMySQL 服务未运行或配置错误')
        } else if (error.code === 'ER_BAD_DB_ERROR') {
            console.error(`\n数据库 '${dbConfig.database}' 不存在`)
            console.error('请运行: npm run init-db\n')
        }

        process.exit(1)
    }
}

checkDatabase()
