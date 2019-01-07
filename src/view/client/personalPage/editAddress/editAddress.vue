<template>
    <transition name="fade">
        <div class="editAddress">
            <v-subpage title="编辑地址">
                <van-address-edit
                    :area-list="areaList"
                    show-postal
                    show-set-default
                    show-search-result
                    @save="onSave"
                    slot="content"
                />
            </v-subpage>
        </div>
    </transition>
</template>


<script>
    import subpage from '@/components/subpage/subpage.vue';
    import area from '@/common/js/area.js'

    export default{
        data(){
            return {
                areaList:area,
            }
        },
        components: {
            "v-subpage": subpage
        },
        methods:{
            onSave(content) {
                let that = this;
                this.$http.post("/api/client/editAddress",{
                    content:content
                }).then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.$message({
                            message: '恭喜你，这是一条成功消息',
                            type: 'success'
                        });
                        //that.$router.push("/client/personalPage/address");
                        that.$router.go(-1);
                    }
                })
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
</style>
