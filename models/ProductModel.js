/*
能操作products集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose');

// 2.字义Schema(描述文档结构)
const productSchema = new mongoose.Schema({
  productname: { type: String, required: true }, // 名称
  price: { type: Number, required: true }, // 价格
  desc: { type: String },
  status: { type: Number, default: 1 }, // 商品状态: 1:在售, 2: 下架了
  imgs: { type: Array, default: [] }, // 图片base64
})


// 3. 定义Model(与集合对应, 可以操作集合)
const ProductModel = mongoose.model('products', productSchema);

// 4. 向外暴露Model
module.exports = ProductModel;