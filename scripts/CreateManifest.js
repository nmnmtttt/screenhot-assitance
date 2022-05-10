const path = require('path')
const manifest = require(`${path.resolve(process.cwd(), './src/manifest.json')}`)

// 获取package 版本号
function str2ab(str) {
  return Buffer.from(str)
}
class CreateManifest {
  constructor(options) {
    options = options || {}
    this.options = {
      filename: options.filename || null,
    }
  }
  apply(compiler) {
    compiler.hooks.emit.tap('CreateManifest', (compilation) => {
      const manifestBuf = str2ab(JSON.stringify(manifest))
      compilation.assets['manifest.json'] = {
        source: function () {
          return manifestBuf
        },
        size: function () {
          return manifestBuf.length
        },
      }
    })
  }
}
module.exports = CreateManifest
