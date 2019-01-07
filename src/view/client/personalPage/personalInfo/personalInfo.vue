<template>
    <div class="personalInfo">
        <v-subpage title="个人资料">
            <ul class="list" slot="content">
                <li v-for="(value,key) in personalInfo" class="list-item" @click="changeInfo" v-if="key!='password'">
                    <span class="key">{{key}}</span>
                    <i class="el-icon-arrow-right"></i>
                    <span class="value">{{value}}</span>
                </li>
            </ul>
        </v-subpage>
    </div>
</template>

<script>
    import subpage from '@/components/subpage/subpage.vue';

    export default{
        data(){
            return {
                personalInfo:{}
            }
        },
        components:{
            "v-subpage":subpage
        },
        methods:{
            init(){
                let that = this;
                this.$http.get("/api/client/personalInfo").then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.personalInfo = res.result;
                    }
                })
            },
            changeInfo(){
                this.$prompt('请输入你要修改的值', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then(({ value }) => {
                    this.$message({
                        type: 'success',
                        message: '你的邮箱是: ' + value
                    });
                })
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .personalInfo{
        position: absolute;
        width:100%;
        left:0;
        .list{
            background: #fff;
            border-top: 1px solid rgba(7,17,27,0.1);
            .list-item{
                display: block;
                height:40px;
                line-height: 40px;
                margin:0 20px;
                border-bottom: 1px solid rgba(7,17,27,0.1);
                .value{
                    float:right;
                }
                .el-icon-arrow-right{
                    float: right;
                    padding-left:20px;
                    line-height: 40px;
                }
            }
        }
    }
    .el-message-box{
        width:80%;
        margin: 0 auto;
    }
</style>
