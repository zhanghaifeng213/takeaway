const {
  Schema
} = require("./config")
const ObjectId = Schema.Types.ObjectId
const ChildrenSchema = new Schema({
  menuItem: {
    type: ObjectId,
    ref: 'menus'
  }, // 点餐项
  count: Number // 数量
})
const OrderSchema = new Schema({
  orderNum: Number, // 订单号
  userId: { type: ObjectId, ref: "users" }, // 桌号
  status: { type: Number, default: 0 }, // 订单状态
  list: Array, // 顾客点单列表
  amount: { type: Number, default: 0 }, // 订单金额
  realAmount: { type: Number, default: 0 }, // 实际结账金额
  remarks: { type: String, default: '' } // 备注
}, { versionKey: false, timestamps: { createdAt: "created" } })
module.exports = OrderSchema
