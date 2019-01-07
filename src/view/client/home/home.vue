<template>
    <div class="home">
        <!--轮播图-->
        <van-swipe style="height:200px" :autoplay="3000">
            <van-swipe-item v-for="(item,index) in imgs" :key="index">
                <img :src="item"  style="width:100%;height:100%">
            </van-swipe-item>
        </van-swipe>

        <!--搜索框-->
        <div class="search">
            <el-input placeholder="请输入你要搜索的商品名字" class="search_input"  v-model="search_text"></el-input>
            <el-button type="primary" class="search_btn" @click="search">搜索</el-button>
        </div>

        <!--商品推荐-->
        <div class="recommend">
            <span style="margin-left: 15px">推荐商品</span>
            <div class="list">
                <div class="item" v-for="(item,index) in recommend" :key="index" @click="jumpGood(item)">
                    <img v-lazy="item.image">
                    <span class="name">{{item.name}}</span><br>
                    <span class="price">￥{{item.price}}</span>
                </div>
                <!--加载动画-->
                <div class="loading" v-if="!finsh">
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                        <rect x="0" y="0" width="4" height="10" fill="#333" transform="translate(0 15.1665)">
                        <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite"></animateTransform>
                        </rect>
                        <rect x="10" y="0" width="4" height="10" fill="#333" transform="translate(0 11.5002)">
                        <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animateTransform>
                        </rect>
                        <rect x="20" y="0" width="4" height="10" fill="#333" transform="translate(0 1.83315)">
                        <animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite"></animateTransform>
                        </rect>
                    </svg>
                </div>
                <!--到底提示-->
                <span class="finsh" v-if="finsh">到底了</span>
            </div>
            <!--回到顶部-->
            <span class="goTop el-icon-upload2" @click="goToTop" v-if="isShowIcon"></span>
        </div>
        <v-footer></v-footer>

    </div>
</template>

<script>
    import Footer from '@/components/footer/footer.vue'

    export default{
        data(){
            return {
                search_text:"",
                imgs: ['https://i1.mifile.cn/a4/xmad_15239288768571_vWKBl.jpg', 'https://i1.mifile.cn/a4/xmad_15215117093672_sHtlv.jpg', 'https://i1.mifile.cn/a4/xmad_15239326211286_kjqUt.jpg'],
                recommend:[],         //商品数组
                limit:12,             //一次加载多少条数据
                number:0,             //总共加载了多少条数据
                isLoading:false,     //是否展示正在加载
                finsh:false,         //是否已经加载全部数据
                isShowIcon:false     //是否展示回到顶部
            }
        },
        components:{
            "v-footer": Footer
        },
        mounted(){
            this.getData();
            window.addEventListener('scroll', this.menu);
        },
        methods:{
            //搜索
            search(){
                this.$router.push({
                    path:"/client/result?text=" + this.search_text
                });
            },
            //加载数据
            getData(){
                let that = this;
                /*当数据没有将全部数据展示出来的时候才发送请求*/
                if(!this.finsh){
                    this.$http.get("/api/client/getRecommend",{
                        params:{
                            limit:this.limit,
                            count:this.number
                        }
                    }).then((response)=>{
                        let res = response.data;
                        /*数据已经完成加载完*/
                        if(res.status === "00"){
                            that.finsh = true;
                            that.isLoading = false;
                        }else if(res.status === "0"){
                            /*将新获取的数据添加到原来的数据上*/
                            that.recommend = that.recommend.concat(res.result);
                            that.number += that.limit;
                            that.isLoading = false;
                        }
                    })
                }
            },
            //滚动事件
            menu() {
                //真实内容的高度
                var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
                //视窗的高度
                var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
                //隐藏的高度
                var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

                //判断是否显示回到顶部
                if(scrollHeight > 0){
                    this.isShowIcon = true;
                }else{
                    this.isShowIcon = false;
                }

                //判断滚动条是否滚动到了底部
                if(pageHeight - viewportHeight - scrollHeight <=40){
                    //事件
                    if(this.isLoading == false){
                        this.isLoading = true;
                        this.getData();
                        console.log(this.number);
                    }
                }
            },
            jumpGood(good){
                this.selectGood = good;
                let id = good._id;
                this.$router.push({
                    path:'/client/goodsList/good?id=' + id
                });
            },
            goToTop(){
                //真实内容的高度
                var pageHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight);
                //视窗的高度
                var viewportHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
                //隐藏的高度
                var scrollHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

                let begin = 0, end = 0, timer = null;
                begin = scrollHeight;
                timer = setInterval(function () {
                    begin = begin + (end - begin) * 0.2;
                    window.scrollTo(0,begin);
                    console.log(scrollHeight);
                    if(Math.round(begin) === end){
                        clearInterval(timer);
                    }
                },20)
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .home{
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
        .recommend {
            width: 100%;
            padding: 10px 0px 0;
            box-sizing: border-box;
            overflow: hidden;
            margin-bottom: 50px;
            .list{
                position: relative;
                overflow: hidden;
                .item{
                    float: left;
                    display: inline-block;
                    box-sizing: border-box;
                    width:50%;
                    height:70px;
                    margin: 10px 0px;
                    padding:0 10px;
                    font-size: 12px;
                    color: #999;
                    img{
                        float: left;
                        width:50px;
                        height:50px;
                        margin-right: 15px;
                    }
                }
                .loading{
                    position: absolute;
                    bottom:10px;
                    left: 0;
                    width: 100%;
                    height: 10px;
                    text-align: center;
                }
                .finsh{
                    position: absolute;
                    bottom:8px;
                    left: 0;
                    width: 100%;
                    height: 10px;
                    text-align: center;
                    font-size: 12px;
                    color: #999;
                }
            }
            .goTop{
                position: fixed;
                right: 20px;
                bottom: 60px;
                width: 30px;
                height: 30px;
                z-index:20;
                background-color: #ff7619;
                color: #fff;
                border-radius: 50%;
                text-align: center;
                line-height: 30px;
            }
        }
    }

</style>
