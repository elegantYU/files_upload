const SqlFn = require('../utils/SqlFn')

class SendFile {
  static read (body,cb) {
    const sql = `INSERT INTO fileslist (filename,submitter,uptime,plantime,remark,path,diskpath) VALUES ('${body.proName}','${body.submitter}','${body.uptime}','${body.plantime}','${body.remark}','${body.online}','${body.diskPath}');`
    SqlFn(sql, cb)
  }
}

module.exports = SendFile