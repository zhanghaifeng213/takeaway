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
            tableNum,
            list
        } = ctx.request.body;
        if (list.length === 0 || !tableNum) return ctx.sendError(-1, '参数错误');
        var arr = []
        if (list.length > 0) {
            let arrlist = new Array(...list)
            let len = list.length
            let count = 0
            arrlist.forEach(item => {
                let res = {}
                MenuModel.findById(item.menuItem, (err, data) => {
                    if (err) {
                        console.log('err');
                        console.log(err);
                    } else {
                        res.menuDetail = data
                        count++
                        if (count == len) {
                            console.log('emit some_event')
                            event.emit('some_event')
                        }
                    }
                })
                res.count = item.count
                arr.push(res)
            });
        }
        event.on('some_event', () => {
            console.log('on some_event')
            let amount = 0
            arr.forEach((item) => {
                amount += item.count * item.menuDetail.price
            })
            const model = new OrderModel({
                orderNum,
                tableNum,
                list: arr,
                amount,
                realAmount: amount
            });
            model.save((err, data) => {
                if (err) {
                    return ctx.sendError(0, '点单失败')
                } else {
                    io.emit('NEW_ORDER', data)
                }
            });
        });
        ctx.send(orderNum)
    }
    // 后台管理更新订单状态
    async update(ctx) {
        const {
            orderId, // 订单id
            status // 订单状态
        } = ctx.request.body;
        await OrderModel.updateOne({
            _id: orderId
        }, {
                $set: {
                    status
                }
            }, (err, res) => {
                if (err) {
                    ctx.sendError(0, '更新失败')
                } else {
                    // 向指定顾客推送soket,更新订单状态
                    ctx.send('操作成功')
                }
            })
    }
    // 后台管理获取未完成的订单列表
    async list(ctx) {
        let {
            id
        } = ctx.query;
        const result = await OrderModel.find({ tableNum: id, status: { $lt: 5 } }).sort('-created').populate({
            path: 'tableNum',
            select: '_id num'
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
            path: 'tableNum',
            select: '_id num'
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
            path: 'tableNum',
            select: '_id num'
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
        let { orderNumbers } = ctx.request.body;
        // 参数需为数组
        if (!orderNumbers || !Array.isArray(orderNumbers)) {
            ctx.sendError('参数错误');
            return;
        }
        const resData = await Promise.all(orderNumbers.map(orderNum => {
            return OrderModel.findOne({ orderNum })
        }));
        ctx.send(resData, '请求成功');

    }
}

module.exports = new Order();
