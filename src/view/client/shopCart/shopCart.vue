<template>
    <div class="shopCart">
        <!--用户还没登陆-->
        <div v-if="!isLogin" class="tipBox">
            <p class="tip">
                <i class="el-icon-warning" style="color: rgb(230,162,60)"></i>
                你还没登录
                <el-button type="text" class="btn" @click="goLogin">去登录</el-button>
            </p>
        </div>
        <div v-else>
            <!--购物车为空-->
            <div class="tipBox" v-if="isEmptyCart">
                <div class="tip">
                    <i class="el-icon-info" style="color: rgb(144,147,153)"></i>
                    你的购物车还是空的
                    <el-button type="text" class="btn" @click="goHome">去逛逛</el-button>
                </div>
            </div>
            <!--购物车不为空-->
            <div class="cartWrapper" v-else>
                <div class="cart_header">
                    <span class="title">
                        <i class="icon-arrow_lift"></i>
                        <span class="text">购物车</span>
                    </span>
                    <button class="edit">编辑</button>
                </div>
                <div class="cart_content">
                    <ul>
                        <li v-for="(good, index) in goods" class="good-item" :key="index" v-if="good.number>0">
                            <div @click="editCheck(good._id, good)">
                                <i class="checked el-icon-success" v-if="good.checked"></i>
                                <span class="check" v-else></span>
                            </div>
                            <div class="good-left">
                                <img :src="good.image" :title="good.name">
                            </div>
                            <div class="good-right">
                                <a class="title" @click="goGoodInfo(good._id)">{{good.name}}</a>
                                <span class="number">库存：{{good.number}}</span>
                                <p class="info">
                                    <span class="text">数量:</span>
                                    <van-stepper v-model="good.count" class="num" @change="editNum(good._id,good.count)" disable-input :max="good.number"/>
                                    <span class="totalPrice">{{good.price | currency("￥")}}</span>
                                </p>
                            </div>
                            <i class="el-icon-delete" @click="deleteGood(good._id)"></i>
                        </li>
                    </ul>
                </div>
                <div class="cart_footer">
                    <span @click="toggleCheckAll">
                        <i class="checked el-icon-success" v-if="isAllChecked"></i>
                        <span class="check" v-else></span>
                    </span>
                    <span class="submitOrder" :class="{'active':checkedCount>0}" @click="submitOrder">提交订单</span>
                    <span class="price-wrapper">
                        合计：<span class="totalPrice">{{totalPrice | currency("￥")}}</span>
                    </span>
                </div>
            </div>
        </div>
        <v-footer></v-footer>
        <router-view :selectGoods="selectGoods"></router-view>
    </div>
</template>

