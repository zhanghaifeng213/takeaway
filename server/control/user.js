const jsonwebtoken = require('jsonwebtoken')
const UserModel = require('../models/user')
const encrypt = require('../util/encrypt')
const fs = require('fs')
const { join } = require('path')
const { jwtSecret } = require('../config/config')

class User {
  // 用户注册(添加)

  async reg(ctx) {
    const data = ctx.request.body
    const checkUser = await UserModel.findOne({
      username: data.username
    })
    if (checkUser !== null) {
      return ctx.sendError('000002', '该用户名已存在')
    }
    const user = new UserModel({
      username: data.username,
      password: data.password,
      role: data.role
    })
    const result = await user.save()
    return result !== null
      ? ctx.send(null, '注册成功')
      : ctx.sendError('000002', '注册失败')
  }

  // 用户修改
  async update(ctx) {
    const { username, password, id } = ctx.request.body
    await UserModel.updateOne(
      { _id: id },
      { username, password }
    )

    ctx.send('修改成功')
  }

  // 用户删除
  async del(ctx) {
    const { user } = ctx.state
    if (user.role == 0) {
      const { userId } = ctx.request.body

      await UserModel.findById(userId)
        .then(data => data.remove())
        .catch(err => {
          return ctx.sendError(0, '删除失败，服务器错误')
        })
      return ctx.send('删除成功')
    } else {
      return ctx.sendError(0, '没有权限')
    }
  }
  // 用户查询
  async inquire(ctx) {
    let { pageNum = 1, pageSize = 10 } = ctx.query

    const maxNum = await UserModel.estimatedDocumentCount((err, num) =>
      err ? console.log(err) : num
    )
    if (pageNum && pageSize) {
      pageNum--
      pageNum = parseInt(pageNum)
      pageSize = parseInt(pageSize)
      await UserModel.find()
        .skip(pageNum * pageSize)
        .limit(pageSize)
        .then(data => {
          return ctx.send({ userLists: data, totalPage: maxNum })
        })
        .catch(err => {
          return ctx.sendError('000002')
        })
    } else {
      return ctx.sendError('000002', '没有传入分页')
    }
  }

  // 用户登录
  async login(ctx) {
    const { username, password, role } = ctx.request.body
    if (!username || !password) {
      return ctx.sendError('000002', '参数不合法')
    }
    const result = await UserModel.findOne({
      username,
      password: password,
      role
    })
    if (result !== null) {
      const token = jsonwebtoken.sign(
        {
          username: result.username,
          id: result._id,
          role: result.role
        },
        jwtSecret,
        { expiresIn: 60 * 60 }
      )
      return ctx.send(token, '登录成功')
    } else {
      return ctx.sendError('000002', '用户名或密码错误')
    }
  }

  // 图像修改
  async upload(ctx) {
    const { user } = ctx.state
    if (user) {
      const { id } = payload
      const filename = ctx.req.file.filename
      let data = {}
      const oldFile = await User.findById(id)
      if (oldFile.avatar != '/avatar/default.jpg') {
        fs.unlink(join(__dirname, `../public${oldFile.avatar}`), function (err) {
          if (err) return console.log(err)
          console.log('文件删除成功')
        })
      }
      await User.update(
        {
          _id: id
        },
        {
          $set: {
            avatar: '/avatar/' + filename
          }
        },
        (err, res) => {
          if (err) {
            data = {
              status: 0,
              message: err
            }
          } else {
            data = {
              status: 1,
              message: '上传成功'
            }
          }
        }
      )
      ctx.body = data
    } else {
      return (ctx.body = {
        code: 0,
        message: '查询失败',
        data: '请先登录'
      })
    }
  }

  // 获取用户信息
  async getinfo(ctx) {
    const data = ctx.state.user
    const user = await UserModel.findById(data.id)
    if (user !== null) {
      const result = {
        id: user._id,
        username: user.username,
        role: user.role,
        avatar: user.avatar
      }
      return ctx.send(result)
    } else {
      return ctx.send(null, '请先登录')
    }
  }
}

module.exports = new User()
