/*
 * @Content: 所有模块路由
 * => 基础API
 * => 用户模块
 * => 菜单模块
 *
 * @Author: Edwin
 * @Last Modified by: Edwin
 * @Last Modified time: 2019-01-24 23:53:34
 * @Last Modified time: 2019-02-01 14:40:40
 */
const Router = require('koa-router')()

const home = require('./home') // 基础API
const upload = require('./image') // 文件上传
const user = require('./user') // 用户模块
const category = require('./category') // 菜单模块
const menu = require('./menu') // 菜单模块
const table = require('./table') // 桌号模块
const order = require('./order') // 订单模块
const info = require('./info') // 信息模块

Router.use('/', home.routes(), home.allowedMethods())
Router.use('/image', upload.routes(), upload.allowedMethods())
Router.use('/user', user.routes(), user.allowedMethods())
Router.use('/category', category.routes(), category.allowedMethods())
Router.use('/menu', menu.routes(), menu.allowedMethods())
Router.use('/table', table.routes(), table.allowedMethods())
Router.use('/order', order.routes(), order.allowedMethods())
Router.use('/info', info.routes(), info.allowedMethods())

module.exports = Router
