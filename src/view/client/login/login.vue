<template>
    <div class="wrapper">
        <div class="login">
            <el-container>
                <el-header>
                    <i class="el-icon-arrow-left" @click="lastStep"></i>
                    <span class="title">登陆</span>
                    <router-link to="register">
                        <span class="text">注册</span>
                    </router-link>
                </el-header>
                <el-main>
                    <div class="wrapper" :class="{'password':focuspass}">
                        <div class="owl-login" id="owl-login">
                            <div class="hand"></div>
                            <div class="hand hand-r"></div>
                            <div class="arms">
                                <div class="arm"></div>
                                <div class="arm arm-r"></div>
                            </div>
                        </div>
                        <el-input placeholder="用户名" v-model="userName"></el-input>
                        <el-input placeholder="密码" v-model="password" type="password" @keyup.enter="login" @focus="focusPass" @blur="blurPass"></el-input>
                    </div>
                </el-main>
                <el-button type="primary" @click="login">登录</el-button>
            </el-container>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                userName:'',
                password:'',
                focuspass:false
            }
        },
        methods:{
            lastStep(){
                this.$router.go(-1);
            },
            /*密码获得焦点和失去焦点*/
            focusPass(){
                this.focuspass = true;
            },
            blurPass(){
                console.log(1);
                this.focuspass = false;
            },
            login(){
                let that = this;
                this.$http.post("/api/client/login",{
                    "userName": this.userName,
                    "password": this.password
                }).then(function (response) {
                    let res = response.data;
                    if(res.status === 0){
                        that.$store.dispatch("setUser",res.result);
                        that.$store.dispatch("login");       //修改登录状态
                        that.$notify({
                            title:"成功",
                            message:"登陆成功",
                            type:"success",
                            duration:2000
                        })
                        setTimeout(function () {
                            that.$router.push("/client/home");
                        },2000)
                    }else{
                        that.$notify({
                            title:"错误",
                            message:"用户或密码错误",
                            type:"error",
                            duration:2000
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .login{
        position: fixed;
        top:0;
        left:0;
        width:100%;
        min-height:100%;
        background: rgb(209,209,209);
        z-index: 100;
        .el-container{
            .el-header{
                height:40px !important;
                margin-bottom: 10px;
                line-height: 40px;
                text-align: center;
                background: #fff;
                .el-icon-arrow-left{
                    line-height: 40px;
                    float: left;
                }
                .text{
                    float: right;
                    font-size: 12px;
                    color: rgb(64,158,255);
                }
            }
            .el-main{
                margin-top: 108px;
                margin-bottom: 10px;
                background: #fff;
                overflow: visible;
                .wrapper{
                    position: relative;
                    .owl-login{
                        position: absolute;
                        top:-120px;
                        left:50%;
                        margin-left: -105px;
                        width:211px;
                        height: 108px;
                        background: url("../../../assets/owl-login.png");
                        .hand{
                            position: absolute;
                            left:0px;
                            bottom: -8px;
                            width:34px;
                            height: 34px;
                            border-radius: 50%;
                            transform: scaleY(0.6);
                            background: #83583f;
                            transition:all 0.3s;
                        }
                        .hand-r{
                            left:177px;
                        }
                        .arms{
                            position: absolute;
                            top:58px;
                            width: 100%;
                            height: 41px;
                            overflow: hidden;
                            .arm{
                                position: absolute;
                                left: 5px;
                                top: 40px;
                                width: 40px;
                                height: 65px;
                                background: url("../../../assets/owl-login-arm.png");
                                transform: rotate(-20deg);
                                transition:all 0.3s;
                            }
                            .arm-r{
                                left:168px;
                                transform: rotate(20deg) scaleX(-1);
                            }
                        }
                    }
                    &.password{
                        .hand{
                            transform: translateX(60px) translateY(-15px) scale(0.3);
                        }
                        .hand-r{
                            transform: translateX(-60px) translateY(-15px) scale(0.3);
                        }
                        .arms{
                            .arm{
                                transform: translateX(55px) translateY(-35px);
                            }
                            .arm-r{
                                transform: translateX(-50px) translateY(-35px) scaleX(-1);
                            }
                        }
                    }
                    .el-input{
                        margin-bottom: 10px;
                    }
                }
            }
            .el-button{
                margin:0 20px;
            }
        }
    }
    .el-notification{
        width:90%;
        margin: 0 auto;
    }

    @media all and (-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 1.5/1), (min-device-pixel-ratio: 1.5), (min-resolution: 138dpi), (min-resolution: 1.5dppx) {
        .owl-login{
            background-image: url("../../../assets/owl-login@2x.png");
            background-size: 211px 108px;
        }
        .owl-login .arms .arm {
            background-image: url("../../../assets/owl-login-arm@2x.png");
            background-size: 40px 65px;
        }
    }
</style>

