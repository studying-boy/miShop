<template>
    <div class="checkout">
        <el-header>
            <i class="el-icon-arrow-left" @click="lastStep"></i>
            <span class="title">确认订单</span>
        </el-header>
        <div class="wrapper">
            <div class="box">
                <p>所选商品：</p>
                <ul>
                    <li v-for="good in selectGoods" class="good-item" v-if="good.number>0">
                        <div class="good-left">
                            <img :src="good.image" :title="good.name">
                        </div>
                        <div class="good-right">
                            <a href="##" class="title">{{good.name}}</a>
                            <p class="info">
                                <span class="text">数量:{{good.count}}</span>
                            </p>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="box" v-if="addressList.length>0">
                <p>选择地址：</p>
                <ul>
                    <li v-for="(address,index) in addressList" class="address-item" :class="{'active':addressIndex === index}" @click="selectAddress(index)">
                        <div class="header">
                            <span>{{address.name}}</span>
                            <span>{{address.tel}}</span>
                        </div>
                        <div class="main">{{address.province}}{{address.city}}{{address.county}}{{address.address_detail}}</div>
                    </li>
                </ul>
            </div>
            <div class="box">
                <el-button class="add" @click="addAddress">增添新地址</el-button>
            </div>
        </div>

        <div class="cart_footer">
            <span>
                {{totalPrice | currency("￥")}}
            </span>
            <span class="submitOrder" @click="pay">付款</span>
        </div>

        <!--支付密码-->
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
    import {currency} from '@/common/js/currency'    //价格过滤器
    export default{
        props:["selectGoods"],
        data(){
            return {
                addressList:[],
                addressIndex:0,
                isPay:false,
                order_id:""
            }
        },
        computed:{
            totalPrice(){
                let total = 0;
                this.selectGoods.forEach(function (item) {
                    total += item.price * item.count;
                })
                return total;
            }
        },
        filters:{
            currency:currency
        },
        mounted(){
            this.init();
            console.log(this.selectGoods);
        },
        methods:{
            init(){
                let that = this;
                this.$http.get("/api/client/address").then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.addressList = res.result;
                    }
                })
            },
            lastStep(){
                this.$router.go(-1);
            },
            selectAddress(index){
                this.addressIndex = index;
            },
            addAddress() {
                this.$router.push("/client/personalPage/editAddress");
            },
            pay(){
                /*判断是否填写了地址*/
                if(!this.addressList[this.addressIndex] || this.addressList[this.addressIndex] == ""){
                    alert("请填写地址");
                    return;
                }
                let that = this;
                this.$http.post("/api/client/submitOrder",{
                    goods:this.selectGoods,
                    totalPrice:this.totalPrice,
                    address:this.addressList[this.addressIndex]
                }).then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.order_id = res.result;
                        that.isPay = true;
                    }else if(res.status === "2"){
                        that.$message({
                            message:res.msg,
                            type:"error"
                        })
                    }
                })
            },
            pasEnd(val) {
                let that = this;
                setTimeout(() => { // 模拟请求接口验证密码中 ..
                    if (val === '666666') { // 密码正确
                        this.$refs.pay.$payStatus(true) // 拿到子组件的事件
                        that.$http.post("/api/client/payFinsh",{
                            order_id:that.order_id
                        })
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
                    that.$http.post("/api/client/payExit",{
                        order_id:that.order_id
                    }).then((response)=>{
                        let res = response.data;
                        if(res.status ==="0"){
                            that.$router.push("/client/personalPage/order");
                        }
                    });
                }).catch(() => {

                });
            }                      //取消输入支付密码
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .checkout {
        position: absolute;
        z-index: 100;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100%;
        overflow: hidden;
        background: #fff;
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
        .wrapper{
            position: absolute;
            top:40px;
            bottom: 50px;
            width: 100%;
            overflow-y: scroll;
            .box{
                width:100%;
                box-sizing: border-box;
                padding:0px 20px;
                margin: 20px 0;
                .good-item{
                    display: flex;
                    overflow: hidden;
                    .good-left{
                        float:left;
                        margin-right: 10px;
                        img {
                            display: inline-block;
                            width: 80px;
                            height: 80px;
                            vertical-align: top;
                        }
                    }
                    .good-right {
                        flex: 1;
                        float: left;
                        padding-top: 10px;
                        .title {
                            display: block;
                            margin-bottom: 20px;
                            text-decoration: none;
                        }
                    }
                }
                .address-item{
                    margin-bottom: 10px;
                    padding:10px 10px;
                    border: 1px solid #cccccc;
                    &.active{
                        border: 1px solid #ff0000;
                    }
                    .header{
                        margin-bottom: 5px;
                    }
                    .main{
                        margin-bottom: 5px;
                    }
                }
            }
        }

        .cart_footer {
            position: fixed;
            left:0;
            bottom: 0px;
            width: 100%;
            height:50px;
            padding-left: 20px;
            box-sizing: border-box;
            line-height: 50px;
            background: #fff;
            z-index: 100;
            .checked{
                display: inline-block;
                width: 16px;
                height:16px;
                margin: 16px 10px 0;
                color: red;
            }
            .check{
                display: inline-block;
                width: 50px;
                height:50px;
                margin-left:-7px;
                border-radius: 50%;
                border:1px solid #000;
                transform: scale(0.3);
                line-height: 50px;
            }
            .price-wrapper{
                display: inline-block;
                float: right;
                margin-right: 30px;
                line-height: 50px;
                vertical-align: top;
                .totalPrice{
                    font-size: 18px;
                    font-weight: bold;
                    color: red;
                }
            }
            .submitOrder{
                display: inline-block;
                float: right;
                height:50px;
                line-height: 50px;
                padding:0 20px;
                text-align: center;
                vertical-align: top;
                font-size: 14px;
                font-weight: bold;
                color: #fff;
                background: red;
            }
        }
    }
</style>
