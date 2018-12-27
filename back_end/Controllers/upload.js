const fs = require('fs')
const unzip = require('unzip')
const cheerio = require('cheerio')
const SendFile = require('../Models/upload')
const path = require('../config/files.config')

class Up {
  static savefiles (ctx) {
    const {body,files,res} = ctx
    const originalname = files[0].originalname.changeFn()
    let originalPath = `${path.recordPath}${originalname}`
    const extract = unzip.Extract({path: originalPath})
    // 记录本地地址
    body.diskPath = originalPath

    // 解压包
    fs.createReadStream(files[0].path)
      .pipe(extract)
    //  unzip内部回调
    extract.on('error', (err) => {
      console.log(`解压报错：`)
      console.log(err)
    })
    extract.on('finish', () => {
      // 删除压缩包
      fs.unlink(files[0].path,(err) => {
        if(err) console.log(err)
      })
      // 修改start.html (适配axure)
      setTimeout(() => {
        fs.access(`${originalPath}/start.html`, (err) => {
          if (err) {
            fs.access(`${originalPath}/index.html`, (err) => {
              if (err) {
                fs.readdir(originalPath, (err, files) => {
                  const temp = files[0].substring(0,files[0].indexOf('.'))
                  const subFileName = files[0].replace(temp,originalname)
                  fs.renameSync(`${originalPath}/${files[0]}`,`${originalPath}/${subFileName}`)
                  originalPath = `${originalPath}/${subFileName}`
                  body.online = originalPath.url()
                  return SendFile.read(body,(rows) => {
                    if(rows) res.json({msg: 'OK'})
                  })
                })
              } else {
                originalPath = `${originalPath}/index.html`
                body.online = originalPath.url()
                return SendFile.read(body,(rows) => {
                  if(rows) res.json({msg: 'OK'})
                })
              }
            })
          } else {
            originalPath = `${originalPath}/start.html`
            fs.readFile(`${originalPath}`,{encoding: 'utf-8'},(err, data) => {
              if(err) console.log(err)
              const $ = cheerio.load(data)
              $('head').append(path.appendContent)
              body.online = originalPath.url()
              return SendFile.read(body,(rows) => {
                if(rows) res.json({msg: 'OK'})
              })
            })
          }
        })
      },1000)
    })
  }
}

module.exports = Up