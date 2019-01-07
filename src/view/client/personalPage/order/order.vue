<template>
    <div class="wrapper">
        <el-container>
            <el-header>
                <i class="el-icon-arrow-left" @click="lastStep"></i>
                <span class="title">我的订单</span>
            </el-header>
            <van-tabs v-model="tabIndex">
                <van-tab title="全部" class="tab-item" id="tab1">
                    <ul class="orderList">
                        <li v-for="order in orderList" class="order-item" @click="jumpOrderInfo(order)">
                            <ul>
                                <li v-for="good in order.goods" class="good-item">{{good.name}}  {{good.count}}份</li>
                            </ul>
                            <span>总价格：<span class="totalPrice">{{order.totalPrice}}</span></span>
                            <span>状态：
                                <span class="status" v-if="order.status==0">待付款</span>
                                <span class="status" v-else-if="order.status==1">待发货</span>
                                <span class="status" v-else-if="order.status==2">待收货</span>
                                <span class="status" v-else-if="order.status==3">已完成</span>
                            </span>
                        </li>
                    </ul>
                </van-tab>
                <van-tab title="待付款" class="tab-item" id="tab2">
                    <ul class="orderList">
                        <li v-for="order in orderList" class="order-item" v-if="order.status === 0" @click="jumpOrderInfo(order)">
                            <ul>
                                <li v-for="good in order.goods" class="good-item">{{good.name}}  {{good.count}}份</li>
                            </ul>
                            <span>总价格：<span class="totalPrice">{{order.totalPrice}}</span></span>
                        </li>
                    </ul>
                </van-tab>
                <van-tab title="待收货" class="tab-item" id="tab3">
                    <ul class="orderList">
                        <li v-for="order in orderList" class="order-item" v-if="order.status === 1" @click="jumpOrderInfo(order)">
                            <ul>
                                <li v-for="good in order.goods" class="good-item">{{good.name}}  {{good.count}}份</li>
                            </ul>
                            <span>总价格：<span class="totalPrice">{{order.totalPrice}}</span></span>
                        </li>
                    </ul>
                </van-tab>
                <van-tab title="已完成" class="tab-item" id="tab4">
                    <ul class="orderList">
                        <li v-for="order in orderList" class="order-item" v-if="order.status === 3" @click="jumpOrderInfo(order)">
                            <ul>
                                <li v-for="good in order.goods" class="good-item">{{good.name}}  {{good.count}}份</li>
                            </ul>
                            <span>总价格：<span class="totalPrice">{{order.totalPrice}}</span></span>
                        </li>
                    </ul>
                </van-tab>
            </van-tabs>
        </el-container>
        <router-view @fresh="init"></router-view>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                orderList:[],
                tabIndex:"0"
            }
        },
        mounted(){
            this.tabIndex = this.$route.query.tab;
            this.init();
        },
        methods:{
            lastStep(){
                this.$router.push("/client/personalPage");
            },
            init(){
                let that = this;
                this.$http.get("/api/client/allOrder").then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.orderList = res.result;
                        console.log(that.orderList);
                        that.orderList.sort(that.compare("create_at"));
                        console.log(that.orderList);
                    }
                })
            },
            jumpOrderInfo(order){
                let id = order.order_id;
                this.$router.push({
                    path:'/client/personalPage/order/orderInfo?id=' + id
                });
            },
            /*给订单按照时间顺序排序*/
            compare(property){
                return function(obj1,obj2){
                    var value1 = obj1[property];
                    var value2 = obj2[property];
                    if(property == "create_at"){
                        value1 = new Date(value1);
                        value2 = new Date(value2);
                    }
                    return value2 - value1;     // 降序
                }
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .wrapper{
        position: fixed;
        top:0;
        left:0;
        width:100%;
        min-height:100%;
        background: #fff;
        z-index: 100;
        .el-container {
            .el-header {
                height: 40px !important;
                line-height: 40px;
                text-align: center;
                background: #fff;
                border-bottom: 1px solid rgba(7,17,27,0.1);
                .el-icon-arrow-left {
                    line-height: 40px;
                    float: left;
                }
                .text {
                    float: right;
                    font-size: 12px;
                }
            }
            .tab-item{
                .orderList{
                    position: absolute;
                    left:0;
                    width: calc(100% + 30px);
                    height:600px;
                    box-sizing: border-box;
                    padding: 20px 40px 20px 20px;
                    overflow-y: scroll;
                    .order-item{
                        padding:10px;
                        margin-bottom: 10px;
                        border:1px dashed #ccc;
                        .good-item{
                            margin-bottom: 2px;
                        }
                        span{
                            display: inline-block;
                            .totalPrice, .status{
                                color: red;
                                background: #fff;
                            }
                        }
                    }
                }
            }

        }
    }
</style>
