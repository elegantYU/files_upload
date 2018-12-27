const SqlFn = require('../utils/SqlFn')

class GetDelete {
  static start (name, cb) {
    const sql = `SELECT diskpath FROM fileslist WHERE filename='${name}';
    DELETE FROM fileslist WHERE filename='${name}';`
    SqlFn(sql, cb)
  }
}

module.exports = GetDelete