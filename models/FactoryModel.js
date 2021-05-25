const mongoose = require('mongoose');

const factorySchema = new mongoose.Schema({
  factory_name: { type: String, required: true }, // 厂家名称
  main_name: { type: Array, required: true }, // 负责人名称
  phone: { type: String }, // 联系方式
  address: { type: String }, // 地址
  create_time: { type: Number, default: Date.now }, // 创建时间
  desc: { type: String }, // 描述
});

const FactoryModel = mongoose.model('factorys', factorySchema);

FactoryModel.findOne({ factory_name: 'flower' })
  .then(factory => {
    if (!factory)
      FactoryModel.create({ factory_name: 'flower', main_name: [ 'ljq', 'rwj' ], 
        phone: '88888888', address: '绵阳青义区', create_time: Date.now(), desc: '666' })
        .then(factory => {
          console.log('初始化厂家成功！');
        });
  })

module.exports = FactoryModel;
