<template>
    <div class="orderInfo">
        <v-subpage title="订单详情">
            <div slot="content" class="content">

                <!--订单状态-->
                <span>状态：
                    <span class="status" v-if="order.status==0">待付款</span>
                    <span class="status" v-else-if="order.status==1">待发货</span>
                    <span class="status" v-else-if="order.status==2">待收货</span>
                    <span class="status" v-else-if="order.status==3">已完成</span>
                </span>

                <!--商品列表-->
                <div class="goodList">
                    <ul>
                        <li v-for="(good,index) in order.goods" class="good-item" :key="index">
                            <div class="good-left">
                                <img :src="good.image" :title="good.name">
                            </div>
                            <div class="good-right">
                                <a class="title">{{good.name}}</a>
                                <p class="info">
                                    <span class="text">数量:{{good.count}}件</span>
                                    <span class="text">{{good.price}}</span>
                                </p>
                            </div>
                        </li>
                    </ul>
                </div>

                <!--订单细节-->
                <div class="orderDetail">
                    <p>订单编号：{{order.order_id}}</p>
                    <p>下单时间：{{order.create_at}}</p>
                </div>

                <!--收货信息-->
                <div class="addressInfo">
                    <div class="header">
                        <p>收货人：{{order.address.name}}</p>
                        <p>电话：{{order.address.tel}}</p>
                    </div>
                    <div class="main">{{order.address.province}}{{order.address.city}}{{order.address.county}}{{order.address.address_detail}}</div>
                </div>

                <!--总金额-->
                <div class="totalPrice">
                    总金额：{{order.totalPrice}}
                </div>

                <!--操作-->
                <div class="operate" v-if="order.status === 2">
                    <el-button type="warning" round @click="getGood">确认收货</el-button>
                </div>

                <div class="operate" v-if="order.status === 0">
                    <el-button type="warning" round @click="pay">去付款</el-button>
                </div>
            </div>
        </v-subpage>
        <vue-pay-keyboard
            ref="pay"
            :is-pay='isPay'
            @pas-end='pasEnd'
            @close='payExit'>
            <!-- 自定义支付动画 -->
            <div slot="loading-ani">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="64" height="64" fill="#FF9920">
                    <circle cx="16" cy="3" r="0">
                        <animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
                    </circle>
                    <circle transform="rotate(45 16 16)" cx="16" cy="3" r="0">
                        <animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.125s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
                    </circle>
                    <circle transform="rotate(90 16 16)" cx="16" cy="3" r="0">
                        <animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.25s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
                    </circle>
                    <circle transform="rotate(135 16 16)" cx="16" cy="3" r="0">
                        <animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.375s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
                    </circle>
                    <circle transform="rotate(180 16 16)" cx="16" cy="3" r="0">
                        <animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
                    </circle>
                    <circle transform="rotate(225 16 16)" cx="16" cy="3" r="0">
                        <animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.625s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
                    </circle>
                    <circle transform="rotate(270 16 16)" cx="16" cy="3" r="0">
                        <animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.75s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
                    </circle>
                    <circle transform="rotate(315 16 16)" cx="16" cy="3" r="0">
                        <animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.875s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
                    </circle>
                    <circle transform="rotate(180 16 16)" cx="16" cy="3" r="0">
                        <animate attributeName="r" values="0;3;0;0" dur="1s" repeatCount="indefinite" begin="0.5s" keySplines="0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8;0.2 0.2 0.4 0.8" calcMode="spline" />
                    </circle>
                </svg>
            </div>
        </vue-pay-keyboard>
    </div>
</template>

<script>
    import subpage from '@/components/subpage/subpage.vue';

    export default{
        data(){
            return {
                order : {},
                isPay:false,
            }
        },
        components:{
            "v-subpage":subpage
        },
        mounted(){
            let that = this;
            let order_id = this.$route.query.id;
            this.$http.get("/api/client/orderInfo",{
                params:{
                    order_id: order_id
                }
            }).then((response)=>{
                let res = response.data;
                if(res.status === "0"){
                    that.order = res.result;
                }
            })
        },
        methods:{
            /*确认收货*/
            getGood(){
                let that = this;
                this.$confirm('确定收到货了吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.$http.post("/api/client/completeOrder",{
                        order_id:that.order.order_id
                    }).then((response)=>{
                        let res = response.data;
                        if(res.status === "0"){
                            alert("success");
                            that.$router.push("/client/personalPage/order");
                        }
                    })
                })
            },
            /*去付款*/
            pay(){
                let that = this;
                that.isPay = true;
            },
            pasEnd(val) {
                let that = this;
                setTimeout(() => { // 模拟请求接口验证密码中 ..
                    if (val === '666666') { // 密码正确
                        this.$refs.pay.$payStatus(true) // 拿到子组件的事件
                        that.$http.post("/api/client/payFinsh",{
                            order_id:that.order.order_id
                        })
                        that.$emit("fresh");
                        that.$router.push("/client/personalPage/order");
                    } else {
                        this.$refs.pay.$payStatus(false)
                    }
                }, 2000)
            },                 //输入结束
            payExit(){
                let that = this;
                this.$confirm('你确定要离开支付吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    that.isPay = false;
                }).catch(() => {

                });
            }                      //取消输入支付密码
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .orderInfo{
        .content{
            position: absolute;
            top:50px;
            bottom: 0;
            width: 100%;
            height: auto;
            overflow-y: scroll;
            padding:10px 20px;
            box-sizing: border-box;
            .goodList{
                border:1px solid #ccc;
                margin-top: 10px;
                .good-item {
                    display: flex;
                    padding:10px 0 10px 10px;
                    .good-left{
                        float:left;
                        margin-right: 10px;
                        img {
                            display: inline-block;
                            width: 50px;
                            height: 50px;
                            vertical-align: top;
                        }
                    }
                    .good-right{
                        flex: 1;
                        float: left;
                        padding-top:5px;
                        .title {
                            display: inline-block;
                            margin-bottom: 10px;
                            text-decoration: none;
                        }
                        .info{
                            font-size: 0;
                            vertical-align: middle;
                            .text{
                                display: inline-block;
                                vertical-align: middle;
                                font-size: 12px;
                                margin-right: 10px;
                            }
                        }
                    }
                }
            }
            .orderDetail{
                margin-top: 10px;
                padding:10px;
                border:1px solid #ccc;
                p{
                    margin: 5px 0;
                }
            }
            .addressInfo{
                margin-top: 10px;
                padding:10px 10px;
                border:1px solid #ccc;
                .header{
                    p{
                        margin: 5px 0;
                    }
                }
                .main{
                    margin-bottom: 5px;
                }
            }
            .totalPrice{
                margin-top: 10px;
                padding-right: 20px;
                text-align: right;
                color: red;
                font-size: 20px;
                font-weight: bold;
            }
            .operate{
                margin-top: 10px;
                padding-right: 20px;
                button{
                    float: right;
                }
            }
        }

    }
    .el-message-box{
        width:80%;
        margin: 0 auto;
    }
</style>
