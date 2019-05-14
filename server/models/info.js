const { db } = require('../schema/config')

const InfoSchema = require('../schema/info')
const Info = db.model('infos', InfoSchema)

module.exports = Info
