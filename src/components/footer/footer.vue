<template>
    <div class="footer">
        <div class="tab">
            <div class="tab-item">
                <router-link to="/client/home">
                    <i class="icon icon-home"></i>
                    <span class="text">首页</span>
                </router-link>
            </div>
            <div class="tab-item">
                <router-link to="/client/goodsList">
                    <i class="icon icon-paragraph-left"></i>
                    <span class="text">分类</span>
                </router-link>
            </div>
            <div class="tab-item">
                <router-link to="/client/shopCart">
                    <i class="icon icon-shopping_cart"></i>
                    <span class="text">购物车</span>
                </router-link>
            </div>
            <div class="tab-item">
                <router-link to="/client/personalPage">
                    <i class="icon icon-user"></i>
                    <span class="text">我的</span>
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default{}
</script>

<style lang="scss" rel="stylesheet/scss">
    .footer{
        position: fixed;
        left:0;
        bottom: 0;
        width:100%;
        height:50px;
        z-index: 10;
        background: #fff;
        transform: translateZ(0);
        .tab{
            position: absolute;
            display: flex;
            width: 100%;
            padding: 5px 0;
            text-align: center;
            border-top: 1px solid rgba(7, 17, 27, 0.1);
            box-sizing: border-box;
            .tab-item{
                flex: 1;
                a{
                    display: block;
                    font-size: 14px;
                    color: rgb(77, 85, 93);
                    &.active{
                        color: rgb(240, 20, 20);
                    }
                    .icon{
                        display: block;
                        margin-bottom: 5px;
                    }
                }
            }
        }
    }
</style>
