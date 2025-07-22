#!/usr/bin/env node

/**
 * Vnite Plugin SDK CLI
 * 主命令行工具，支持多个子命令
 */

const { spawn } = require('child_process')
const path = require('path')

function showHelp() {
  console.log(`
🚀 Vnite Plugin SDK CLI

用法:
  npx vnite-plugin-sdk <command> [options]

命令:
  pack [path]      打包插件为 .vnpkg 文件
  help            显示帮助信息

示例:
  npx vnite-plugin-sdk pack ./my-plugin
  npx vnite-plugin-sdk help

创建新插件:
  npm create vnite-plugin [my-plugin]

更多信息:
  GitHub: https://github.com/ximu3/vnite-plugin-sdk
  `)
}

function runScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [scriptPath, ...args], {
      stdio: 'inherit',
      cwd: process.cwd()
    })

    child.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`命令执行失败，退出码: ${code}`))
      }
    })

    child.on('error', reject)
  })
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp()
    return
  }

  const command = args[0]
  const commandArgs = args.slice(1)

  try {
    switch (command) {
      case 'pack':
        // 调用打包脚本
        const packScript = path.join(__dirname, 'pack-plugin.js')
        await runScript(packScript, commandArgs)
        break

      default:
        console.error(`❌ 未知命令: ${command}`)
        console.log('使用 "npm create @vnite/plugin" 创建新插件')
        console.log('运行 "npx @vnite/plugin-sdk help" 查看可用命令')
        process.exit(1)
    }
  } catch (error) {
    console.error('❌ 命令执行失败:', error.message)
    process.exit(1)
  }
}

main().catch(console.error)
