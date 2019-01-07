<template>
    <div class="wrapper">
        <div class="login">
            <el-container>
                <el-header>
                    <i class="el-icon-arrow-left" @click="lastStep"></i>
                    <span class="title">管理员登陆</span>
                </el-header>
                <el-main>
                    <el-input placeholder="用户名" v-model="userName"></el-input>
                    <el-input placeholder="密码" v-model="password" type="password" @keyup.enter.native="login"></el-input>
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
                password:''
            }
        },
        methods:{
            lastStep(){
                this.$router.go(-1);
            },
            login(){
                let that = this;
                this.$http.post("/api/management/login",{
                    "userName": this.userName,
                    "password": this.password
                }).then(function (response) {
                    let res = response.data;
                    if(res.status === 0){
                        that.$store.dispatch("setAdmin",res.result);
                        that.$store.dispatch("adminLogin");       //修改登录状态
                        that.$notify({
                            title:"成功",
                            message:"登陆成功",
                            type:"success",
                            duration:2000
                        })
                        setTimeout(function () {
                            that.$router.push("/management/index");
                        },2000)
                    }else{
                        alert(res.msg);
                    }
                })
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    html,body{
        height:100%;
        overflow: hidden;
    }
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
                margin-bottom: 10px;
                background: #fff;
            }
            .el-button{
                margin:0 20px;
            }
        }
    }

</style>


var obj = {
    one : 1,
    two : 2,
    obj1 : {
        three:3
    }
}
