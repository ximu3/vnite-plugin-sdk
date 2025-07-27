#!/usr/bin/env node

/**
 * Vnite Plugin SDK CLI
 * Main command line tool, supports multiple sub-commands
 */

const { spawn } = require('child_process')
const path = require('path')

function showHelp() {
  console.log(`
Vnite Plugin SDK CLI

Usage:
  npx vnite-plugin-sdk <command> [options]

Commands:
  pack [path]      Package plugin as .vnpkg file
  help            Show help information

Examples:
  npx vnite-plugin-sdk pack ./my-plugin
  npx vnite-plugin-sdk help

Create new plugin:
  npm create vnite-plugin [my-plugin]

More information:
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
        reject(new Error(`Command execution failed, exit code: ${code}`))
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
        // Call packaging script
        const packScript = path.join(__dirname, 'pack-plugin.js')
        await runScript(packScript, commandArgs)
        break

      default:
        console.error(`Unknown command: ${command}`)
        console.log('Use "npm create @vnite/plugin" to create a new plugin')
        console.log('Run "npx @vnite/plugin-sdk help" to see available commands')
        process.exit(1)
    }
  } catch (error) {
    console.error('Command execution failed:', error.message)
    process.exit(1)
  }
}

main().catch(console.error)
