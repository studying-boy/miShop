<template>
    <transition name="fade">
        <div class="setting">
            <v-subpage title="设置">
                <ul class="list" slot="content">
                    <router-link to="/client/personalPage/personalInfo">
                        <li class="list-item">
                            <span>个人资料</span>
                            <i class="el-icon-arrow-right"></i>
                        </li>
                    </router-link>
                    <router-link to="/client/personalPage/address">
                        <li class="list-item">
                            <span>收货地址</span>
                            <i class="el-icon-arrow-right"></i>
                        </li>
                    </router-link>
                </ul>
            </v-subpage>
        </div>
    </transition>
</template>

<script>
    import subpage from '@/components/subpage/subpage.vue';

    export default{
        props:["user"],
        data(){
            return{

            }
        },
        components:{
            "v-subpage":subpage
        },
        methods:{
            lastStep(){
                this.$router.go(-1);
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .setting{
        position: absolute;
        width:100%;
        left:0;
        top:0;
        overflow: hidden;
        z-index: 1000;
        &.fade-enter-active,&.fade-leave-active{
            transition: all 0.2s ease;
        }
        &.fade-enter,&.fade-leave-active{
            left:-100%;
        }
        .list{
            color: #999;
            background: #fff;
            border-top: 1px solid rgba(7,17,27,0.1);
            .list-item{
                display: block;
                height:40px;
                line-height: 40px;
                margin:0 20px;
                border-bottom: 1px solid rgba(7,17,27,0.1);
                color: #999;
                .el-icon-arrow-right{
                    float: right;
                    line-height: 40px;
                }
            }
        }
    }

</style>
