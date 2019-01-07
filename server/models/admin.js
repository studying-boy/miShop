/**
 * Created by Administrator on 2018/4/25.
 */
"use strict"
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let adminSchema = new Schema({
    personalInfo:{
        "adminName": String,
        "password": String,
    }
},{versionKey:false})   //取消数据库中__v的版本字段

module.exports = mongoose.model('Admin',adminSchema);



