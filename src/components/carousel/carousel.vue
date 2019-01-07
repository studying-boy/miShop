/*
 * 需要传递过来的参数：图片数组[图片地址，跳转地址]
 *
 *
*/
<template>
    <div class="carousel">
        <div class="pic-wrapper">
            <transition-group tag="ul" class="pic-list" name="image">
                <li class="pic-item" v-for="(image,index) in imgs" v-show="index === mark" :key="index" @mouseover="stop" @mouseout="play" @click="goto(image)">
                    <img :src="image">
                </li>
            </transition-group>
            <ul class="bullet-list">
                <li v-for="(image,index) in imgs" class="bullet-item" :class="{'active':index === mark}" @click="change(index)"></li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return {
                mark:0,
                timer:null,
                transitionEnd: true,
                imgs: ['https://i1.mifile.cn/a4/xmad_15239288768571_vWKBl.jpg', 'https://i1.mifile.cn/a4/xmad_15215117093672_sHtlv.jpg', 'https://i1.mifile.cn/a4/xmad_15239326211286_kjqUt.jpg']
            }
        },
        methods:{
            play(){
                this.stop();
                this.timer = setInterval(this.autoPlay, 3000);
            },
            autoPlay(){
                this.mark++;
                if(this.mark == this.imgs.length){
                    this.mark = 0;
                    return;
                }
            },
            change(i){
                this.mark = i;
                this.play();
            },
            stop(){
                clearInterval(this.timer);
                this.timer = null;
            },
            goto(src){
                console.log(src);
            }
        },
        created(){
            this.play()
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .carousel{
        height:200px;
        .pic-wrapper{
            position: relative;
            width:100%;
            height:200px;
            overflow: hidden;
            white-space: nowrap;
            .pic-list{
                font-size: 0;
                .pic-item{
                    position:absolute;
                    display: inline-block;
                    &.image-enter-active {
                        transform: translateX(0);
                        transition: all 1s ease;
                    }
                    &.image-leave-active {
                        transform: translateX(-100%);
                        transition: all 1s ease;
                    }
                    &.image-enter {
                        transform: translateX(100%)
                    }
                    &.image-leave {
                        transform: translateX(0)
                    }
                    img{
                        display: inline-block;
                        width: 100%;
                        height:200px;
                    }
                }
            }
            .bullet-list{
                position: absolute;
                bottom:10px;
                width:100%;
                text-align: center;
                .bullet-item{
                    display: inline-block;
                    width:20px;
                    height:20px;
                    transform: scale(0.5);
                    box-sizing: border-box;
                    padding:0 8px;
                    margin:0 5px;
                    background: white;
                    border-radius: 50%;
                    cursor: pointer;
                    &.active{
                        padding:0 10px;
                        transform: scale(0.75);
                        background: red;
                    }
                }

            }
        }
    }
</style>
