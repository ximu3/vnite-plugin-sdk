#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

/**
 * Plugin packaging script
 */
async function packPlugin() {
  console.log('Packaging Vnite Plugin\n')

  try {
    const cwd = process.cwd()
    const manifestPath = path.join(cwd, 'package.json')

    // Check if package.json exists
    if (!fs.existsSync(manifestPath)) {
      throw new Error('package.json not found in current directory')
    }

    // Read manifest
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

    // Validate required fields
    if (!manifest.id || !manifest.name || !manifest.version || !manifest.main) {
      throw new Error('Invalid package.json: missing required fields (id, name, version, main)')
    }

    console.log(`Plugin name: ${manifest.name}`)
    console.log(`Plugin ID: ${manifest.id}`)
    console.log(`Version: ${manifest.version}`)
    console.log(`Main file: ${manifest.main}`)

    // Check if main file exists
    const mainFile = path.join(cwd, manifest.main)
    if (!fs.existsSync(mainFile)) {
      throw new Error(`Main file not found: ${manifest.main}`)
    }

    // Create output directory
    const outputDir = path.join(cwd, 'dist')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Create temporary packaging directory
    const tempDir = path.join(outputDir, '.temp-package')
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true })
    }
    fs.mkdirSync(tempDir, { recursive: true })

    console.log('\nCopying files...')

    // Define files/directories to include
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

    // Copy files
    for (const pattern of includePatterns) {
      try {
        const sourcePath = path.join(cwd, pattern)
        if (pattern.includes('*')) {
          // Handle wildcards
          const dir = path.dirname(pattern)
          const fileName = path.basename(pattern)
          const sourceDir = path.join(cwd, dir)

          if (fs.existsSync(sourceDir)) {
            const files = fs.readdirSync(sourceDir)
            for (const file of files) {
              if (fileName === '*' || file.match(fileName.replace(/\*/g, '.*'))) {
                const src = path.join(sourceDir, file)
                const dest = path.join(tempDir, dir, file)

                // Ensure target directory exists
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
          // Direct file copy
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
        // Ignore errors for optional files
        console.log(`  ~ ${pattern} (optional, skipped)`)
      }
    }

    // Generate final manifest.json
    console.log('\nGenerating manifest.json...')
    const finalManifest = {
      ...manifest,
      packagedAt: new Date().toISOString(),
      sdkVersion: getSDKVersion()
    }

    fs.writeFileSync(path.join(tempDir, 'manifest.json'), JSON.stringify(finalManifest, null, 2))
    console.log('  ✓ manifest.json')

    // Create .vnpkg file
    console.log('\nCreating archive...')
    const safeId = sanitizeFilename(manifest.id)
    const outputFile = path.join(outputDir, `${safeId}-${manifest.version}.vnpkg`)

    try {
      await createArchive(tempDir, outputFile)
      console.log(`  ✓ ${path.relative(cwd, outputFile)}`)
    } catch (error) {
      throw new Error(`Failed to create package: ${error.message}`)
    }

    // Clean up temporary files
    fs.rmSync(tempDir, { recursive: true })

    // Display file size
    const stats = fs.statSync(outputFile)
    const fileSize = (stats.size / 1024).toFixed(2)

    console.log('\nPackaging complete!')
    console.log(`File: ${path.relative(cwd, outputFile)}`)
    console.log(`Size: ${fileSize} KB`)
  } catch (error) {
    console.error('Packaging failed:', error.message)
    process.exit(1)
  }
}

/**
 * Create archive using archiver
 */
function createArchive(sourceDir, outputFile) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputFile)
    const archive = archiver('zip', {
      zlib: { level: 9 } // Set maximum compression level
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

    // Add all files in the directory
    archive.directory(sourceDir, false)

    archive.finalize()
  })
}

/**
 * Recursively copy directory
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
 * Get SDK version
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

  // Replace all unsafe filename characters
  return input
    .replace(/[\\\/\:\*\?"<>\|]/g, '_') // Replace Windows and POSIX disallowed characters
    .replace(/\s+/g, '_') // Replace whitespace with underscore
    .replace(/^\.+/, '') // Remove leading dots (hidden files)
    .replace(/\.+$/, '') // Remove trailing dots
}

packPlugin()
