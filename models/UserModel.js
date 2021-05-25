/**
顾客或管理员信息的Model
 */

// 1.引入mongoose
const mongoose = require('mongoose');
const md5 = require('blueimp-md5');

// 2.字义Schema(描述文档结构)
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // 用户名
  password: { type: String, required: true }, // 密码
  type: { type: Number, required: true }, // 用户 0 或 超级管理员 1 或 管理员 2标识
  belongTo: String, // 所属厂家
  phone: String,
  email: String,
  address: String,
  create_time: { type: Number, default: Date.now },
})

// 3. 定义Model(与集合对应, 可以操作集合)
const UserModel = mongoose.model('users', userSchema);

// 初始化默认管理员
UserModel.findOne({ username: 'lijunqi' }).then(user => {
  if(!user) {
    UserModel.create({ username: 'lijunqi', password: md5('666'), type: 1, belongTo: 'flower' })
            .then(user => {
              console.log('初始化用户: 用户名: lijunqi 密码为: 666');
            });
  }
})

module.exports = UserModel;
