<template>
    <div class="register">
        <el-container>
            <el-header>
                <i class="el-icon-arrow-left" @click="lastStep"></i>
                <span class="title">注册</span>
                <router-link to="login">
                    <span class="text">登陆</span>
                </router-link>
            </el-header>
            <el-main>
                <el-form :model="form" :rules="rules" ref="form" status-icon>
                    <el-form-item  prop="userName">
                        <el-input placeholder="用户名" v-model="form.userName"></el-input>
                    </el-form-item>
                    <el-form-item  prop="password">
                        <el-input placeholder="密码" type="password" v-model="form.password" prop="password"></el-input>
                    </el-form-item>
                    <el-form-item  prop="rpassword">
                        <el-input placeholder="重复密码" type="password" v-model="form.rpassword" prop="rpassword"></el-input>
                    </el-form-item>
                    <el-form-item  prop="phone">
                        <el-input placeholder="手机号码" v-model="form.phone" prop="phone"></el-input>
                    </el-form-item>
                </el-form>
            </el-main>
            <el-button type="primary" @click="register('form')">注册</el-button>
        </el-container>
    </div>
</template>

<script type="text/ecmascript-6">
    export default{
        data(){
            var checkName = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error("用户名不能为空"));
                }else if(value.length < 3){
                    return callback(new Error("用户名不能少于3个字符"));
                }else if(value.length >= 16){
                    return callback(new Error("用户名不能多于16个字符"));
                }else{
                    this.$http.post("/api/client/checkUser",{                 //判断用户名是否被注册
                        userName: value
                    }).then((response)=>{
                        let res = response.data;
                        if(res.status === "0"){
                            callback();
                        }else{
                            return callback(new Error("该用户已被注册！"));
                        }
                    })
                }
            }
            var checkPass = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error("密码不能为空"));
                }else if(value.length < 3){
                    return callback(new Error("密码不能少于3个字符"));
                }else if(value.length >= 8){
                    return callback(new Error("密码不能多于8个字符"));
                }else{
                    callback();
                }
            }
            var checkrPass = (rule,value,callback)=>{
                if(!value){
                    return callback(new Error("请再次输入密码"));
                }else if(this.form.password !== this.form.rpassword){
                    return callback(new Error("两次输入的密码不一致"))
                }else{
                    callback();
                }
            }
            var checkPhone = (rule,value,callback)=>{
                let reg = /^1[34578]\d{9}$/;
                if(!value){
                    return callback(new Error("手机号不能为空"));
                }else if(reg.test(value) === false){
                    return callback(new Error("手机格式不正确"));
                }else{
                    callback();
                }
            }
            return {
                form:{
                    userName:'',
                    password:'',
                    rpassword:'',
                    phone:''
                },
                rules:{
                    userName:[
                        {validator: checkName, trigger:'blur'}
                    ],
                    password:[
                        {validator: checkPass, trigger:'blur'}
                    ],
                    rpassword:[
                        {validator: checkrPass, trigger:'blur'}
                    ],
                    phone:[
                        {validator: checkPhone, trigger:'blur'},
                    ]
                }
            }
        },
        methods:{
            register(form){
                let that = this;
                this.$refs[form].validate((valid)=>{
                    if(valid){
                        that.$http.post("/api/client/register",{
                            "userName":this.form.userName,
                            "password":this.form.password,
                            "phone":this.form.phone
                        }).then(function(response){
                            let res = response.data;
                            if(res.status === 0){
                                that.$notify({
                                    title:"成功",
                                    message:"注册成功",
                                    type:"success",
                                    duration:2000
                                })
                                setTimeout(function () {
                                    that.$router.push("/client/login");
                                },2000)
                            }else if(res.status === 1){
                                alert(res.msg);
                            }

                        });
                    }else{
                        console.log('error submit');
                        return false;
                    }
                })
            },
            lastStep(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .register{
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
                .el-form{
                    .el-form-item{
                        &:last-child{
                            margin-bottom: 0;
                        }
                    }
                }
            }
            .el-button{
                margin:0 20px;
            }
        }
    }
</style>
