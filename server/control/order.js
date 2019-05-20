const mongoose = require('mongoose');
const OrderModel = require("../models/order");
const MenuModel = require('../models/menu');
const OrderListModel = require('../models/orderList');
var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
let num = 0
let oldOrderTime = new Date().getTime()
class Order {
    FillZero(p) {
        return new Array(3 - (p + '').length + 1).join('0') + p;
    }
    // 顾客端新增订单 
    async add(ctx) {
        const { user } = ctx.state;
        num++
        let orderNum = new Date().getTime()
        if (num >= 1000) {
            num = 1
        }
        if (orderNum - oldOrderTime > 4 * 1000 * 60 * 60) {
            oldOrderTime = orderNum
            num = 1
        }
        orderNum += new Order().FillZero(num)

        const {
            list
        } = ctx.request.body;
        if (list.length === 0) return ctx.sendError(-1, '参数错误');
        // 参数需为数组
        const resData = await Promise.all(list.map(item => {
            return new Promise((resolve, reject) => {
                MenuModel.findById(item.menuItem, (err, data) => {
                    resolve({
                        menuDetail: data,
                        count: item.count,
                    })
                })

            })
        }));
        let amount = 0
        resData.forEach(item => {
            amount += item.menuDetail.price * item.count
        })
        const model = new OrderModel({
            orderNum,
            userId: user.id,
            list: resData,
            amount,
            realAmount: amount
        });
        await model.save((err, data) => {
            if (err) {
                return ctx.sendError(0, '点单失败')
            } else {
                io.emit('NEW_ORDER', data)
            }
        });
        // event.on('some_event', () => {
        //     console.log('on some_event')

        // });
        ctx.send(orderNum)
    }
    // 后台管理更新订单状态
    async update(ctx) {
        const { user } = ctx.state
        const {
            orderId, // 订单id
            status // 订单状态
        } = ctx.request.body;
        if (status == 6 && user.role == 1) {
            await OrderModel.updateOne({
                _id: orderId,
                status: 0
            }, {
                    $set: {
                        status: 6
                    }
                }, (err, res) => {
                    if (err) {
                        return ctx.sendError(0, '更新失败')
                    } else {
                        // 向指定顾客推送soket,更新订单状态
                        return ctx.send('操作成功')
                    }
                })
        } else {
            await OrderModel.updateOne({
                _id: orderId, status: { $lt: 5 }
            }, {
                    $set: {
                        status
                    }
                }, (err, res) => {
                    if (err) {
                        return ctx.sendError(0, '更新失败')
                    } else {
                        if (res.n == 0) {
                            return ctx.sendError(3, '订单已取消')
                        }
                        // 向指定顾客推送soket,更新订单状态
                        return ctx.send('操作成功')
                    }
                })
        }

    }
    // 后台管理获取未完成的订单列表
    async list(ctx) {
        let {
            id
        } = ctx.query;
        const result = await OrderModel.find({ userId: id, status: { $lt: 5 } }).sort('-created').populate({
            path: 'userId',
            select: '_id username realname tel address'
        })
        ctx.send({
            list: result,
            totalPage: maxNum
        })
    }
    // 后台管理获取未完成的订单列表
    async clist(ctx) {
        let {
            pageNum = 1, pageSize = 10
        } = ctx.query;
        pageNum--;
        pageNum = parseInt(pageNum)
        pageSize = parseInt(pageSize)
        const maxNum = await OrderModel.find({ status: { $lt: 5 } }).countDocuments(true)
        const result = await OrderModel.find({ status: { $lt: 5 } }).sort('-created').populate({
            path: 'userId',
            select: '_id username realname tel address'
        }).skip(pageNum * pageSize)
            .limit(pageSize) // mongoose 用于连表查询
        ctx.send({
            list: result,
            totalPage: maxNum
        })
    }
    // 后台管理获取已完成的历史订单列表
    async hlist(ctx) {
        let {
            pageNum = 1, pageSize = 10
        } = ctx.query;
        pageNum--;
        pageNum = parseInt(pageNum)
        pageSize = parseInt(pageSize)
        const maxNum = await OrderModel.countDocuments({ status: { $eq: 5 } })
        const result = await OrderModel.find({ status: { $eq: 5 } }).sort('-created').populate({
            path: 'userId',
            select: '_id username realname tel address'
        }).skip(pageNum * pageSize)
            .limit(pageSize) // mongoose 用于连表查询
        ctx.send({
            list: result,
            totalPage: maxNum
        })

    }
    // 后台管理删除订单
    // 用户删除
    async delete(ctx) {
        const { user } = ctx.state
        if (user.role == 0) {
            const { OrderId } = ctx.request.body
            await OrderModel.findById(OrderId)
                .then(data => data.remove())
                .catch(err => {
                    return ctx.sendError(0, '删除失败，服务器错误')
                })
            return ctx.send('订单删除成功')
        } else {
            return ctx.sendError(0, '没有权限')
        }
    }
    // 根据订单号获取订单列表
    async getLists(ctx) {
        const { user } = ctx.state;
        // 参数需为数组
        // const resData = await Promise.all(orderNumbers.map(orderNum => {
        //     return OrderModel.findOne({ orderNum })
        // }));
        const resData = await OrderModel.find({ userId: user.id, status: { $lt: 5 } })
        ctx.send(resData, '请求成功');

    }
}

module.exports = new Order();
