<template>
    <div class="wrapper">
        <el-container>
            <el-header>
                <i class="el-icon-arrow-left" @click="lastStep"></i>
                <span class="title">{{title}}</span>
                <slot name="title-right"></slot>
            </el-header>
            <slot name="content"></slot>
            <slot name="footer"></slot>
        </el-container>
    </div>
</template>

<script>
    export default{
        props:["title"],
        methods:{
            lastStep(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .wrapper {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        min-height: 100%;
        background: #fff;
        z-index: 100;
        .el-header {
            height: 40px !important;
            line-height: 40px;
            text-align: center;
            background: #fff;
            border-bottom: 1px dotted #ccc;
            .el-icon-arrow-left {
                line-height: 40px;
                float: left;
            }
            .text {
                float: right;
                font-size: 12px;
                color: rgb(64, 158, 255);
            }
        }
    }
</style>
