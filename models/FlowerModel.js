const mongoose = require('mongoose');

const flowerSchema = new mongoose.Schema({
  flowername: { type: String, required: true }, // 名称
  desc: { type: String }, // 描述
  price: { type: Number, required: true }, // 价格
  total: { type: Number }, // 数量
  img: {type: Object, default: {} }, // 图片
});

const FlowerModel = mongoose.model('flowers', flowerSchema);

module.exports = FlowerModel;