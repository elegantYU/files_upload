const express = require('express')
const router = express.Router()
const Up = require('../Controllers/upload')
const List = require('../Controllers/getlist')
const Delete = require('../Controllers/delete')

const multerUpload = require('../MiddleWare/upload')

/* GET home page. */
router
  // 文件上传
  .post('/postFiles', multerUpload.any(), Up.savefiles)
  // 获取列表
  .get('/getFilesList', List.getlist)
  // 删除文件
  .delete('/deleteFiles', Delete.deleteFile)

module.exports = router
