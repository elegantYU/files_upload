const SqlFn = require('../utils/SqlFn')

class Getlist {
  static pulllist (cb) {
    const sql = `SELECT * FROM fileslist;`
    SqlFn(sql, cb)
  }
}

module.exports = Getlist