const { Schema } = require('./config')

const InfoSchema = new Schema(
  {
    name: { type: String, default: '暂无' },
    avatar: { type: String, default: '/info-img/default.jpg' },
    announcement: { type: String, default: '暂无' }
  },
  {
    versionKey: false
  }
)
module.exports = InfoSchema
