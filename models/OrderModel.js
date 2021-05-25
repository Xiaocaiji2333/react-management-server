const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_name: { type: String, required: true }, // 购买者名称
  goods: { type: Array, required: true }, // 购买的商品(名称/goods_name,单价/singlePrice,数量/count)
  create_time: { type: Number, default: Date.now }, // 创建时间
  price: { type: Number, required: true }, // 总价格
});

const OrderModel = mongoose.model('orders', orderSchema);

module.exports = OrderModel;