<template>
    <el-container style="float:left;background-color: #eee">
        <el-aside width="200px">
            <el-menu  :default-openeds="['1','2', '3']">
                <el-submenu index="1">
                    <template slot="title"><i class="el-icon-message"></i>商品</template>
                    <el-menu-item index="1-1" @click.native="linkTo($event,'/management/goodList')">商品列表</el-menu-item>
                    <el-menu-item index="1-2" @click="linkTo($event,'/management/createGood')">新增商品</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-message"></i>分类</template>
                    <el-menu-item index="2-1" @click="linkTo($event,'/management/classifyList')">分类列表</el-menu-item>
                    <el-menu-item index="2-2" @click="linkTo($event,'/management/createClassify')">增加分类</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title"><i class="el-icon-message"></i>订单</template>
                    <el-menu-item index="3-1" @click="linkTo($event,'/management/orderList')">订单列表</el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
    </el-container>
</template>

<script>
    export default{
        data() {
            return {}
        },
        methods:{
            linkTo(e,url){
                this.$router.push(url);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">

    .el-aside {
        color: #333;
        .el-submenu{
            background: #ECF5FF;   //大标题
            .el-menu-item{
                background: #fff;    //小标题
            }
        }
    }
</style>
