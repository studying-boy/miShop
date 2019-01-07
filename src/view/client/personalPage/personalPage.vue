<template>
    <div class="personal">
        <div>
            <div class="top">
                <div class="sign">
                    <div class="avatar">
                        <div v-if="!isLogin">
                            <img src="http://static.galileo.xiaojukeji.com/static/tms/default_header.png">
                            <router-link to="login">
                                <span v-text="!isLogin ? '登陆/注册':'已登录'" class="prompt"></span>
                            </router-link>
                        </div>
                        <div v-else>
                            <img src="http://static.galileo.xiaojukeji.com/static/tms/default_header.png">
                            <span class="prompt">
                                {{user.userName}}
                                <el-button type="text" @click="logout">退出登录</el-button>
                            </span>
                        </div>
                    </div>
                    <div class="new">
                        <!--<span class="icon-bubble"></span>
                        <i class="new-count">3</i>-->
                        <el-badge class="item" value="9">

                        </el-badge>
                    </div>
                </div>
            </div>
            <div class="order-wrapper">
                <router-link to="personalPage/order?tab=0">
                    <div class="order-title">
                        <span class="title">我的订单</span>
                        <span class="text">全部订单</span>
                    </div>
                </router-link>
                <div class="order-content">
                    <router-link to="personalPage/order?tab=1" class="item">
                        <span>待付款</span>
                    </router-link>
                    <router-link to="personalPage/order?tab=2" class="item">
                        <span>待收货</span>
                    </router-link>
                    <router-link to="personalPage/order?tab=0" class="item">
                        <span>待评价</span>
                    </router-link>
                    <router-link to="personalPage/order?tab=0" class="item">
                        <span>退换修</span>
                    </router-link>
                </div>
            </div>
            <ul class="supports">
                <li class="support-item">
                    <span class="icon icon-user"></span>
                    <span class="text">优惠劵</span>
                </li>
                <li class="support-item">
                    <span class="icon icon-user"></span>
                    <span class="text">会员中心</span>
                </li>
                <li class="support-item">
                    <span class="icon icon-user"></span>
                    <span class="text">我的钱包</span>
                </li>
                <li class="support-item">
                    <span class="icon icon-user"></span>
                    <span class="text">服务中心</span>
                </li>
                <router-link to="/client/personalPage/setting">
                    <li class="support-item">
                        <span class="icon icon-user"></span>
                        <span class="text">设置</span>
                    </li>
                </router-link>
            </ul>
            <v-footer></v-footer>
        </div>
        <router-view :user="user"></router-view>
    </div>
</template>

<script>
    import Footer from '@/components/footer/footer.vue'

    export default{
        data(){
            return {

            }
        },
        components:{
            "v-footer":Footer
        },
        computed:{
            isLogin(){
                return this.$store.state.isLogin;
            },
            user(){
                return this.$store.state.userInfo;
            }
        },
        mounted(){
            if(this.$cookies.get("userId") != ""){
                this.$store.dispatch("refresh");
            }else{
                console.log("nologin");
            }
        },
        methods:{
            logout(){
                this.$cookies.set("userId", "");
                sessionStorage.clear();
                location.reload();
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .personal{
        .top{
            width:100%;
            height:80px;
            padding:20px;
            box-sizing: border-box;
            background: rgba(255,103,0,0.9);
            .sign{
                height:40px;
                line-height: 40px;
                font-size: 0;
                .avatar{
                    display: inline-block;
                    img{
                        display: inline-block;
                        width:40px;
                        height:40px;
                        margin-right: 10px;
                        border-radius: 50%;
                        vertical-align: top;
                    }
                    .prompt{
                        display: inline-block;
                        font-size: 14px;
                        color: #fff;
                    }
                }
                .new{
                    position: relative;
                    display: inline-block;
                    float: right;
                    width:40px;
                    height:40px;
                    font-size: 14px;
                    text-align: center;
                    .icon-bubble{
                        display: block;
                        line-height: 40px;
                        font-size: 20px;
                        color: #fff;
                    }
                    .new-count{
                        position: absolute;
                        top:-5px;
                        right:5px;
                    }
                }
            }
        }
        .order-wrapper{
            width:100%;
            .order-title{
                padding:10px;
                font-size: 0;
                border-bottom: 1px solid rgba(7,17,27,0.1);
                .title{
                    line-height: 14px;
                    font-size: 14px;
                    color: rgb(7,17,27);
                }
                .text{
                    float: right;
                    line-height: 14px;
                    font-size: 10px;
                    color: rgb(147,153,159);
                }
            }
            .order-content{
                display: flex;
                padding:15px 0;
                border-bottom: 1px solid rgba(7,17,27,0.1);
                .item{
                    flex:1;
                    text-align: center;
                    color:#999;
                }
            }
        }
        .supports{
            .support-item{
                padding:16px 0px;
                margin:0 12px 0 24px;
                font-size: 0;
                border-bottom: 1px solid rgba(7,17,27,0.1);
                .icon{
                    display: inline-block;
                    width: 12px;
                    height: 12px;
                    margin-right: 6px;
                    vertical-align: top;
                    background-size: cover;
                }
                .text{
                    line-height: 16px;
                    font-size: 12px;
                    font-weight: 200;
                    color: rgb(7,17,27);
                }
            }
        }
    }
</style>
