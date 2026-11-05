const path = require('path')
const fs = require('fs')

// Fallback to WASM SWC if on Windows where native binary isn't matched
const wasmDir = path.join(__dirname, 'node_modules', '@next', 'swc-wasm-nodejs')
if (fs.existsSync(wasmDir)) {
  process.env.NEXT_TEST_WASM_DIR = wasmDir
}

/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig
