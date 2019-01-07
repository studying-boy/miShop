<template>
    <div class="goodsList">
        <!--左边菜单栏目-->
        <div class="menu-wrapper" ref="menuWrapper">
            <ul>
                <li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}"  @click="selectMenu(index)">
                <span class="text">
                    {{item.name}}
                </span>
                </li>
            </ul>
        </div>
        <!--右边商品栏目-->
        <div class="good-wrapper good-wrapper-hook" ref="goodsWrapper">
            <ul>
                <li v-for="item in goods" class="goods-list" ref="goodList">
                    <h1 class="title">{{item.name}}</h1>
                    <ul>
                        <li v-for="good in item.children" class="good-item"  @click="jumpGood(good)" v-if="good.number>0">
                            <div class="good-image">
                                <img v-lazy="good.image" width="57px" height="57px">
                            </div>
                            <div class="content">
                                <h2 class="name">{{good.name}}</h2>
                                <p class="desc">{{good.description}}</p>
                                <div class="extra">
                                    <span class="count">库存{{good.number}}</span>
                                </div>
                                <div class="price">
                                    <span class="new">￥{{good.price}}</span><span class="old" v-if="good.oldPrice">￥{{good.oldPrice}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <v-footer></v-footer>
        <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
    import BScroll from 'better-scroll';
    import Footer from '@/components/footer/footer.vue'

    export default{
        data(){
            return {
                goods:[],
                listHeight: [],      //记录每个大标签对应的初始高度
                scrollY: 0,           //记录屏幕当前的高度
                selectGood:{}
            }
        },
        components:{
            "v-footer":Footer
        },
        computed:{
            currentIndex(){ //记录当前商品的滑动高度，高亮显示对应的菜单
                for(let i = 0; i < this.listHeight.length; i++){
                    let height1 = this.listHeight[i];
                    let height2 = this.listHeight[i+1];
                    if(this.scrollY >= height1 && this.scrollY < height2){
                        /*if(this.scrollY > this.listHeight[this.listHeight.length - 3] + 100){
                            return i + 1;
                        }*/
                        return i;
                    }
                }
                return 0;
            },
        },
        mounted(){
            this.$http.get("/api/client/goods").then((response)=>{
                let res = response.data;
                if(res.status === "0"){
                    this.goods = res.result;
                    this.$nextTick(()=>{            //防止异步处理,在修改数据之后发生
                        this._initScroll();
                        this._calculateHeight();
                    })
                }else{
                    console.log("获取数据失败");
                }
            });
        },
        methods:{
            _initScroll(){            //滚动插件初始化
                this.menuScroll = new BScroll(this.$refs.menuWrapper, {
                    click: true
                });
                this.goodsScroll = new BScroll(this.$refs.goodsWrapper, {
                    click:true,
                    probeType: 3              //实行实时监控高度
                });

                this.goodsScroll.on('scroll', (pos)=>{
                    //判断滑动方向，避免下拉时分类高亮显示（如第一分类商品数量为1时，下拉使得第二分类高亮）
                    if(pos.y <= 0){
                        this.scrollY = Math.abs(Math.round(pos.y));
                    }
                })
            },
            _calculateHeight(){       //获取每个内容区的高度
                let goodList = this.$refs.goodList;
                let height = 0;
                this.listHeight.push(height);
                for(let i = 0; i < goodList.length; i++){
                    let item = goodList[i];
                    height += item.clientHeight;
                    this.listHeight.push(height);
                }
            },
            selectMenu(index){        //点击标题跳转到相应的内容区
                let el = this.$refs.goodList[index];
                this.goodsScroll.scrollToElement(el, 300);
            },
            jumpGood(good){
                this.selectGood = good;
                let id = good._id;
                this.$router.push({
                    path:'/client/goodsList/good?id=' + id
                });
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .goodsList{
        display: flex;
        position: absolute;
        top:0;
        bottom:0px;
        width:100%;
        overflow: hidden;
        .menu-wrapper{
            width:80px;
            background: #f3f5f7;
            margin-bottom:50px;
            .menu-item{
                display: table;
                width:56px;
                height:54px;
                padding:0 12px;
                line-height: 14px;
                &.current{
                    position: relative;
                    z-index: 10;
                    margin-top: -1px;
                    border-bottom: none;
                    background: #fff;
                    font-weight: 700;
                    .text{
                        border-bottom: none;
                    }
                }
                .text{
                    display: table-cell;
                    width:56px;
                    vertical-align: middle;
                    font-size: 12px;
                    font-weight: 200;
                    text-align: center;
                    border-bottom: 1px solid rgba(7,17,27,0.1);
                    cursor: pointer;
                    .icon{
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        margin-right: 2px;
                        vertical-align: top;
                        background-size: cover;
                    }
                    .good-item{
                        display: block;
                        padding:10px;
                        .good-image{
                            display:block;
                            width: 64px;
                            height:64px;
                        }
                    }
                }
            }
        }
        .good-wrapper{
            flex:1;
            margin-bottom: 50px;
            .goods-list{
                .title{
                    height:26px;
                    line-height: 26px;
                    font-size: 12px;
                    padding-left: 14px;
                    color: rgb(147,153,159);
                    background: #f3f5f7;
                    border-left: 2px solid #d9dde1;
                }
                .good-item{
                    display: flex;
                    margin:18px 18px 0 18px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(7,17,27,0.1);
                    &:last-child{
                        border-bottom: none;
                    }
                    .good-image{
                        width: 57px;
                        height: 57px;
                        margin-right: 10px;
                    }
                    .content{
                        position: relative;
                        flex: 1;
                        .name{
                            font-size: 14px;
                            color: rgb(7,17,27);
                            line-height: 14px;
                            margin-top: 2px;
                        }
                        .desc, .extra{
                            font-size: 10px;
                            line-height: 10px;
                            color: rgb(147,153,159);
                            margin-top: 8px;
                        }
                        .desc{
                            line-height: 12px;
                        }
                        .extra{
                            .count{
                                margin-right: 12px;
                            }
                        }
                        .price{
                            line-height: 24px;
                            font-weight: 700;
                            .new{
                                font-size: 14px;
                                color: rgb(240,20,20);
                                margin-right: 8px;
                            }
                            .old{
                                font-size: 10px;
                                color: rgb(147,153,159);
                                text-decoration: line-through;
                            }
                        }
                        .carControl-wrapper{
                            position: absolute;
                            right: 0;
                            bottom: -6px;
                        }
                    }
                }
            }
        }
    }
</style>
