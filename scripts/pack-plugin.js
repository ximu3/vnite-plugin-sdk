#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

/**
 * 打包插件脚本
 */
async function packPlugin() {
  console.log('📦 打包 Vnite 插件\n')

  try {
    const cwd = process.cwd()
    const manifestPath = path.join(cwd, 'package.json')

    // 检查是否存在 package.json
    if (!fs.existsSync(manifestPath)) {
      throw new Error('package.json not found in current directory')
    }

    // 读取 manifest
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

    // 验证必需字段
    if (!manifest.id || !manifest.name || !manifest.version || !manifest.main) {
      throw new Error('Invalid package.json: missing required fields (id, name, version, main)')
    }

    console.log(`插件名称: ${manifest.name}`)
    console.log(`插件ID: ${manifest.id}`)
    console.log(`版本: ${manifest.version}`)
    console.log(`主文件: ${manifest.main}`)

    // 检查主文件是否存在
    const mainFile = path.join(cwd, manifest.main)
    if (!fs.existsSync(mainFile)) {
      throw new Error(`Main file not found: ${manifest.main}`)
    }

    // 创建输出目录
    const outputDir = path.join(cwd, 'dist')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // 创建临时打包目录
    const tempDir = path.join(outputDir, '.temp-package')
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
    fs.mkdirSync(tempDir, { recursive: true })

    console.log('\n📋 复制文件...')

    // 定义要包含的文件/目录
    const includePatterns = [
      'dist/*.js',
      'dist/*.js.map',
      'dist/*.d.ts',
      'package.json',
      'README.md',
      'LICENSE',
      'icon.png',
      'icon.ico',
      'assets/**/*'
    ]

    // 复制文件
    for (const pattern of includePatterns) {
      try {
        const sourcePath = path.join(cwd, pattern)
        if (pattern.includes('*')) {
          // 处理通配符
          const dir = path.dirname(pattern)
          const fileName = path.basename(pattern)
          const sourceDir = path.join(cwd, dir)

          if (fs.existsSync(sourceDir)) {
            const files = fs.readdirSync(sourceDir)
            for (const file of files) {
              if (fileName === '*' || file.match(fileName.replace(/\*/g, '.*'))) {
                const src = path.join(sourceDir, file)
                const dest = path.join(tempDir, dir, file)

                // 确保目标目录存在
                const destDir = path.dirname(dest)
                if (!fs.existsSync(destDir)) {
                  fs.mkdirSync(destDir, { recursive: true })
                }

                if (fs.statSync(src).isFile()) {
                  fs.copyFileSync(src, dest)
                  console.log(`  ✓ ${path.relative(cwd, src)}`)
                }
              }
            }
          }
        } else {
          // 直接复制文件
          if (fs.existsSync(sourcePath)) {
            const dest = path.join(tempDir, pattern)
            const destDir = path.dirname(dest)

            if (!fs.existsSync(destDir)) {
              fs.mkdirSync(destDir, { recursive: true })
            }

            if (fs.statSync(sourcePath).isFile()) {
              fs.copyFileSync(sourcePath, dest)
              console.log(`  ✓ ${pattern}`)
            } else if (fs.statSync(sourcePath).isDirectory()) {
              copyDirRecursive(sourcePath, dest)
              console.log(`  ✓ ${pattern}/`)
            }
          }
        }
      } catch (error) {
        // 忽略可选文件的错误
        console.log(`  ~ ${pattern} (optional, skipped)`)
      }
    }

    // 生成最终的 manifest.json
    console.log('\n📝 生成 manifest.json...')
    const finalManifest = {
      ...manifest,
      packagedAt: new Date().toISOString(),
      sdkVersion: getSDKVersion()
    }

    fs.writeFileSync(path.join(tempDir, 'manifest.json'), JSON.stringify(finalManifest, null, 2))
    console.log('  ✓ manifest.json')

    // 创建 .vnpkg 文件
    console.log('\n🗜️  创建压缩包...')
    const safeId = sanitizeFilename(manifest.id)
    const outputFile = path.join(outputDir, `${safeId}-${manifest.version}.vnpkg`)

    try {
      await createArchive(tempDir, outputFile)
      console.log(`  ✓ ${path.relative(cwd, outputFile)}`)
    } catch (error) {
      throw new Error(`Failed to create package: ${error.message}`)
    }

    // 清理临时文件
    fs.rmSync(tempDir, { recursive: true })

    // 显示文件大小
    const stats = fs.statSync(outputFile)
    const fileSize = (stats.size / 1024).toFixed(2)

    console.log('\n✅ 打包完成!')
    console.log(`📦 文件: ${path.relative(cwd, outputFile)}`)
    console.log(`📏 大小: ${fileSize} KB`)
  } catch (error) {
    console.error('❌ 打包失败:', error.message)
    process.exit(1)
  }
}

/**
 * 使用 archiver 创建压缩包
 */
function createArchive(sourceDir, outputFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile)
    const archive = archiver('zip', {
      zlib: { level: 9 } // 设置最高压缩级别
    })

    output.on('close', () => {
      resolve()
    })

    output.on('error', (err) => {
      reject(err)
    })

    archive.on('error', (err) => {
      reject(err)
    })

    archive.pipe(output)

    // 添加目录中的所有文件
    archive.directory(sourceDir, false)

    archive.finalize()
  })
}

/**
 * 递归复制目录
 */
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  const files = fs.readdirSync(src)
  for (const file of files) {
    const srcPath = path.join(src, file)
    const destPath = path.join(dest, file)

    if (fs.statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

/**
 * 获取 SDK 版本
 */
function getSDKVersion() {
  try {
    const sdkPackagePath = path.join(__dirname, '..', 'package.json')
    const sdkPackage = JSON.parse(fs.readFileSync(sdkPackagePath, 'utf8'))
    return sdkPackage.version
  } catch {
    return '1.0.0'
  }
}

function sanitizeFilename(input) {
  if (!input) return ''

  // 替换所有不安全的文件名字符
  return input
    .replace(/[\\\/\:\*\?"<>\|]/g, '_') // 替换Windows和POSIX系统不允许的字符
    .replace(/\s+/g, '_') // 替换空白字符为下划线
    .replace(/^\.+/, '') // 移除开头的点号 (隐藏文件)
    .replace(/\.+$/, '') // 移除结尾的点号
}

packPlugin()