<script>
    import Footer from '@/components/footer/footer.vue'
    import {currency} from '@/common/js/currency'    //价格过滤器

    export default{
        components: {
            "v-footer": Footer
        },
        data(){
            return {
                goods :[],
                selectGoods:[]
            }
        },
        computed: {
            isLogin(){
                return this.$store.state.isLogin;
            },
            isEmptyCart(){
                if(this.goods.length === 0){
                    this.$router.isEmptyCart = true;
                    return true;
                }else{
                    return this.$store.state.isEmptyCart;
                }
            },
            totalPrice(){
                let total = 0;
                this.goods.forEach(function (item) {
                    if(item.checked === true){
                        total += item.price * item.count;
                    }
                })
                return total;
            },             //计算总金额
            isAllChecked(){
                return this.checkedCount == this.goods.length;
            },             //判断是否全选
            checkedCount(){
                let i = 0;
                this.goods.forEach((item)=>{
                    if(item.checked === true){
                        i++;
                    }
                })
                return i;
            },            //判断选中商品的数量
        },
        filters:{
            currency:currency
        },
        mounted(){
            this.init();
        },
        methods: {
            init(){                        //获取数据
                let that = this;
                if(this.$store.state.isLogin){
                    this.$http.get("/api/client/cart").then((response)=>{
                        let res = response.data;
                        if(res.status === "0"){
                            that.$store.dispatch("changeCart");
                            that.goods = res.result;
                            that.goods.forEach(function (item) {
                                if(item.checked === true){
                                    that.selectGoods.push(item);
                                }
                            })
                        }
                    })
                }
            },
            goLogin(){
                this.$router.push("/client/login");
            },
            goHome(){
                this.$router.push("/client/home");
            },
            goGoodInfo(good_id){
                this.$router.push("/client/goodsList/good?id=" + good_id);
            },
            deleteGood(good_id){
                let that = this;
                this.$confirm('确定要删除此商品吗？', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.post("/api/client/deleteCart",{
                        good_id:good_id
                    }).then((response)=>{
                        let res = response.data;
                        if(res.status === "0"){
                            that.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            that.init();
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },              //删除商品
            editNum(good_id,count){
                let that = this;
                this.$http.post('/api/client/cart_editNum',{
                    good_id:good_id,
                    count:count
                })
            },           //修改商品数量
            editCheck(good_id,good){
                let that = this;
                good.checked = !good.checked;
                this.$http.post("/api/client/cart_editCheck",{
                    good_id: good_id,
                    check: good.checked
                }).then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        if(good.checked === true){
                            that.selectGoods.push(good);
                        }else{
                            let i = that.selectGoods.indexOf(good);
                            that.selectGoods.splice(i,1);
                        }
                    }
                })
            },          //修改商品状态
            toggleCheckAll(){
                let flag = !this.isAllChecked;
                this.goods.forEach(function (item) {
                    item.checked = flag;
                })
                this.$http.post("/api/client/cart_editCheckAll",{
                    check:flag
                })
            },                 //修改全选
            submitOrder(){
                if(this.checkedCount > 0){
                    this.$router.push("/client/shopCart/checkout");
                }
            }                     //提交订单
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .shopCart {
        margin-bottom: 100px;
        .tipBox {
            padding: 20px 0;
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(7, 17, 27, 0.1);
            .tip {
                height: 40px;
                line-height: 40px;
                font-size: 20px;
                text-align: center;
                .btn {
                    margin-left: 5px;
                    font-size: 20px;
                }
            }
        }
        .cartWrapper {
            .cart_header {
                position: absolute;
                top:0;
                width: 100%;
                height: 20px;
                z-index: 99;
                padding: 10px 0;
                background: pink;
                .title {
                    margin-left: 10px;
                    .icon-arrow-left {
                        display: inline-block;
                        margin-right: 10px;
                    }
                    .text {
                        font-size: 18px;
                    }
                }
                .edit {
                    float: right;
                    height: 20px;
                    line-height: 20px;
                    border: none;
                    background: transparent;
                    outline: none;
                }
            }
            .cart_content {
                position: absolute;
                top:40px;
                bottom: 100px;
                width: 100%;
                overflow: auto;
                .good-item {
                    display: flex;
                    padding:10px 0 10px 10px;
                    overflow: hidden;
                    border-bottom: 1px solid #cccccc;
                    .checked{
                        display: inline-block;
                        width: 16px;
                        height:16px;
                        margin-top: 30px;
                        margin-right: 10px;
                        color: red;
                    }
                    .check{
                        display: inline-block;
                        width: 14px;
                        height:14px;
                        margin-top: 30px;
                        margin-right: 10px;
                        border-radius: 50%;
                        border:1px solid #000;
                        line-height: 80px;
                    }
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
                    .good-right{
                        flex: 1;
                        float: left;
                        padding-top:10px;
                        .title {
                            display: inline-block;
                            margin-bottom: 20px;
                            text-decoration: none;
                        }
                        .number{
                            display: inline-block;
                            margin-left: 10px;
                            font-size: 10px;
                            opacity: 0.5;
                        }
                        .info{
                            font-size: 0;
                            vertical-align: middle;
                            .text,.num,.totalPrice{
                                display: inline-block;
                                vertical-align: middle;
                                font-size: 12px;
                            }
                            .text{
                                margin-right: 10px;
                            }
                            .num{
                                button{
                                    width:30px;
                                }
                            }
                            .totalPrice {
                                margin-left: 10px;
                                line-height: 26px;
                                color: red;
                                font-size: 14px;
                                font-weight: bold;
                            }
                        }
                    }
                    .el-icon-delete {
                        display: inline-block;
                        width: 30px;text-align: center;
                        line-height: 80px;
                    }
                }
            }
            .cart_footer {
                position: fixed;
                left:0;
                bottom: 48px;
                width: 100%;
                height:50px;
                line-height: 50px;
                background: #fff;
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
                    background: #ccc;
                    &.active{
                        color: #fff;
                        background: red;
                    }
                }
            }
        }
    }

    /*修改提示框*/
    .el-message-box__wrapper{
        .el-message-box{
            max-width:420px;
            width:80%;
        }
    }
</style>
