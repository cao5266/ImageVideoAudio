/**
 * 结束占用指定端口的进程
 * Windows 平台
 */

const { exec } = require('child_process')
const util = require('util')
const execPromise = util.promisify(exec)

const PORT = process.env.PORT || 5000

console.log(`正在查找占用端口 ${PORT} 的进程...\n`)

async function killPort() {
    try {
        // 查找占用端口的进程
        const { stdout } = await execPromise(`netstat -ano | findstr :${PORT}`)

        if (!stdout) {
            console.log(`✅ 端口 ${PORT} 未被占用\n`)
            return
        }

        console.log('找到以下进程:')
        console.log(stdout)

        // 提取 PID
        const lines = stdout.trim().split('\n')
        const pids = new Set()

        lines.forEach(line => {
            const parts = line.trim().split(/\s+/)
            const pid = parts[parts.length - 1]
            if (pid && pid !== '0') {
                pids.add(pid)
            }
        })

        if (pids.size === 0) {
            console.log('未找到有效的进程 ID\n')
            return
        }

        console.log(`\n找到 ${pids.size} 个进程: ${Array.from(pids).join(', ')}`)

        // 结束所有相关进程
        for (const pid of pids) {
            try {
                await execPromise(`taskkill /PID ${pid} /F`)
                console.log(`✅ 已结束进程 ${pid}`)
            } catch (err) {
                console.log(`⚠️  无法结束进程 ${pid}`)
            }
        }

        console.log(`\n✅ 端口 ${PORT} 已释放\n`)
    } catch (error) {
        if (error.stdout === '') {
            console.log(`✅ 端口 ${PORT} 未被占用\n`)
        } else {
            console.error('❌ 错误:', error.message)
        }
    }
}

killPort()
