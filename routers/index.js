/*
用来定义路由的路由器模块
 */
const express = require('express');
const md5 = require('blueimp-md5');

const UserModel = require('../models/UserModel');
const ProductModel = require('../models/ProductModel');
const FlowerModel = require('../models/FlowerModel');
const OrderModel = require('../models/OrderModel');
const CommentModel = require('../models/CommentModel');
const FactoryModel = require('../models/FactoryModel');

// 得到路由器对象
const router = express.Router();
// console.log('router', router)

// 指定需要过滤的属性
const filter = { password: 0, __v: 0 };


// 登陆
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
  UserModel.findOne({ username, password: md5(password) }, filter)
    .then(user => {
      if (user) { // 登陆成功
        console.log(user);
        res.cookie({ userid: user._id }, { maxAge: 1000 * 60 * 60 * 24 });
        res.send({ status: 0, data: user });

      } else {// 登陆失败
        res.send({status: 1, msg: '用户名或密码不正确!'})
      }
    })
    .catch(error => {
      console.error('登陆异常', error)
      res.send({status: 1, msg: '登陆异常, 请重新尝试'})
    })
})

// 注册
router.post('/register', (req, res) => {
  const { username, password, phone, email, type = 0 } = req.body;
  // console.log(req.body);
  UserModel.findOne({ username })
    .then(user => {
      if (user) {
        // console.log(user);
        res.send({ status: -1, msg: '该用户名已经存在！' });
      } else {
        const user = {
          username,
          password: md5(password),
          phone,
          email,
          type
        };
        const userModel = new UserModel(user);
        userModel.save((err, user) => {
          console.log('save', err, user);
          res.send({ status: 0 });
        });
      }
    })
    .catch(error => {
      console.error('登陆异常', error)
      res.send({status: 1, msg: '登陆异常, 请重新尝试'})
    })
})

// 获取所有用户列表
router.get('/manage/user/list', (req, res) => {
  UserModel.find({ type: { '$ne': '1' } })
    .then(users => {
      res.send({ status: 0, data: { users } });
    })
    .catch(error => {
      console.error('获取用户列表异常', error);
      res.send({ status: 1, msg: '获取用户列表异常, 请重新尝试' });
    })
})

router.get('/manage/user/search', (req, res) => {
  const { searchName } = req.query;
  let contition = {};
  if (searchName) {
    contition = { username: new RegExp(`^.*${ searchName }.*$`) };
  }
  UserModel.find(contition)
    .then(users => {
      res.send({ status: 0, data: { users } });
    })
    .catch(error => {
      console.error('搜索用户列表异常', error);
      res.send({ status: -1, msg: '搜索用户列表异常, 请重新尝试' });
    })
})

// 获取管理员列表
router.get('/manage/adminor/list', (req, res) => {
  UserModel.find({ type: { '$ne': '0' } })
    .then(adminors => {
      res.send({ status: 0, data: { adminors } });
    })
    .catch(error => {
      console.error('获取管理员列表异常', error);
      res.send({ status: -1, msg: '获取管理员列表异常, 请重新尝试' });
    })
})

router.get('/manage/adminor/search', (req, res) => {
  const { searchName } = req.query;
  let contition = {};
  if (searchName) {
    contition = { username: new RegExp(`^.*${ searchName }.*$`) };
  }
  UserModel.find(contition)
    .then(adminors => {
      res.send({ status: 0, data: { adminors } });
    })
    .catch(error => {
      console.error('搜索管理员列表异常', error);
      res.send({ status: -1, msg: '搜索管理员列表异常, 请重新尝试' });
    })
})

// 添加用户or管理员
router.post('/manage/user/add', (req, res) => {
  // 读取请求参数数据
  const { username, password } = req.body;
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  UserModel.findOne({ username })
    .then(user => {
      if (user) {
        res.send({ status: -1, msg: '此名称已存在！' });
      } else {
        UserModel.create({ ...req.body, password: md5(password || '666') });
        res.send({ status: 0, msg: '操作成功！' });
      }
    })
    .catch(error => {
      res.send({ status: -1, msg: '添加异常, 请重新尝试！' });
    })
})

