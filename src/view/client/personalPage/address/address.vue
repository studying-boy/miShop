<template>
    <transition name="fade">
        <div class="address">
            <v-subpage title="管理地址">
                <div slot="content">
                    <ul class="address-list"  v-if="addressList.length>0">
                        <li v-for="(address,index) in addressList" class="address-item">
                            <div class="header">
                                <span>{{address.name}}</span>
                                <span>{{address.tel}}</span>
                            </div>
                            <div class="main">{{address.province}}{{address.city}}{{address.county}}{{address.address_detail}}</div>
                            <div>
                                <el-button @click="editAddress(address)" size="small">编辑</el-button>
                                <el-button @click="deleteAddress(address._id)" size="small">删除</el-button>
                            </div>
                        </li>
                    </ul>
                    <div>
                        <el-button class="add" @click="addAddress">增添新地址</el-button>
                    </div>
                </div>
            </v-subpage>
        </div>
    </transition>
</template>

<script>
    import subpage from '@/components/subpage/subpage.vue';

    export default{
        data(){
            return {
                chosenAddressId: '1',
                addressList:[]
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
                this.$http.get("/api/client/address").then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.addressList = res.result;
                    }
                })
            },
            addAddress() {
                this.$router.push("/client/personalPage/editAddress");
            },
            editAddress(id) {
                alert(id);
            },
            deleteAddress(id){
                let that = this;
                this.$http.post("/api/client/deleteAddress",{
                    address_id:id
                }).then((response)=>{
                    let res = response.data;
                    if(res.status === "0"){
                        that.init();
                    }
                })
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss">
    .address{
        .address-list{
            padding:20px;
            color: rgba(0,0,0,0.7);
            .address-item{
                padding:10px 10px;
                border:1px solid #ccc;
                .header{
                    margin-bottom: 5px;
                }
                .main{
                    margin-bottom: 5px;
                }
            }
        }
        .add{
            display: block;
            margin:10px auto;
        }
    }

</style>
