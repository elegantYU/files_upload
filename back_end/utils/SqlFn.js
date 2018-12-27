const mysql = require('mysql')
const mysqlConfig = require('../config/mysql.config')
const pool = mysql.createPool(mysqlConfig)

const SqlFn = (sql, cb) => {
  return pool.getConnection((err, connecntion) => {
    connecntion.query(sql, (err, rows, fields) => {
      if(err) console.log(err)
      cb(rows)
      connecntion.release()
    })
  })
}

module.exports = SqlFn