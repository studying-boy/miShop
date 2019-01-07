<template>
    <transition name="move">
        <div class="good" ref="good">
            <div class="good-content">
                <div class="image-header">
                    <img :src="good.image">
                    <div class="back" @click="lastStep">
                        <i class="icon-arrow_lift"></i>
                    </div>
                </div>          <!--大图片-->
                <div class="content">
                    <h1 class="title">{{good.name}}</h1>
                    <p class="desc" v-if="good.description">{{good.description}}</p>
                    <div class="detail">
                        <span class="sell-count">库存{{good.number}}份</span>
                        <span class="rating" v-if="good.rating">好评率{{good.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="newPrice">￥{{good.price}}</span><span class="oldPrice" v-show="good.oldPrice">￥{{good.oldPrice}}</span>
                    </div>
                </div>               <!--内容-->
                <div class="info" v-show="good.info">
                    <h1 class="title">商品介绍</h1>
                    <p class="text">{{good.info}}</p>
                </div>    <!--商品介绍-->
            </div>
            <div class="good-footer">
                <div class="tab">
                    <div class="tab-item">
                        <i class="icon icon-favorite"></i>
                        <span class="text">喜欢</span>
                    </div>
                    <div class="tab-item" @click="goShopCart">
                        <i class="icon icon-shopping_cart"></i>
                        <span class="text">购物车</span>
                    </div>
                    <transition name="fade">
                        <div @click.stop.prevent="addCart" class="addCart">加入购物车</div>
                    </transition>
                </div>
            </div>
        </div>
    </transition>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll'

    export default{
        props:["goodInfo"],
        data(){
            return {
                showFlag : false,
                good:{}
            }
        },
        components:{

        },
        mounted(){
            let that = this;
            let good_id = this.$route.query.id;
            console.log(good_id);
            this.$http.get("/api/client/goodInfo",{
                params:{
                    good_id: good_id
                }
            }).then((response)=>{
                let res = response.data;
                if(res.status === "0"){
                    that.good = res.result[0];
                    that.$nextTick(()=>{
                        if(!that.scroll){
                            that.scroll = new BScroll(that.$refs.good,{
                                click:true
                            })
                        }else{
                            that.scroll.refresh();
                        }
                    })
                }
            })
        },
        methods:{
            lastStep(){
                this.$router.go(-1);
            },
            addCart(event){                //加入购物车
                if(!sessionStorage.getItem("userName")){          //判断是否登录
                    alert("请先登录！");
                    return this.$router.push("/client/login");
                }
                /*先判断购物车是否有这件商品，有则+1, 否则创建一条数据*/
                let that = this;
                this.$http.post("/api/client/addCart",{
                    id:this.good._id
                }).then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){                 //弹出提示框
                        that.$confirm("成功加入购物车","",{
                            confirmButtonText:"查看购物车",
                            cancelButtonText:"继续浏览",
                            type:"success",
                            center:true
                        }).then(()=>{
                            that.$router.push('/client/shopCart');
                        });
                    }
                })
            },
            goShopCart(){
                this.$router.push("/client/shopCart");
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .good{
        position:absolute;
        z-index: 100;
        top:0;
        left:0;
        bottom: 48px;
        width:100%;
        min-height:100%;
        background: #fff;
        &.move-enter-active, &.move-leave-active{
            transition: all 0.2s;
        }
        &.move-enter, &.move-leave-active{
            left:-100%;
        }
        .good-content{
            padding-bottom: 50px;
            .image-header{
                position: relative;
                width:100%;
                height:0;
                padding-top:100%;     //可以使高度跟宽度保持一致
                img{
                    position: absolute;
                    top:0;
                    left: 0;
                    width:100%;
                    height:100%;
                }
                .back{
                    position: absolute;
                    top:10px;
                    left:0;
                    .icon-arrow_lift{
                        display: block;
                        padding:10px;
                        font-size: 20px;
                        color: #fff;
                    }
                }
            }
            .content{
                position: relative;
                padding: 18px;
                .title{
                    margin-bottom: 8px;
                    line-height: 14px;
                    font-size: 14px;
                    font-weight: 700;
                    color: rgb(7,17,27);
                }
                .detail{
                    margin-bottom: 18px;
                    line-height: 10px;
                    font-size: 0px;
                    color: rgb(147,153,159);
                    .sell-count{
                        font-size:10px;
                        margin-right: 12px;
                    }
                    .rating{
                        font-size: 10px;
                    }
                }
                .price{
                    line-height: 24px;
                    font-weight: 700;
                    .newPrice{
                        font-size: 14px;
                        color: rgb(240,20,20);
                        margin-right: 8px;
                    }
                    .oldPrice{
                        font-size: 10px;
                        color: rgb(147,153,159);
                        text-decoration: line-through;
                    }
                }
                .carControl-wrapper{
                    position: absolute;
                    right:12px;
                    bottom:12px;
                }
            }
            .info{
                padding:18px;
                .title{
                    line-height: 14px;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: rgb(7,17,27);
                }
                .text{
                    line-height: 24px;
                    padding: 0 8px;
                    font-size: 12px;
                    font-weight: 200;
                    color: rgb(77,85,93);
                }
            }
        }
        .good-footer{
            position: fixed;
            left:0;
            bottom: 0;
            width: 100%;
            height:50px;
            background: #fff;
            .tab {
                display: flex;
                width: 100%;
                height:50px;
                padding: 5px 0;
                box-sizing: border-box;
                text-align: center;
                border-top: 1px solid rgba(7, 17, 27, 0.1);
                box-sizing: border-box;
                .tab-item {
                    flex: 1;
                    .icon{
                        display: block;
                        margin-bottom: 10px;
                    }
                    .text{
                         display: block;
                         font-size: 14px;
                         color: rgb(77, 85, 93);
                     }
                }
                .addCart{
                    flex:3;
                    z-index: 10;
                    margin:0 12px;
                    height:100%;
                    line-height: 40px;
                    font-size: 14px;
                    color: #fff;
                    border-radius: 12px;
                    background: rgb(255,107,1);
                    opacity: 1;
                    &.fade-enter-active, &.fade-leave-active{
                        transition: all 0.2s;
                    }
                    &.fade-enter, &.fade-leave-active{
                        opacity: 0;
                        z-index: -1;
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
