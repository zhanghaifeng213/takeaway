const InfoModel = require('../models/info')
const fs = require('fs')
const path = require('path');
class Info {
  // 获取信息
  async list(ctx) {
    const result = await InfoModel.findOne()
    if (result) {
      ctx.send(result)
    } else {
      ctx.send([])
    }
  }
  // 修改信息
  async update(ctx) {
    const { user } = ctx.state
    if (user.role == 0) {
      const { name, announcement, id } = ctx.request.body
      if (name) {
        await InfoModel.updateOne({ _id: id }, { name })
      }
      if (announcement) {
        await InfoModel.updateOne({ _id: id }, { announcement })
      }
      ctx.send('修改成功')
    } else {
      return ctx.sendError(0, '没有权限')
    }
  }
  // async upload(ctx) {
  //   const { user } = ctx.state
  //   console.log('ctx.request.files')
  //   console.log(ctx.request.files)
  //   const { file } = ctx.request.files || {} // 获取上传文件
  //   const reader = fs.createReadStream(file.path) // 创建可读流
  //   const extname = path.extname(file.name)

  //   const filename = ctx.request.files.name
  //   // const filename = ctx.req.files.filename
  //   const oldFile = await InfoModel.findOne()
  //   if (oldFile.avatar != '/info-img/default.jpg') {
  //     fs.unlink(path.resolve(__dirname, `../public${oldFile.avatar}`), function (err) {
  //       if (err) return console.log(err)
  //       console.log('文件删除成功')
  //     })
  //   }

  //   await InfoModel.updateOne(
  //     {
  //       avatar: oldFile.avatar
  //     },
  //     {
  //       $set: {
  //         avatar: '/info-img/' + filename
  //       }
  //     },
  //     (err, res) => {
  //       if (err) {
  //         return ctx.sendError('头像上传失败')
  //       } else {
  //         return ctx.send('头像上传成功')
  //       }
  //     }
  //   )
  // }
}

module.exports = new Info()
