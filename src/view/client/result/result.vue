<template>
    <div class="wrapper">
        <el-container>
            <el-header>
                <i class="el-icon-arrow-left" @click="lastStep"></i>
                <span class="title">搜索结果</span>
            </el-header>
            <div class="search">
                <el-input placeholder="请输入你要搜索的商品名字" class="search_input"  v-model="search_text"></el-input>
                <el-button type="primary" class="search_btn" @click="search">搜索</el-button>
            </div>
            <ul class="list" v-if="result!=''">
                <li v-for="(good, index) in result" class="good-item" :key="index" v-if="good.number>0"  @click="goGoodInfo(good._id)">
                    <div class="good-left">
                        <img :src="good.image" :title="good.name">
                    </div>
                    <div class="good-right">
                        <a class="title">{{good.name}}</a>
                        <span class="number">库存：{{good.number}}</span>
                        <span class="desc">{{good.description}}</span>
                    </div>
                </li>
            </ul>
            <p v-else style="text-align: center">
                对不起，找不到相关商品
            </p>
        </el-container>
    </div>
</template>

<script>
    import subpage from '@/components/subpage/subpage.vue';

    export default{
        data(){
            return {
                result:[],
                search_text:""
            }
        },
        components:{
            "v-subpage":subpage
        },
        mounted(){
            this.init();
        },
        methods:{
            init(){
                let that = this;
                let text = this.$route.query.text;
                this.$http.get("/api/client/search",{
                    params:{
                        text:text
                    }
                }).then((response)=> {
                    let res = response.data;
                    if(res.status == "0"){
                        console.log(1);
                        that.result = res.result;
                    }else if(res.status == "2"){
                        that.result = [];
                        console.log(this.result == "");
                    }
                })
            },
            lastStep(){
                this.$router.push("/client/home");
            },
            search(){
                this.$router.push({
                    path:"/client/result?text=" + this.search_text
                });
            },
            goGoodInfo(good_id){
                this.$router.push("/client/goodsList/good?id=" + good_id);
            },
        },
        /*监听路由变化*/
        watch:{
            '$route'(){
                if(this.$route.path==='/client/result'){
                    this.init();
                }
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    html,body{
        width: 100%;
        height: 100%;
    }
    .wrapper{
        position: fixed;
        top:0;
        left:0;
        width:100%;
        min-height:100%;
        background: #fff;
        z-index: 100;
        .el-container {
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
            .search{
                width: 100%;
                margin: 10px 0;
                text-align: center;
                .search_input{
                    display: inline-block;
                    width:60%;
                    box-sizing: border-box;
                    margin-right: 5px;
                }
                .search_btn{
                    display: inline-block;
                    width:20%;
                }
            }
            .list{
                position: absolute;
                top:100px;
                width:100%;
                height:600px;
                padding-bottom: 20px;
                overflow: auto;
                .good-item {
                    display: flex;
                    padding:20px 10px;
                    overflow: hidden;
                    border-top: 1px solid #cccccc;
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
                            text-decoration: none;
                        }
                        .number{
                            display: inline-block;
                            margin-left: 10px;
                            font-size: 10px;
                            opacity: 0.5;
                        }
                        .desc{
                            display: block;
                            margin-top: 10px;
                            line-height: 1.2;
                            font-size: 14px;
                        }
                    }
                }
            }

        }
    }
</style>
