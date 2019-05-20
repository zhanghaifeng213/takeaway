const { Schema } = require("./config");
const { imagePath } = require('../config/config');
const UserSchema = new Schema({
  username: String,
  password: String,
  realname: {
    type: String,
    default: ''
  },
  tel: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    default: 1
  },
  avatar: {
    type: String,
    default: '/avatar/default.jpg'
  }
}, { versionKey: false })

module.exports = UserSchema
