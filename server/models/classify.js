/**
 * Created by Administrator on 2018/4/26.
 */
"use strict"
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let classifySchema = new Schema({
    "all":[
        {
            "classify_id":String,
            "name": String,
            "children":Array
        }
    ]
},{versionKey:false})  //取消数据库中__v的版本字段

module.exports = mongoose.model('Classify',classifySchema,"classifys");


