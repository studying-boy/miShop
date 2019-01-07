(function(){
    "use strict"
    var express = require('express');
    var router = express.Router();
    var mongoose = require("mongoose");
    var async = require("async");
    var fs = require("fs");
    var formidable = require("formidable");          //文件上传
    var moment = require("../public/javascripts/moment");
    var crypto = require("crypto");               //加密模块
    var Good = require("../models/good.js");
    var User = require("../models/user.js");
    var Classify = require("../models/classify");
    var Order = require("../models/order");
    var Admin = require("../models/admin");

    //连接MongoDB数据库
    mongoose.connect('mongodb://127.0.0.1:27017/miShop');

    mongoose.connection.on("connected",()=>{
        console.log("-------------数据库连接成功------------");
    });

    mongoose.connection.on("error",()=>{
        console.log("-------------数据库连接失败------------");
    });

    mongoose.connection.on("disconnected",()=>{
        console.log("-------------数据库断开连接------------");
    });

    /*---------------------------前台页面---------------------------*/
    //主页
    router.get('/', (req, res, next) => {
      res.render('index', { title: 'Express' });
    });

    //搜索功能
    router.get("/client/search",(req, res, next) => {
        let text = req.query.text;
        let reg = new RegExp(text, "i");
        Good.find({$or:[
            {name:{$regex:reg}}
        ]},(err, data)=>{
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                console.log(data);
                if(!data || data != ""){
                    res.send({
                        status:"0",
                        mas:"",
                        result:data
                    })
                }else{
                    res.send({
                        status:"2",
                        mas:"找不到相关数据"
                    })
                }
            }
        })
        console.log(text);
    })

    //获取推荐商品
    router.get('/client/getRecommend',(req, res, next) => {
        let limit = req.query.limit;
        let number = req.query.count;
        Good.find({},null,{skip:parseInt(number),limit:parseInt(limit)},(err, data)=>{
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                if(data != ""){
                    res.send({
                        status:"0",
                        msg:"",
                        result:data
                    })
                }
                else{
                    res.send({
                        status:"00",
                        msg:""
                    })
                }
            }
        })
    })

    //商品页面
    router.get('/client/goods', (req, res, next) => {
        let goodsList = [];
        Classify.find({},function(err, classifyDoc){
            if(err){
                res.json({
                    status:'1',
                    msg:err.message
                })
            }else {
                let classifyList = classifyDoc[0].all;
                //res.send(Object.getOwnPropertyNames(goodsList).length);
                async.mapSeries(classifyList, function (item, cb) {
                    let classify_id = mongoose.Types.ObjectId(item._id);
                    Good.find({"classify_id":classify_id},function(err,doc){
                        item.children = doc;
                        cb(null, item)
                    })
                },function (err, results) {
                    res.send({
                        status:"0",
                        mes:"",
                        result:results
                    });
                })
            }
        })
    });

    //获取商品具体信息
    router.get('/client/goodInfo', (req, res, next) => {
        var goodId = mongoose.Types.ObjectId(req.query.good_id);
        Good.find({"_id":goodId},function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                res.send({
                    status:"0",
                    msg:"",
                    result:data
                })
            }
        })
    });

    //用户页面
    router.get('/client/users', (req, res, next) => {
        User.find({},(err,doc)=>{
            if(err){
                res.json({
                    status:'1',
                    msg:err.message
                })
            }else{
                res.json({
                    status:'0',
                    msg:'',
                    result:{
                        count:doc.length,
                        list:doc
                    }
                })
            }
        })
    });

    //用户注册
    router.post("/client/register",(req, res, next) => {
        let md5 = crypto.createHash("md5");
        let newPas = md5.update(req.body.password).digest("hex");
        let newUser = {
            personalInfo:{
                userName: req.body.userName,
                password: newPas,
                phone: req.body.phone
            }
        }
        //查找用户名是否已经存在
        User.findOne({
            "personalInfo.userName":req.body.userName,
        },function (err,data) {
            if(err){
                console.log(err);
            }
            if(data){
                res.send({
                    status:1,
                    msg:"该用户已注册！"
                });
            }else{
                //创建用户并存进mongo
                User.create(newUser, (err,data)=>{
                    if(err){
                        console.log(err);
                    }
                    res.send({
                        status:0,
                        msg:"注册成功"
                    });
                })
            }
        })
    })

    //判断用户是否已经注册
    router.post("/client/checkUser",(req, res, next) => {
        let userName = req.body.userName;
        User.findOne({"personalInfo.userName":userName},function (err, data) {
            if(err){
                res.send({
                    status:10,
                    msg:err.message
                })
            }else {
                if(!data){
                    res.send({
                        status:"0",
                        msg:""
                    })
                }else{
                    res.send({
                        status:"1",
                        msg:"该用户已注册"
                    })
                }
            }
        })
    })

    //用户登录
    router.post("/client/login",(req, res, next) => {
        let md5 = crypto.createHash("md5");
        let newPas = md5.update(req.body.password).digest("hex");
        User.findOne({
            "personalInfo.userName":req.body.userName,
            "personalInfo.password":newPas
        },function (err, data) {
            if(err){
                res.send({
                    status:2,
                    msg:"登录失败！"
                })
            }else{
                if(data){
                    res.cookie("userId",data._id,{        //设置cookie
                        path:'/',
                        maxAge: 1000 * 60 * 60 * 24
                    });
                    req.session.userName = data.personalInfo.userName;             //设置session
                    req.session.userId = data._id;
                    res.send({
                        status:0,
                        msg:"登陆成功",
                        result: data.personalInfo
                    })
                }else{
                    res.send({
                        status:1,
                        msg:"账号或密码错误!"
                    })
                }
            }
        })
    });

    //加入购物车
    router.post("/client/addCart",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId)
        let id = req.body.id;
        User.findOne({
            "_id":userId
        },(err, userDoc)=>{
            if(err){
                console.log(err);
            }else{
                if(userDoc){
                    let goodItem = "";
                    userDoc.cartList.forEach(function (item) {
                        if(item.good_id === id){
                            goodItem = item;
                            item.count++;
                        }
                    })
                    if(goodItem){              //购物车中有此商品
                        userDoc.save();
                        res.send({
                            status:"01",
                            msg:"数量加1"
                        })
                    }else{
                        //购物车中没有此商品
                        userDoc.cartList.push({"good_id":id,"count":1,"checked":true});
                        userDoc.save();
                        res.send({
                            status:"0",
                            msg:"添加数据"
                        });
                    }
                }
            }
        })
    })

    //获取购物车列表
    router.get("/client/cart",(req, res, next) => {
        let id = req.cookies.userId;
        let goodsList = [];
        User.findById(id,(err, userDoc) => {
            goodsList = userDoc.cartList;
            async.mapSeries(goodsList, function (good, cb) {
                let good_id = good.good_id;
                let count = good.count;
                let checked = good.checked;
                Good.findById(good_id, function (err, data) {
                    /*注意：这里购物车没有检测商品已经下架的情况，会出错！！！！*/
                    if(data === null){
                        cb();
                    }else{
                        data.count = count;
                        data.checked = checked;
                        cb(null, data);
                    }
                })
            },function (err, results) {
                console.log(results);
                res.send({
                    status:"0",
                    msg:"",
                    result:results
                })
            });
        })
    })

    //删除购物车商品
    router.post("/client/deleteCart",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);    //将String类型转化成ObjectId类型
        let goodId = req.body.good_id;
        console.log(userId + " " + goodId + " " + typeof(userId));
        User.update({"_id":userId},{$pull:{"cartList":{'good_id':goodId}}},function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                res.send({
                    status: "0",
                    msg: ""
                })
            }
        })
    });

    //修改购物车商品数量
    router.post("/client/cart_editNum",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        let goodId = req.body.good_id;
        let count = req.body.count;
        User.update({"_id":userId,"cartList.good_id":goodId},{         //修改子文档，因为修改子文档，所以查询条件要写两个文档
            "cartList.$.count" : count                                 //$是占位符
        },function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                res.send({
                    status: "0",
                    msg: ""
                })
            }
        })
    })

    //修改购物车商品状态
    router.post("/client/cart_editCheck",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        let goodId = req.body.good_id;
        let check = req.body.check;
        User.update({"_id":userId,"cartList.good_id":goodId},{         //修改子文档，因为修改子文档，所以查询条件要写两个文档
            "cartList.$.checked" : check                                 //$是占位符
        },function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                res.send({
                    status: "0",
                    msg: ""
                })
            }
        })
    })

    //修改购物车全选
    router.post("/client/cart_editCheckAll",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        let check = req.body.check;
        User.findOne({"_id":userId},function (err, userDoc) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                if(userDoc){
                    userDoc.cartList.forEach((item)=>{
                        item.checked = check;
                    })
                    userDoc.save(function (err, doc) {
                        if(err){
                            res.send({
                                status:"1",
                                msg:"err.message",
                            })
                        }else{
                            res.send({
                                status: "0",
                                msg: ""
                            })
                        }
                    });
                }
            }
        })
    })

    //生成订单
    router.post("/client/submitOrder",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        let address = req.body.address;
        let totalPrice = req.body.totalPrice;
        let timeStamp = new Date().getTime() + Math.floor(Math.random() * 10000);
        let goods = req.body.goods;
        let goodsList = [];
        let flag = true; /*判断所有商品的数量都是否大于库存数量*/

        /*先将需要存进数据库的商品信息保存起来*/
        goods.forEach(function (item) {
            goodsList.push({
                "name": item.name,
                "count":item.count,
                "image":item.image,
                "price":item.price
            })
        })

        /*判断数据库的库存是否满足所有的商品需求*/
        let q = new Promise(function(resolve,reject){
            async.eachSeries(goods,function (item, callback) {
                let goodId = mongoose.Types.ObjectId(item._id);
                /*判断库存数量是否大于要购买的数量*/
                Good.findOne({"_id":goodId},(err, data)=>{
                    if(err){
                        res.send({
                            status:"1",
                            msg:err.message
                        })
                    }else{
                        console.log(data.number +  " " + item.count);
                        console.log(data.number >= item.count);
                        if(data.number >= item.count){
                            callback();
                        }else{
                            console.log("flag=false");
                            flag = false;
                            callback(err);
                        }
                    }
                })
            },function (err) {
                console.log("total");
                if(flag){
                    resolve();
                }else{
                    reject();
                }
            })
        })


        q.then(function(){
            /*修改库存*/
            goods.forEach(function (item) {
                let goodId = mongoose.Types.ObjectId(item._id);
                Good.update({"_id":goodId},{$inc:{"number":-item.count}},(err, data)=>{
                    if(err){
                        res.send({
                            status:"1",
                            msg:err.message
                        })
                    }else{
                        /*将商品从购物车中删除*/
                        User.update({"_id":userId},{$pull:{"cartList":{"good_id":goodId}}},(err, data)=>{
                            if(err){
                                res.send({
                                    status:"1",
                                    msg:err.message
                                })
                            }
                        });
                        /*goodsList.push({
                            "name": item.name,
                            "count":item.count,
                            "image":item.image,
                            "price":item.price
                        })*/
                    }
                })
            })

            console.log(goodsList);
            let newOrder = {
                order_id:timeStamp,
                status:0,
                goods:goodsList,
                address:address,
                totalPrice:totalPrice,
                userId:req.cookies.userId,
                create_at:moment().format('YYYY-MM-DD HH:mm:ss')
            }
            Order.create(newOrder,(err)=>{             //创建订单
                if(err){
                    console.log(err);
                }
                User.findOne({
                    "_id":userId
                },(err, userDoc)=>{
                    if(err){
                        console.log(err);
                    }else{
                        userDoc.orderList.push({order_id:timeStamp});
                        userDoc.save(function (err, data) {
                            if(err){
                                res.send({
                                    status:"1",
                                    msg:"err.message",
                                })
                            }else{
                                res.send({
                                    status: "0",
                                    msg: "订单添加成功",
                                    result:timeStamp
                                })
                            }
                        });
                    }
                })
            })
        },function () {
            console.log("status:2");
            res.send({
                status:"2",
                msg:"创建订单失败，库存不足"
            })
        })
    })

    //退出支付
    router.post("/client/payExit",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        let order_id = req.body.order_id;
        Order.update({"order_id":order_id},{         //修改子文档，因为修改子文档，所以查询条件要写两个文档
            "status" : 0                                 //$是占位符
        },function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                res.send({
                    status: "0",
                    msg: ""
                })
            }
        })
    })

    //完成支付
    router.post("/client/payFinsh",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        let order_id = req.body.order_id;
        Order.update({"order_id":order_id},{         //修改子文档，因为修改子文档，所以查询条件要写两个文档
            "status" : 1                                 //$是占位符
        },function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                res.send({
                    status: "0",
                    msg: ""
                })
            }
        })
    })

    //获取用户个人信息
    router.get("/client/personalInfo",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        User.findOne({"_id":userId},function (err, userDoc) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                res.send({
                    status:"0",
                    msg:"",
                    result:userDoc.personalInfo
                })
            }
        })
    })

    //获取用户收货地址
    router.get("/client/address",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        User.findOne({"_id":userId},function (err, userDoc) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                res.send({
                    status:"0",
                    msg:"",
                    result:userDoc.addressList
                })
            }
        })
    })

    //编辑用户地址
    router.post("/client/editAddress",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        let content = req.body.content;
        User.findOne({"_id":userId},function (err, userDoc) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                userDoc.addressList.push({
                    "id": content.id,
                    "name": content.name,
                    "tel": content.tel,
                    "province": content.province,
                    "city": content.city,
                    "county": content.county,
                    "address_detail": content.address_detail,
                    "postal_code": content.postal_code,
                    "is_default": content.is_default
                });
                userDoc.save(function (err, data) {
                    if(err){
                        res.send({
                            status:"1",
                            msg:"err.message",
                        })
                    }else{
                        res.send({
                            status:"0",
                            msg:"",
                        })
                    }
                })
            }
        })
    })

    //删除用户地址
    router.post("/client/deleteAddress",(req, res, next) => {
        let userId = mongoose.Types.ObjectId(req.cookies.userId);
        let addressId = mongoose.Types.ObjectId(req.body.address_id);
        User.update({"_id":userId},{$pull:{"addressList":{"_id":addressId}}},function (err,data) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                console.log(addressId);
                res.send({
                    status:"0",
                    msg:"",
                })
            }
        })
    })

    //获取用户所有订单
    router.get("/client/allOrder",(req, res, next) => {
        let userId = req.cookies.userId;
        console.log(userId);
        Order.find({"userId":userId},function (err, orderDoc) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                console.log(orderDoc);
                res.send({
                    status:"0",
                    msg:"",
                    result:orderDoc
                })
            }
        })
    })

    //获取订单具体信息
    router.get("/client/orderInfo",(req, res, next) => {
        let orderId = req.query.order_id;
        console.log(orderId);
        Order.findOne({"order_id":orderId},function (err, orderDoc) {
            if(err){
                res.send({
                    status:"1",
                    msg:"err.message",
                })
            }else{
                res.send({
                    status:"0",
                    msg:"",
                    result:orderDoc
                })
            }
        })
    })

    //确认收货
    router.post("/client/completeOrder",(req, res, next) => {
        let order_id = req.body.order_id;
        Order.update({"order_id":order_id},{"status":3},(err,data)=>{
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:"订单已完成"
                })
            }
        })
    })



    /*---------------------------后台管理---------------------------*/
    //用户登录
    router.post("/management/login",(req, res, next) => {
        let md5 = crypto.createHash("md5");
        let newPas = md5.update(req.body.password).digest("hex");
        Admin.findOne({
            "adminName":req.body.userName,
            "password":newPas
        },function (err, data) {
            if(err){
                res.send({
                    status:2,
                    msg:"登录失败！"
                })
            }else{
                if(data){
                    res.cookie("userId",data._id,{        //设置cookie
                        path:'/',
                        maxAge: 1000 * 60 * 60 * 24
                    });
                    req.session.adminName = data.personalInfo.userName;             //设置session
                    req.session.adminId = data._id;
                    res.send({
                        status:0,
                        msg:"登陆成功",
                        result: data.personalInfo
                    })
                }else{
                    res.send({
                        status:1,
                        msg:"账号或密码错误!"
                    })
                }
            }
        })
    });

    //获取用户列表
    router.get("/management/getUserList", (req, res, next) => {
        User.find({},(err, data)=>{
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:"",
                    result:data
                })
            }
        })
    });

    //获取商品列表
    router.get("/management/getGoodList", (req, res, next) => {
        Good.find({},(err, data)=>{
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:"",
                    result:data
                })
            }
        })
    });

    //保存商品
    router.post("/management/saveGood", (req, res, next) => {
        let goodId = mongoose.Types.ObjectId(req.body.id);
        let obj = req.body.obj;
        Good.update({"_id":goodId},obj,function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:""
                })
            }
        })
    })

    //删除商品
    router.post("/management/delGood", (req, res, next) => {
        let goodId = mongoose.Types.ObjectId(req.body.id);
        Good.remove({"_id":goodId},function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:""
                })
            }
        })
    })

    //新增商品
    router.post("/management/createGood", (req, res, next) => {
        let newGood = req.body.newGood;
        console.log(newGood);
        /*let newGood = {
         "name": req.body.name,
         "price":req.body.price,
         "oldPrice":req.body.price,
         "description":req.body.description,
         "image":req.body.image,
         "classify_id":req.body.classify_id,
         "number":req.body.number,
         };*/
        Good.create(newGood, (err, data)=>{
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:"增添成功"
                })
            }
        })
    })

    //上传图片
    router.post("/management/uploadImg", (req, res, next) => {
        //创建上传表单
        let form = new formidable.IncomingForm();
        //设置编辑
        form.encoding = 'utf-8';
        //设置上传目录
        form.uploadDir = 'server/public/images/';
        //保留后缀
        form.keepExtensions = true;
        //文件大小
        form.maxFileSize = 2*1024*1024;
        //上传文件的入口文件
        form.parse(req, function (err, fields, files) {
            if (err) {
                res.send({
                    msg:11111111
                })
                return;
            }
            var extName = '';  //后缀名
            switch (files.file.type) {
                case 'image/pjpeg':
                    extName = 'jpg';
                    break;
                case 'image/jpeg':
                    extName = 'jpg';
                    break;
                case 'image/png':
                    extName = 'png';
                    break;
                case 'image/x-png':
                    extName = 'png';
                    break;
            }

            if(extName.length == 0) {
                res.send({
                    status:"1",
                    msg:"只支持png和jpg格式图片"
                })
                return;
            }else{
                //重新修改文件名字，使用随机数作为图片名字
                var avatarName = (new Date()).getTime() + '.' + extName;
                var newPath = form.uploadDir + avatarName;
                //得到上传后的图片相对路径
                console.log(newPath);
                fs.renameSync(files.file.path, newPath);  //重命名
                res.send({
                    status:"0",
                    msg:"上传成功",
                    result:newPath
                })
            }
        })
    })

    //获取商品分类
    router.get("/management/getClassify", (req, res, next) => {
        Classify.find({},(err,data)=>{
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                if(data){
                    res.send({
                        status:"0",
                        msg:"",
                        result:data[0].all
                    })
                }
            }
        })
    })

    //删除商品分类
    router.post("/management/delClassify", (req, res, next) => {
        let classifyId = mongoose.Types.ObjectId(req.body.id);
        Classify.update({},{$pull:{"all":{"_id":classifyId}}},function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:""
                })
            }
        })
    })

    //保存商品分类
    router.post("/management/saveClassify", (req, res, next) => {
        let classifyId = req.body.id;
        let classifyName = req.body.classifyName;
        Classify.update({"all._id":classifyId},{"all.$.name":classifyName},function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:""
                })
            }
        })
    })

    //新增商品分类
    router.post("/management/createClassify", (req, res, next) => {
        let classifyName = req.body.classifyName;
        Classify.find({},(err,classifyDoc)=>{
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                classifyDoc[0].all.push({"name":classifyName});
                classifyDoc[0].save();
                res.send({
                    status:"0",
                    msg:"添加成功"
                });
            }
        })
    })

    //获取订单列表
    router.get("/management/getOrderList", (req, res, next) => {
        /*Order.find({},(err, data) => {
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:"",
                    result:data
                })
            }
        })*/
        Order.find({}).sort({"create_at":-1}).exec((err, data) => {
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:"",
                    result:data
                })
            }
        })
    })

    //删除订单
    router.post("/management/delOrder", (req, res, next) => {
        let orderId = mongoose.Types.ObjectId(req.body.id);
        Order.remove({"_id":orderId},function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:""
                })
            }
        })
    })

    //保存商品状态
    router.post("/management/saveOrder", (req, res, next) => {
        let orderId = mongoose.Types.ObjectId(req.body.id);
        let status = req.body.status;
        Order.update({"_id":orderId},{"status":status},function (err, data) {
            if(err){
                res.send({
                    status:"1",
                    msg:err.message
                })
            }else{
                res.send({
                    status:"0",
                    msg:""
                })
            }
        })
    })



    module.exports = router;
})()

