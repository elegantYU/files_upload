const config = require('../config/files.config')
const fs = require('fs')

// 去除文件后缀
String.prototype.changeFn = function () {  
  return this.slice(0,this.indexOf('.'))
}
// 改为线上地址
String.prototype.url = function () {  
  return this.replace(config.recordPath,config.onlinePath)
}
const Utils = {
  delDir(path) {
    let files = []
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path)
      files.forEach(v => {
        let curPath = path + '/' + v
        if (fs.statSync(curPath).isDirectory()) {
          delDir(curPath)
        } else {
          fs.unlinkSync(curPath)
        }
      })
      fs.rmdirSync(path)
    }
  }
}

module.exports = Utils