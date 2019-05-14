const Router = require('koa-router')()
const Info = require('../control/info')
const infoUpload = require('../util/upload')
Router.get('/list', Info.list)

Router.post('/update', Info.update)

// Router.post('/upload', infoUpload.single('file'), Info.upload)
module.exports = Router