// 更新用户or管理员
router.post('/manage/user/update', (req, res) => {
  const user = req.body;
  if (user.password) user.password = md5(user.password);
  UserModel.findOneAndUpdate({ _id: user._id }, user)
    .then(oldUser => {
      // const data = Object.assign(oldUser, user);
      res.send({ status: 0, msg: '更新成功！' });
    })
    .catch(error => {
      console.error('更新用户异常', error);
      res.send({ status: -1, msg: '更新用户异常, 请重新尝试' });
    })
})

// 删除用户or管理员
router.post('/manage/user/delete', (req, res) => {
  const { userId } = req.body;
  UserModel.deleteOne({ _id: userId })
    .then((doc) => {
      res.send({ status: 0, msg: '删除成功！' });
    })
})

// 获取鲜花信息列表
router.get('/manage/flower/list', (req, res) => {
  FlowerModel.find({})
    .then(flowers => {
      res.send({ status: 0, data: { flowers } });
    })
    .catch(error => {
      console.error('获取鲜花列表异常', error);
      res.send({ status: -1, msg: '获取鲜花列表异常, 请重新尝试' });
    })
})

router.get('/manage/flower/search', (req, res) => {
  const { searchName } = req.query;
  let contition = {};
  if (searchName) {
    contition = { username: new RegExp(`^.*${ searchName }.*$`) };
  }
  FlowerModel.find(contition)
    .then(flowers => {
      res.send({ status: 0, data: { flowers } });
    })
    .catch(error => {
      console.error('搜索鲜花列表异常', error);
      res.send({ status: -1, msg: '搜索鲜花列表异常, 请重新尝试' });
    })
})

// 添加鲜花信息
router.post('/manage/flower/add', (req, res) => {
  const { flowername } = req.body;
  FlowerModel.findOne({ flowername })
    .then(flower => {
      if (flower) {
        res.send({ status: -1, msg: '该花已存在！' });
      } else {
        FlowerModel.create({ ...req.body });
        res.send({ status: 0, msg: '添加成功！' });
      }
    })
    .catch(error => {
      console.error('添加鲜花异常', error);
      res.send({ status: -1, msg: '添加鲜花异常, 请重新尝试' });
    })
})

// 更新鲜花信息
router.post('/manage/flower/update', (req, res) => {
  const flower = req.body;
  FlowerModel.findOneAndUpdate({ _id: flower._id }, flower)
    .then(oldFlower => {
      res.send({ status: 0, msg: '更新操作成功' });
    })
    .catch(error => {
      console.error('更新操作异常', error);
      res.send({ status: 1, msg: '更新异常, 请重新尝试' });
    })
})

// 删除鲜花信息
router.post('/manage/flower/delete', (req, res) => {
  const { id } = req.body;
  FlowerModel.deleteOne({ _id: id })
    .then(flower => {
      res.send({ status: 0, msg: '删除成功！' });
    })
    .catch(error => {
      console.error('删除失败！', error);
      res.send({ status: -1, msg: '删除失败, 请重新尝试！' });
    })
})

// 添加产品
router.post('/manage/product/add', (req, res) => {
  const product = req.body;
  ProductModel.create(product)
    .then(product => {
      res.send({ status: 0, data: product });
    })
    .catch(error => {
      console.error('添加产品异常', error);
      res.send({status: -1, msg: '添加产品异常, 请重新尝试'});
    })
})

// 更新产品
router.post('/manage/product/update', (req, res) => {
  const product = req.body;
  ProductModel.findOneAndUpdate({ _id: product._id }, product)
    .then(oldProduct => {
      res.send({ status: 0, msg: '更新商品成功' });
    })
    .catch(error => {
      console.error('更新商品异常', error);
      res.send({ status: 1, msg: '更新商品异常, 请重新尝试' });
    })
})

