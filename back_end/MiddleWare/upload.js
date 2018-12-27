const multer = require('multer')
const path = require('../config/files.config')

const storage = multer.diskStorage({
  destination: function (req, file, cb) { 
    cb(null, path.recordPath)
  },
  // 重命名文件
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({
  storage: storage
})

module.exports = upload