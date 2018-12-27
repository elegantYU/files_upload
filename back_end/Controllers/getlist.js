const Getlist = require('../Models/getlist')

class List {
  static getlist (ctx) {
    const {res} = ctx
    let result = []
    Getlist.pulllist((rows) => {
      rows.forEach((e) => {
        let temp = {}
        temp.name = e.filename
        temp.submitter = e.submitter
        temp.updateTime = e.uptime
        temp.planTime = e.plantime
        temp.remark = e.remark
        temp.url = e.path
        result.push(temp)
      })
      res.json(result)
    })
  }
}

module.exports = List