router.post('/manage/product/delete', (req, res) => {
  const { id } = req.body;
  ProductModel.deleteOne({ _id: id })
    .then(product => {
      res.send({ status: 0, msg: '删除成功！' });
    })
    .catch(error => {
      console.error('删除失败！', error);
      res.send({ status: -1, msg: '删除失败, 请重新尝试！' });
    })
})

// 获取产品分页列表
router.get('/manage/product/list', (req, res) => {
  const { pageNum, pageSize } = req.query;
  ProductModel.find({})
    .then(products => {
      res.send({ status: 0, data: pageFilter(products, pageNum, pageSize) });
    })
    .catch(error => {
      console.error('获取商品列表异常', error);
      res.send({ status: -1, msg: '获取商品列表异常, 请重新尝试' });
    })
})

// 获取所有产品列表
router.get('/customer/product/all', (req, res) => {
  ProductModel.find({})
    .then(products => {
      res.send({ status: 0, data: { products } });
    })
    .catch(error => {
      console.error('获取商品列表异常', error);
      res.send({ status: -1, msg: '获取商品列表异常, 请重新尝试' });
    })
})

// 搜索指定商品
router.get('/customer/goods/search', (req, res) => {
  const { searchContent } = req.query;
  let data = [];
  try {
    FlowerModel.find({ flowername: new RegExp(`^.*${ searchContent }.*$`) })
    .then((flowers) => {
      data = [...data, ...flowers];
    })
    .then(() => {
      ProductModel.find({ productname: new RegExp(`^.*${ searchContent }.*$`) })
        .then((products) => {
          data = [...data, ...products];
          res.send({ status: 0, data });
        })
    }) 
  } catch(error) {
    console.error('搜索商品列表异常', error);
    res.send({ status: -1, msg: '搜索商品列表异常, 请重新尝试' });
  }
  
})

// 获取管理商家信息
router.get('/manage/factory', (req, res) => {
  const { belongTo } = req.query;
  FactoryModel.findOne({ factory_name: belongTo })
    .then(factory => {
      res.send({ status: 0, data: { factory } });
    })
    .catch(error => {
      console.error('获取商家信息异常', error);
      res.send({ status: -1, msg: '获取商家信息异常, 请重新尝试' });
    })
})

// 获取指定商家信息
router.get('/customer/factory', (req, res) => {
  FactoryModel.findOne({ factory_name: 'flower' })
    .then(factory => {
      res.send({ status: 0, data: { factory } });
    })
    .catch(error => {
      console.error('获取商家信息异常', error);
      res.send({ status: -1, msg: '获取商家信息异常, 请重新尝试' });
    })
})

// 搜索产品列表
router.get('/manage/product/search', (req, res) => {
  const { pageNum, pageSize, productName, productDesc } = req.query;
  // console.log(req.query);
  let contition = {};
  if (productName) {
    contition = { productname: new RegExp(`^.*${productName}.*$`) };
  } else if (productDesc) {
    contition = { desc: new RegExp(`^.*${productDesc}.*$`) }; 
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)});
    })
    .catch(error => {
      console.error('搜索商品列表异常', error);
      res.send({status: -1, msg: '搜索商品列表异常, 请重新尝试'});
    })
})

// 更新产品状态(上架/下架)
router.post('/manage/product/updateStatus', (req, res) => {
  const { productId, status } = req.body
  ProductModel.findOneAndUpdate({ _id: productId }, { status })
    .then(oldProduct => {
      res.send({ status: 0, msg: '更新状态成功' })
    })
    .catch(error => {
      console.error('更新产品状态异常', error)
      res.send({ status: -1, msg: '更新产品状态异常, 请重新尝试' })
    })
})

// 得到指定数组的分页信息对象
function pageFilter(arr, pageNum, pageSize) {
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = arr.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = start + pageSize <= total ? start + pageSize : total
  const list = []
  for (var i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  }
}

// 获取订单列表
router.get('/manage/orders/list', (req, res) => {
  OrderModel.find({})
    .then(orders => {
      res.send({ status: 0, data: { orders } });
    })
    .catch(error => {
      console.error('获取订单列表异常', error);
      res.send({ status: -1, msg: '获取订单列表异常, 请重新尝试' });
    })
})

