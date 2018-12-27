const GetDelete = require('../Models/delete')
const Utils = require('../utils/util')

class Delete {
  static deleteFile (ctx) {
    const {query,res} = ctx
    const name = query.name
    GetDelete.start(name, (rows) => {
      if (rows) {
        const diskpath = rows[0][0].diskpath
        Utils.delDir(diskpath)
        res.json({msg:'OK'})
      }
    })
  }
}

module.exports = Delete