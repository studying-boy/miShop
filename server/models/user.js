/**
 * Created by Administrator on 2018/4/25.
 */
"use strict"
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    personalInfo:{
        "userName": String,
        "password": String,
        "phone": Number,
        "name": {
            type:String,
            default:""
        },
        "sex":{
            type:String,
            default:""
        },
        "age": {
            type:String,
            default:""
        },
    },
    cartList:[{
        "good_id":String,
        "count":Number,
        "checked":Boolean
    }],
    addressList:[{
        "id":String,
        "name":String,
        "tel":String,
        "province":String,
        "city":String,
        "county":String,
        "address_detail":String,
        "postal_code":String,
        "is_default":Boolean
    }],
    orderList:[{
        /*"goods":[{
            "_id":String,
            "name":String,
            "image":String,
            "count":Number
        }],
        "totalPrice":Number,
        "address":Object,
        "status":{
            type:Number,
            default:0
        }*/
        order_id:String
    }]
},{versionKey:false})   //取消数据库中__v的版本字段

module.exports = mongoose.model('User',userSchema);



