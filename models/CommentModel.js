const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment_name: { type: String, required: true }, // 评论者名称
  goods_name: { type: Array, required: true }, // 评论的商品名称
  create_time: { type: Number, default: Date.now }, // 评论时间
  content: { type: String, required: true }, // 评论的内容
});

const CommentModel = mongoose.model('comments', commentSchema);

module.exports = CommentModel;