// 获取我的订单列表
router.get('/customer/orders/list', (req, res) => {
  const { order_name } = req.query;
  OrderModel.find({ order_name })
    .then((orders) => {
      res.send({ status: 0, data: { orders } });
    })
    .catch(error => {
      console.error('获取订单列表异常', error);
      res.send({ status: -1, msg: '获取订单列表异常, 请重新尝试' });
    })
});

// 搜索订单列表
router.get('/manage/orders/search', (req, res) => {
  const { searchName } = req.query;
  let contition = {};
  if (searchName) {
    contition = { order_name: new RegExp(`^.*${ searchName }.*$`) };
  }
  OrderModel.find(contition)
    .then(orders => {
      res.send({ status: 0, data: { orders } });
    })
    .catch(error => {
      console.error('搜索订单列表异常', error);
      res.send({ status: -1, msg: '搜索订单列表异常, 请重新尝试' });
    })
})

// 提交订单
router.post('/customer/orders/submit', (req, res) => {
  const order = req.body;
  OrderModel.create({ ...order })
  .then(order => {
    res.send({ status: 0, msg: '订单成功' });
  })
  .catch(error => {
    console.error('订单异常', error);
    res.send({ status: -1, msg: '订单异常, 请重新尝试' });
  })
});

// 获取评论列表
router.get('/manage/comments/list', (req, res) => {
  CommentModel.find({})
    .then(comments => {
      res.send({ status: 0, data: { comments } });
    })
    .catch(error => {
      console.error('获取评论列表异常', error);
      res.send({ status: -1, msg: '获取评论列表异常, 请重新尝试' });
    })
})

// 获取我的评论列表
router.get('/customer/comments/list', (req, res) => {
  const { comment_name } = req.query;
  CommentModel.find({ comment_name })
    .then((comments) => {
      res.send({ status: 0, data: { comments } });
    })
    .catch(error => {
      console.error('获取评论列表异常', error);
      res.send({ status: -1, msg: '获取评论列表异常, 请重新尝试' });
    })
});

// 获取单个商品评论
router.get('/customer/comments/singleList', (req, res) => {
  const { goods_name } = req.query;
  CommentModel.find({ goods_name })
    .then((comments) => {
      res.send({ status: 0, data: { comments } });
    })
    .catch(error => {
      console.error('获取评论列表异常', error);
      res.send({ status: -1, msg: '获取评论列表异常, 请重新尝试' });
    })
})

// 添加评论
router.post('/customer/comments/add', (req, res) => {
  const comment = req.body;
  console.log(comment);
  CommentModel.create(comment)
    .then(comment => {
      res.send({ status: 0, msg: '评论成功' });
    })
    .catch(error => {
      console.error('添加评论异常', error);
      res.send({status: -1, msg: '添加评论异常, 请重新尝试'});
    })
})

// 删除评论
router.post('/manage/comments/delete', (req, res) => {
  const { comment_name, create_time } = req.body;
  CommentModel.deleteOne({ comment_name, create_time })
    .then(comment => {
      res.send({ status: 0, msg: '删除成功' });
    })
    .catch(error => {
      console.error('删除失败！', error);
      res.send({ status: -1, msg: '删除失败, 请重新尝试！' });
    })
})

// 搜索评论列表
router.get('/manage/comments/search', (req, res) => {
  const { commentName, productName } = req.query;
  // console.log(req.query);
  let contition = {};
  if (commentName) {
    contition = { comment_name: new RegExp(`^.*${ commentName }.*$`) };
  } else if (productName) {
    contition = { goods_name: new RegExp(`^.*${ productName }.*$`) }; 
  }
  CommentModel.find(contition)
    .then(comments => {
      res.send({ status: 0, data: { comments } });
    })
    .catch(error => {
      console.error('搜索评论列表异常', error);
      res.send({ status: -1, msg: '搜索评论列表异常, 请重新尝试' });
    })
})

module.exports = router;
